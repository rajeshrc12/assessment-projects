import { jwt_expire, jwt_secret } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { name } = req.body;

    // Create user (your existing code)
    const user = await prisma.user.create({
      data: { name },
    });

    // Generate JWT
    const token = jwt.sign({ id: user.id }, jwt_secret, {
      expiresIn: jwt_expire,
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.json({ message: "Logged in", user });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Login failed" });
  }
};
