import { PrismaClient } from "../generated/prisma/client.ts";

const prisma = new PrismaClient();

export default async (tasks) => {
  const results = [];

  for (const { id, time } of tasks) {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time * 1000);
    });
    await prisma.task.update({
      where: { id },
      data: { status: "success" },
    });
    results.push({ id, time });
  }

  return results;
};
