import { parentPort, workerData } from "worker_threads";

const { id, tasks } = workerData;

console.log(`Worker ${id} started with ${tasks.length} tasks`);

async function processTask(task) {
  return new Promise((resolve) => {
    const { number } = task;
    console.log(`Worker ${id} processing ${number}s task`);

    setTimeout(() => {
      const message = `Worker ${id} completed ${number}s task`;
      console.log(message);
      resolve(message);
    }, number * 1000);
  });
}

(async () => {
  const results = [];
  for (const task of tasks) {
    const result = await processTask(task);
    results.push(result);
  }

  parentPort.postMessage({
    workerId: id,
    results,
  });
})();
