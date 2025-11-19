import { workerManager } from "../config/worker.js";

export const executeTasks = async (job) => {
  try {
    const { tasks, currentCpu } = job;
    if (!Array.isArray(tasks) || tasks.length === 0)
      throw new Error("Provide an array of tasks");
    workerManager.setCurrentCpu(currentCpu);
    workerManager.addTasks(tasks);
    return;
  } catch (error) {
    console.error("Error executing tasks:", error);
  }
};
