import express from "express";
import jobRouter from "./job.js";
import cpuRouter from "./cpu.js";

const router = express.Router();

router.use("/job", jobRouter);
router.use("/cpu", cpuRouter);

export default router;
