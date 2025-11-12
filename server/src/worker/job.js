import os from "os";
import { Worker } from "worker_threads";

const numCPUs = os.cpus().length;

function runWorker(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./src/worker/factorial.js", { workerData });

    worker.on("message", (msg) => resolve(msg));
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

export const executeTasks = async (job) => {
  try {
    const tasks = job?.tasks;
    if (!Array.isArray(tasks) || tasks.length === 0)
      throw new Error("Provide an array of tasks");

    console.log(`Detected ${numCPUs} CPU cores`);
    console.log(`Received ${tasks.length} tasks`);
    console.time("parallel-tasks");

    const taskGroups = Array.from({ length: numCPUs }, () => []);

    tasks.forEach((task, index) => {
      const coreIndex = index % numCPUs;
      taskGroups[coreIndex].push(task);
    });

    const promises = taskGroups.map((group, index) =>
      group.length > 0
        ? runWorker({ id: index + 1, tasks: group })
        : Promise.resolve(null)
    );

    const results = await Promise.all(promises);

    console.timeEnd("parallel-tasks");
    console.log("All workers completed");
    console.log(results);

    return results;
  } catch (error) {
    console.error("Error executing tasks:", error);
  }
};
