import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { isBlacklisted } from "../utils/redisClient";
import { logAction } from "../services/audit.service";
import type { UserRole } from "@prisma/client";
import { AuthRequest } from "../types/auth.types";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      await logAction("AUTH_MISSING_TOKEN", undefined);
      return res.status(401).json({ message: "No token provided" });
    }

    const [scheme, token] = auth.split(" ");
    if (scheme !== "Bearer" || !token) {
      await logAction("AUTH_INVALID_FORMAT", undefined);
      return res.status(401).json({ message: "Invalid token format" });
    }

    if (await isBlacklisted(token)) {
      await logAction("AUTH_TOKEN_REVOKED", undefined);
      return res.status(401).json({ message: "Token revoked" });
    }

    const payload = verifyToken(token);
    if (!payload) {
      await logAction("AUTH_INVALID_TOKEN", undefined);
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch (err) {
    console.error(err);
    await logAction("AUTH_ERROR", undefined, { error: (err as Error).message });
    res.status(500).json({ message: "Authentication error" });
  }
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Forbidden" });
    next();
  };
};
