import os from "os";

const cpuCount = os.cpus().length;
const taskWorkerPath = "./src/worker/task.js";
export { cpuCount, taskWorkerPath };
