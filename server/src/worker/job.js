import os from "os";
import Piscina from "piscina";
import BetterQueue from "better-queue";

const numCPUs = os.cpus().length;

const piscina = new Piscina({
  filename: "./src/worker/factorial.js",
  maxThreads: numCPUs,
});

const queue = new BetterQueue(
  async (task, done) => {
    try {
      console.log(`Processing Task ID ${task.id}`);
      const result = await piscina.run(task);
      console.log(`Task ${task.id} completed`);
      done(null, result);
    } catch (err) {
      console.error(`Task ${task.id} failed`, err);
      done(err);
    }
  },
  {
    concurrent: numCPUs, // how many tasks to process simultaneously
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
      if (!t.id && !t.number) {
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
