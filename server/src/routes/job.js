import express from "express";
import { addJob, getJobs } from "../controllers/job.js";

const jobRouter = express.Router();

jobRouter.get("/", getJobs);
jobRouter.post("/", addJob);

export default jobRouter;
