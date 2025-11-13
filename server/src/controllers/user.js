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

    console.log(user, userId);
    return res.json({ ...user, availableCpu: cpuCount });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
};
