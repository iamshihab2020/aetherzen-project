import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  createUserByAdmin,
} from "../controllers/auth.controller";
import { authLimiter } from "../middlewares/rate-limiter";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware";

const router = express.Router();

// Public
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

// Admin-only: create users with any role
router.post(
  "/admin/users",
  authMiddleware,
  authorizeRoles("HOSPITAL_ADMIN"),
  createUserByAdmin
);

export default router;
