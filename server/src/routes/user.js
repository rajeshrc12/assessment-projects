import express from "express";
import { getUser, userEvents } from "../controllers/user.js";

const userRouter = express.Router();

userRouter.get("/", getUser);
userRouter.get("/events", userEvents);

export default userRouter;
