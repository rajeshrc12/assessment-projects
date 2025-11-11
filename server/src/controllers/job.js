import { prisma } from "../config/prisma.js";

export const getJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
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
    const { name, tasks = [] } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Job name is required" });
    }

    const job = await prisma.job.create({
      data: {
        name,
        tasks: tasks?.length
          ? {
              create: tasks.map((task) => ({
                name: task.name,
              })),
            }
          : undefined,
      },
      include: { tasks: true },
    });

    return res.status(201).json(job);
  } catch (error) {
    console.error("Error adding job:", error);
    return res.status(500).json({ error: "Failed to add job" });
  }
};
