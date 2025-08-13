// src/controllers/authController.ts
import { Request, Response } from "express";
import prisma from "../prismaClient";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt";
import { registerSchema, loginSchema } from "../utils/auth.validation";
import { logAction } from "../services/audit.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { addToBlacklist } from "../utils/redisClient";
import { ZodError } from "zod";

export const register = async (req: AuthRequest, res: Response) => {
  try {
    // Validate input with proper error handling
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      // Use ZodError formatting for errors
      const errorDetails =
        validation.error instanceof ZodError
          ? validation.error.format()
          : validation.error;

      return res.status(400).json({
        message: "Validation error",
        errors: errorDetails,
      });
    }

    const { email, password, name, role } = validation.data;

    // HIPAA: Only admins can create non-patient users
    if (
      role !== "PATIENT" &&
      (!req.user || req.user.role !== "HOSPITAL_ADMIN")
    ) {
      await logAction("UNAUTHORIZED_ROLE_ASSIGNMENT", req.user?.userId, {
        attemptedRole: role,
      });
      return res
        .status(403)
        .json({ message: "Only admins can create non-patient users" });
    }

    // Existing user check
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      // Use undefined instead of null for userId
      await logAction("REGISTER_ATTEMPT_EXISTING_EMAIL", undefined, { email });
      return res.status(409).json({ message: "User already exists" });
    }

    // Create user
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hash, name, role },
    });

    // Audit log
    await logAction("USER_REGISTERED", user.id, { role: user.role });

    const token = signToken({ userId: user.id, role: user.role });
    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate input with proper error handling
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      // Use ZodError formatting for errors
      const errorDetails =
        validation.error instanceof ZodError
          ? validation.error.format()
          : validation.error;

      return res.status(400).json({
        message: "Validation error",
        errors: errorDetails,
      });
    }

    const { email, password } = validation.data;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Use undefined instead of null for userId
      await logAction("LOGIN_ATTEMPT_INVALID_EMAIL", undefined, { email });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      await logAction("LOGIN_ATTEMPT_INVALID_PASSWORD", user.id);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Audit log
    await logAction("USER_LOGGED_IN", user.id);

    const token = signToken({ userId: user.id, role: user.role });
    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Refresh token endpoint
export const refreshToken = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, role: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newToken = signToken({ userId: user.id, role: user.role });
    res.json({ token: newToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout endpoint
export const logout = async (req: Request, res: Response) => {
  try {
    // Invalidate token (add to Redis blacklist)
    const token = req.headers.authorization?.split(" ")[1] || "";
    if (token) {
      await addToBlacklist(token);
    }
    res.json({ message: "Successfully logged out" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
