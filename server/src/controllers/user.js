import { cpuCount } from "../config/common.js";
import { prisma } from "../config/prisma.js";

export const getUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        jobs: {
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
