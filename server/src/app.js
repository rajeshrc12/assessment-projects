import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import { frontend_url } from "./config/env.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: frontend_url,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.use("/", router);

export default app;
