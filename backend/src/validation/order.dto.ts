import { z } from "zod";

export const OrderItemInputSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  qty: z.coerce.number().int().positive(),
});

export const CreateOrderSchema = z.object({
  items: z.array(OrderItemInputSchema).min(1),
  isEmergency: z.coerce.boolean().optional().default(false),
  isTaxExempt: z.coerce.boolean().optional().default(false),
});

export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;
