// src/validation/category.validation.ts
import { z } from "zod";
import xss from "xss";

const clean = (s: string) => xss(s.trim());

export const CreateCategorySchema = z.object({
  name: z.string().min(2).max(100).transform(clean),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/)
    .transform(clean),
  description: z
    .string()
    .max(500)
    .optional()
    .transform((s) => (s ? clean(s) : s)),
  // Convert empty strings to undefined
  parentId: z
    .string()
    .optional()
    .transform((id) => (id?.trim() ? id : undefined)),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();
