// src/validation/product.validation.ts
import { z } from "zod";
import xss from "xss";

const clean = (s: string) => xss(s.trim());

export const VariantSchema = z.object({
  size: z
    .string()
    .min(1)
    .max(64)
    .optional()
    .transform((v) => (v ? clean(v) : v)),
  model: z
    .string()
    .min(1)
    .max(64)
    .optional()
    .transform((v) => (v ? clean(v) : v)),
  certifications: z
    .array(z.string().min(1).max(32).transform(clean))
    .optional()
    .default([]),
  additionalPrice: z.coerce.number().optional(),
});

export const CreateProductSchema = z.object({
  name: z.string().min(2).max(160).transform(clean),
  description: z.string().min(2).max(5000).transform(clean),
  price: z.coerce.number().nonnegative(),
  categoryId: z.string().min(1),
  stock: z.coerce.number().int().nonnegative().default(0),
  isRestricted: z.coerce.boolean().optional().default(false),
  // Add isEmergencyItem to the schema
  isEmergencyItem: z.coerce.boolean().optional().default(false),
  variants: z.array(VariantSchema).optional().default([]),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const ListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  categoryId: z.string().optional(),
  certification: z.string().optional(),
  search: z
    .string()
    .optional()
    .transform((v) => (v ? clean(v) : v)),
});
