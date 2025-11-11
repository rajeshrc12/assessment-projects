import express from "express";
import jobRouter from "./job.js";

const router = express.Router();

router.use("/job", jobRouter);

export default router;
