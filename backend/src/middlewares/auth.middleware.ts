import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { isBlacklisted } from "../utils/redisClient";
import { logAction } from "../services/audit.service";

export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

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

    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      await logAction("AUTH_INVALID_FORMAT", undefined);
      return res.status(401).json({ message: "Invalid token format" });
    }

    const token = parts[1];

    // Check if token is blacklisted (new security feature)
    if (await isBlacklisted(token)) {
      await logAction("AUTH_TOKEN_REVOKED", undefined);
      return res.status(401).json({ message: "Token revoked" });
    }

    const payload = verifyToken(token) as any;
    if (!payload) {
      await logAction("AUTH_INVALID_TOKEN", undefined);
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch (err) {
    console.error(err);
    // @ts-expect-error
    await logAction("AUTH_ERROR", undefined, { error: err.message });
    res.status(500).json({ message: "Authentication error" });
  }
};

// Unchanged - maintains your original role authorization
export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
