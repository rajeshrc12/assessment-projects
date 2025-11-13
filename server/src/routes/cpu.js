import express from "express";
import { getCpuCount } from "../controllers/cpu.js";

const cpuRouter = express.Router();

cpuRouter.get("/", getCpuCount);

export default cpuRouter;
