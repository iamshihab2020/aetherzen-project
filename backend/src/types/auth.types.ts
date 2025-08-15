// backend/src/types/auth.ts
import type { Request } from "express";
import type { UserRole } from "@prisma/client";

export interface TokenPayload {
  userId: string;
  role: UserRole;
  [key: string]: unknown;
}

export interface AuthUser {
  userId: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export type JsonObject = Record<string, unknown>;
