import express from "express";
import { addJob, getJobs, terminateJob } from "../controllers/job.js";

const jobRouter = express.Router();

jobRouter.get("/", getJobs);
jobRouter.post("/", addJob);
jobRouter.post("/terminate", terminateJob);

export default jobRouter;
