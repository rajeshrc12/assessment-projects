import Piscina from "piscina";
import BetterQueue from "better-queue";
import { prisma } from "../config/prisma.js";
import { cpuCount } from "../config/common.js";
import { distributeTasks } from "../utils/cpu.js";
import { database_url } from "../config/env.js";

const piscina = new Piscina({
  filename: "./src/worker/factorial.js",
  maxThreads: cpuCount,
  env: {
    DATABASE_URL: database_url,
  },
});

const queue = new BetterQueue(
  async (job, done) => {
    try {
      const tasks = job?.tasks || [];
      const currentCpu = Number(job?.currentCpu);
      const groupedTasks = distributeTasks(tasks, currentCpu);
      const results = await Promise.all(
        groupedTasks.map((group) => piscina.run(group))
      );
      await Promise.all(
        results.flat().map(({ id }) =>
          prisma.task.update({
            where: { id },
            data: { status: "success" },
          })
        )
      );

      done(null, results);
    } catch (err) {
      console.error(`Job ${job.id} failed`, err);
      done(err);
    }
  },
  { concurrent: 4 }
);

queue.on("drain", () => {
  console.log("All tasks in queue processed");
});
queue.on("task_finish", (taskId, result) => {
  console.log(`Task finished:`, result);
});

export const executeTasks = async (job) => {
  try {
    const tasks = job?.tasks;
    if (!Array.isArray(tasks) || tasks.length === 0)
      throw new Error("Provide an array of tasks");

    queue.push(job, (err, result) => {
      if (err) console.error(`Queue error for job ${job.id}:`, err);
    });

    return;
  } catch (error) {
    console.error("Error executing tasks:", error);
  }
};
