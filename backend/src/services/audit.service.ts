// src/services/auditService.ts
import prisma from "../prismaClient";

export const logAction = async (
  action: string,
  userId?: string,
  details?: any
) => {
  try {
    return await prisma.auditLog.create({
      data: {
        action,
        userId,
        details: details || {},
      },
    });
  } catch (err) {
    console.error("Failed to create audit log:", err);
  }
};
