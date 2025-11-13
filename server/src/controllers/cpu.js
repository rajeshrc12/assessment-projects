import { cpuCount } from "../config/common.js";

export const getAvailableCpuCount = async (req, res) => {
  try {
    return res.json({ count: cpuCount });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

export const changeCurrentCpuCount = async (req, res) => {
  try {
    const { count } = req.body;
    const userId = req.user.id;
    const user = await prisma.user.update({
      where: { id: userId },
      data: { currentCpu: count },
    });
    return res.json(user);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
};
