import { prisma } from "../config/prisma.js";
import { workerManager } from "../config/worker.js";
import { executeTasks } from "../worker/job.js";

export const getJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobs = await prisma.job.findMany({
      where: { id: userId },
      include: { tasks: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

export const addJob = async (req, res) => {
  try {
    const { name, tasks, currentCpu } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ error: "Job name is required" });
    }

    const job = await prisma.job.create({
      data: {
        name,
        userId,
        currentCpu,
        tasks: tasks?.length
          ? {
              create: tasks.map((task) => ({
                name: task.name,
                time: task.time,
                userId,
              })),
            }
          : undefined,
      },
      include: { tasks: true },
    });
    executeTasks(job);
    return res.status(201).json(job);
  } catch (error) {
    console.error("Error adding job:", error);
    return res.status(500).json({ error: "Failed to add job" });
  }
};

export const terminateJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    workerManager.terminateJob(jobId);
    const job = await prisma.task.updateMany({
      where: { jobId },
      data: { status: "terminated" },
    });
    return res.json(job);
  } catch (error) {
    console.error("Error while terminating job:", error);
    return res.status(500).json({ error: "Failed to terminate job" });
  }
};
