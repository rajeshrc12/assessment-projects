import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import { frontend_url } from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: frontend_url,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use("/", router);

export default app;
