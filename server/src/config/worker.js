import Piscina from "piscina";
import { cpuCount } from "./common.js";
import { prisma } from "../config/prisma.js";
import { sendUserEvent } from "../controllers/user.js";

class WorkerManager {
  constructor() {
    if (!WorkerManager.instance) {
      this.queue = [];
      this.currentCpu = 1;
      this.runningCpu = 0;
      this.isRunning = false;
      this.piscina = new Piscina({
        filename: "./src/worker/task.js",
        maxThreads: cpuCount,
      });

      WorkerManager.instance = this;
    }
    return WorkerManager.instance;
  }

  runNextTask() {
    if (this.isRunning) return;
    this.isRunning = true;

    while (this.runningCpu < this.currentCpu && this.queue.length) {
      const task = this.queue.shift();
      this.runningCpu++;
      this.handleTask(task);
    }

    this.isRunning = false;
  }
  async handleTask(task) {
    try {
      const result = await this.piscina.run(task);
      if (result?.id)
        await prisma.task.update({
          where: { id: task?.id },
          data: { status: "success" },
        });
    } catch (err) {
      await prisma.task.update({
        where: { id: task?.id },
        data: { status: "failed" },
      });
      console.error("Task failed:", err);
    } finally {
      sendUserEvent(task?.userId);
      this.runningCpu--;
      this.runNextTask();
    }
  }
  addTasks(tasks) {
    this.queue.push(...tasks);
    this.runNextTask();
  }

  setCurrentCpu(cpu) {
    const value = Number(cpu);
    this.currentCpu = Math.max(1, Math.min(cpuCount, value || 1));
  }
}

const workerManager = new WorkerManager();

export { workerManager };
