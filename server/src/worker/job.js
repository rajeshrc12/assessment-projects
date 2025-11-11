import { prisma } from "../config/prisma.js";
import { getFactorial } from "./factorial.js";

export const executeTasks = async (job) => {
  try {
    for (const task of job?.tasks) {
      const result = await getFactorial(task.number);
      console.log({
        where: { jobId: task.jobId },
        data: {
          result,
          status: "done",
        },
      });
      await prisma.task.update({
        where: { id: task.id },
        data: {
          result,
          status: "done",
        },
      });
    }
  } catch (error) {
    console.error("Error adding job:", error);
  }
};
