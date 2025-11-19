import Piscina from "piscina";
import { cpuCount, taskWorkerPath } from "./common.js";
import { prisma } from "../config/prisma.js";
import { sendUserEvent } from "../controllers/user.js";

class WorkerManager {
  constructor() {
    if (!WorkerManager.instance) {
      this.queue = [];
      this.currentCpu = 1;
      this.runningCpu = 0;
      this.isRunning = false;
      this.controllers = new Map();
      this.piscina = new Piscina({
        filename: taskWorkerPath,
        maxThreads: cpuCount,
      });

      WorkerManager.instance = this;
    }
    return WorkerManager.instance;
  }
  terminateJob(jobId) {
    this.queue = this.queue.filter((q) => q.jobId !== jobId);
    for (const [taskId, ctrl] of this.controllers.entries()) {
      if (taskId.startsWith(`${jobId}:`)) {
        ctrl.abort();
        this.controllers.delete(taskId);
      }
    }
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
    const controller = new AbortController();
    const key = `${task.jobId}:${task.id}`;
    this.controllers.set(key, controller);
    try {
      await this.piscina.run(task, { signal: controller.signal });

      await prisma.task.update({
        where: { id: task?.id },
        data: { status: "success" },
      });
    } catch (err) {
      if (controller.signal.aborted) {
        await prisma.task.update({
          where: { id: task?.id },
          data: { status: "terminated" },
        });
      } else {
        await prisma.task.update({
          where: { id: task?.id },
          data: { status: "failed" },
        });
        console.error("Task failed:", err);
      }
    } finally {
      sendUserEvent(task?.userId);
      this.controllers.delete(key);
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
