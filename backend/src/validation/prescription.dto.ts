import { z } from "zod";

export const CreatePrescriptionSchema = z.object({
  productId: z.string().uuid(),
});

export type CreatePrescriptionDto = z.infer<typeof CreatePrescriptionSchema>;

export const ListPrescriptionsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  userId: z.string().uuid().optional(), // admin filter
});
