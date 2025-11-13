import express from "express";
import jobRouter from "./job.js";
import cpuRouter from "./cpu.js";
import authRouter from "./auth.js";
import { verifyToken } from "../utils/jwt.js";
import userRouter from "./user.js";

const router = express.Router();

router.use("/job", verifyToken, jobRouter);
router.use("/user", verifyToken, userRouter);
router.use("/cpu", verifyToken, cpuRouter);
router.use("/auth", authRouter);

export default router;
