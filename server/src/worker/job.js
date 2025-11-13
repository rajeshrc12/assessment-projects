import os from "os";
import Piscina from "piscina";
import BetterQueue from "better-queue";
import { prisma } from "../config/prisma.js";
import { cpuCount } from "../config/common.js";

const piscina = new Piscina({
  filename: "./src/worker/factorial.js",
  maxThreads: cpuCount,
});

const queue = new BetterQueue(
  async (task, done) => {
    try {
      console.log(`Processing Task ID ${task.id}`);
      const result = await piscina.run(task);

      const taskUpdate = await prisma.task.update({
        where: { id: task.id },
        data: { status: "success" },
      });

      console.log(`Task ${task.id} completed`, taskUpdate);
      done(null, result);
    } catch (err) {
      const taskUpdate = await prisma.task.update({
        where: { id: task.id },
        data: { status: "failed" },
      });

      console.error(`Task ${task.id} failed`, err, taskUpdate);
      done(err);
    }
  },
  {
    concurrent: cpuCount,
  }
);

// Listen for queue-level events
queue.on("drain", () => {
  console.log("All tasks in queue processed");
  console.timeEnd("task");
});
queue.on("task_finish", (taskId, result) => {
  console.log(`Task finished:`, result);
});

export const executeTasks = async (job) => {
  try {
    const tasks = job?.tasks;
    if (!Array.isArray(tasks) || tasks.length === 0)
      throw new Error("Provide an array of tasks");

    const acceptedTasks = [];
    console.time("task");
    for (const t of tasks) {
      if (!t.id && !t.time) {
        console.warn(`Skipping invalid task:`, t);
        continue;
      }

      queue.push(t, (err, result) => {
        if (err) console.error(`Queue error for task ${t.id}:`, err);
      });

      console.log(`Task ${t.id} added to queue`);
      acceptedTasks.push(t.id);
    }

    return acceptedTasks;
  } catch (error) {
    console.error("Error executing tasks:", error);
  }
};
