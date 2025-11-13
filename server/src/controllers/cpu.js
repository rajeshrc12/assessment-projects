import { cpuCount } from "../config/common.js";

export const getCpuCount = async (req, res) => {
  try {
    return res.json({ count: cpuCount });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
};
