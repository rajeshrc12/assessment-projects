import express from "express";
import {
  changeCurrentCpuCount,
  getAvailableCpuCount,
} from "../controllers/cpu.js";

const cpuRouter = express.Router();

cpuRouter.get("/", getAvailableCpuCount);
cpuRouter.post("/", changeCurrentCpuCount);

export default cpuRouter;
