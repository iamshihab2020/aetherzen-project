import { Response } from "express";
import path from "path";
import fs from "fs";
import {
  CreatePrescriptionSchema,
  ListPrescriptionsQuerySchema,
} from "../validation/prescription.dto";
import { AuthRequest } from "../types/auth.types";
import prisma from "../prismaClient";

const PRIVATE_DIR = path.join(
  __dirname,
  "..",
  "..",
  "private",
  "prescriptions"
);

export class PrescriptionsController {
  // Patient uploads prescription for a product that requires it
  static async create(req: AuthRequest, res: Response) {
    const parsed = CreatePrescriptionSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ errors: parsed.error.flatten() });
    const userId = req.user?.userId!;
    const { productId } = parsed.data;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (!product.isPrescriptionRequired) {
      return res
        .status(400)
        .json({ message: "Prescription not required for this product" });
    }

    const file = req.file as Express.Multer.File | undefined;
    if (!file)
      return res.status(400).json({ message: "Prescription PDF is required" });

    const saved = await prisma.prescription.create({
      data: {
        userId,
        productId,
        filePath: path.relative(path.join(__dirname, "..", ".."), file.path), // store relative path
        status: "PENDING",
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "PRESCRIPTION_UPLOADED",
        userId,
        details: { productId, prescriptionId: saved.id },
      },
    });

    return res.status(201).json({ prescription: saved });
  }

  // Patient can see their own
  static async mine(req: AuthRequest, res: Response) {
    const userId = req.user?.userId!;
    const list = await prisma.prescription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { product: { select: { id: true, title: true } } },
    });
    return res.json({ items: list });
  }

  // Doctor/Admin: list & filter
  static async list(req: AuthRequest, res: Response) {
    const parsed = ListPrescriptionsQuerySchema.safeParse(req.query);
    if (!parsed.success)
      return res.status(400).json({ errors: parsed.error.flatten() });
    const { page, limit, status, userId } = parsed.data;

    const where: any = {
      ...(status ? { status } : {}),
      ...(userId ? { userId } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.prescription.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { id: true, email: true, name: true } },
          product: { select: { id: true, title: true } },
        },
      }),
      prisma.prescription.count({ where }),
    ]);

    return res.json({ items, total, page, pages: Math.ceil(total / limit) });
  }

  // Doctor/Admin: approve
  static async approve(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const pres = await prisma.prescription.update({
      where: { id },
      data: { status: "APPROVED" },
    });
    await prisma.auditLog.create({
      data: {
        action: "PRESCRIPTION_APPROVED",
        userId: req.user?.userId,
        details: { prescriptionId: id },
      },
    });
    return res.json({ prescription: pres });
  }

  // Doctor/Admin: reject
  static async reject(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const pres = await prisma.prescription.update({
      where: { id },
      data: { status: "REJECTED" },
    });
    await prisma.auditLog.create({
      data: {
        action: "PRESCRIPTION_REJECTED",
        userId: req.user?.userId,
        details: { prescriptionId: id },
      },
    });
    return res.json({ prescription: pres });
  }

  // Stream file securely (owner or reviewer)
  static async streamFile(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const pres = await prisma.prescription.findUnique({ where: { id } });
    if (!pres) return res.status(404).json({ message: "Not found" });

    // Owner, Doctor, or Hospital Admin
    const role = req.user?.role;
    const isOwner = pres.userId === req.user?.userId;
    const canView = isOwner || role === "DOCTOR" || role === "HOSPITAL_ADMIN";
    if (!canView) return res.status(403).json({ message: "Forbidden" });

    const absolute = path.join(__dirname, "..", "..", pres.filePath);
    if (!fs.existsSync(absolute))
      return res.status(410).json({ message: "File missing" });

    res.setHeader("Content-Type", "application/pdf");
    fs.createReadStream(absolute).pipe(res);
  }
}
