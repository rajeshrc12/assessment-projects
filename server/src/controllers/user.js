import { cpuCount } from "../config/common.js";
import { prisma } from "../config/prisma.js";

export const getUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        jobs: {
          orderBy: {
            updatedAt: "desc",
          },
          include: {
            tasks: true,
          },
        },
      },
    });
    const jobsWithTotalTime = user?.jobs.map((job) => {
      const jobStart = job.createdAt;

      const latestTask = job.tasks.length
        ? job.tasks.reduce((a, b) => (a.updatedAt > b.updatedAt ? a : b))
        : null;

      if (!latestTask) {
        return {
          ...job,
          totalTime: 0,
        };
      }

      const diffMs = latestTask.updatedAt - jobStart;
      const diffSec = (diffMs / 1000).toFixed(2);

      return {
        ...job,
        totalTime: diffSec,
      };
    });
    return res.json({
      ...user,
      jobs: jobsWithTotalTime,
      availableCpu: cpuCount,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

const clients = [];

export const userEvents = (req, res) => {
  const userId = req.user.id;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const client = { userId, res };
  clients.push(client);
  req.on("close", () => {
    const index = clients.indexOf(client);
    if (index !== -1) clients.splice(index, 1);
  });
};

export const sendUserEvent = (userId) => {
  clients
    .filter((c) => c.userId === userId)
    .forEach((c) => {
      c.res.write(`data: refresh\n\n`);
    });
};
