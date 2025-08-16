import { Response } from "express";
import { AuthRequest } from "../types/auth.types";
import { CreateOrderSchema } from "../validation/order.dto";
import prisma from "../prismaClient";
import { hasApprovedPrescription } from "../services/prescriptions.service";

export class OrdersController {
  static async create(req: AuthRequest, res: Response) {
    const parsed = CreateOrderSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ errors: parsed.error.flatten() });

    const userId = req.user?.userId!;
    const { items, isEmergency, isTaxExempt } = parsed.data;

    // Load all involved products & variants once
    const productIds = [...new Set(items.map((i) => i.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        title: true,
        priceCents: true,
        inventory: true,
        isPrescriptionRequired: true,
      },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validate all items
    for (const it of items) {
      const p = productMap.get(it.productId);
      if (!p)
        return res
          .status(400)
          .json({ message: `Invalid product: ${it.productId}` });

      if (p.isPrescriptionRequired) {
        const ok = await hasApprovedPrescription(userId, p.id);
        if (!ok) {
          return res.status(400).json({
            message: `Prescription required and not approved for product '${p.title}'.`,
            code: "PRESCRIPTION_REQUIRED",
            productId: p.id,
          });
        }
      }

      if (p.inventory < it.qty) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for '${p.title}'.` });
      }
    }

    // Compute totals (simple sum; taxes/discounts can be applied here)
    const totalCents = items.reduce((sum, it) => {
      const p = productMap.get(it.productId)!;
      return sum + p.priceCents * it.qty;
    }, 0);

    // Create order + items in a transaction & decrement inventory
    const created = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          totalCents,
          isEmergency: !!isEmergency,
          isTaxExempt: !!isTaxExempt,
          status: "PENDING",
        },
      });

      await tx.orderItem.createMany({
        data: items.map((it) => ({
          orderId: order.id,
          productId: it.productId,
          variantId: it.variantId || null,
          qty: it.qty,
          unitPriceCents: productMap.get(it.productId)!.priceCents,
        })),
      });

      for (const it of items) {
        await tx.product.update({
          where: { id: it.productId },
          data: { inventory: { decrement: it.qty } },
        });
      }

      await tx.auditLog.create({
        data: {
          action: "ORDER_CREATED",
          userId,
          details: { orderId: order.id, itemCount: items.length },
        },
      });

      return order;
    });

    return res.status(201).json({ order: created });
  }
}
