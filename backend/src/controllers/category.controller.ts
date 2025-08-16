// src/controllers/category.controller.ts
import { Request, Response } from "express";
import prisma from "../prismaClient";
import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from "../validation/category.dto";
import { logAction } from "../services/audit.service";
import { ZodError } from "zod";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const validation = CreateCategorySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.error.format(),
      });
    }

    const data = validation.data;

    // Check for duplicate slug
    const existingSlug = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      return res.status(400).json({
        message: "Slug must be unique",
      });
    }

    // Handle empty parentId after validation
    const parentId = data.parentId?.trim() ? data.parentId : null;

    // Validate parent category if provided
    if (parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parent) {
        return res.status(400).json({
          message: "Invalid parent category ID",
        });
      }
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        parentId: parentId,
      },
    });

    await logAction("CATEGORY_CREATED", req.user?.id, {
      categoryId: category.id,
    });

    res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  } catch (error: any) {
    console.error("Category creation error:", error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.format(),
      });
    }

    // Handle Prisma foreign key constraint errors
    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Invalid parent category reference",
      });
    }

    // Handle other errors
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const listCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        children: true,
        parent: true,
        products: {
          include: {
            ProductVariant: true,
            certifications: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Add productCount while keeping full products array
    const categoriesWithProducts = categories.map((category) => ({
      ...category,
      productCount: category.products.length,
    }));

    res.json({
      message: "Categories retrieved successfully",
      data: categoriesWithProducts,
    });
  } catch (error: any) {
    console.error("Category listing error:", error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.format(),
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        children: true,
        parent: true,
        products: {
          include: {
            ProductVariant: true,
            certifications: true,
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Add productCount to the category
    const categoryWithProducts = {
      ...category,
      productCount: category.products.length,
    };

    res.json({
      message: "Category retrieved successfully",
      data: categoryWithProducts,
    });
  } catch (error: any) {
    console.error("Category fetch error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  try {
    const validation = UpdateCategorySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.error.format(),
      });
    }

    const data = validation.data;
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Check for duplicate slug
    if (data.slug && data.slug !== existingCategory.slug) {
      const existingSlug = await prisma.category.findUnique({
        where: { slug: data.slug },
      });

      if (existingSlug) {
        return res.status(400).json({
          message: "Slug must be unique",
        });
      }
    }

    // Handle empty parentId after validation
    const parentId = data.parentId?.trim() ? data.parentId : null;

    // Validate parent category if provided
    if (parentId) {
      // Prevent circular reference
      if (parentId === categoryId) {
        return res.status(400).json({
          message: "Category cannot be its own parent",
        });
      }

      const parent = await prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parent) {
        return res.status(400).json({
          message: "Invalid parent category ID",
        });
      }

      // Prevent multi-level nesting
      if (parent.parentId) {
        return res.status(400).json({
          message: "Only one level of nesting is allowed",
        });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: data.name ?? existingCategory.name,
        slug: data.slug ?? existingCategory.slug,
        description: data.description ?? existingCategory.description,
        parentId: parentId ?? existingCategory.parentId,
      },
    });

    await logAction("CATEGORY_UPDATED", req.user?.id, {
      categoryId: updatedCategory.id,
    });

    res.json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error: any) {
    console.error("Category update error:", error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.format(),
      });
    }

    // Handle Prisma foreign key constraint errors
    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Invalid parent category reference",
      });
    }

    // Handle other errors
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const removeCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  try {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        children: true,
        products: true,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Prevent deletion if category has products
    if (category.products.length > 0) {
      return res.status(400).json({
        message: "Cannot delete category with associated products",
      });
    }

    // Prevent deletion if category has children
    if (category.children.length > 0) {
      return res.status(400).json({
        message: "Cannot delete category with child categories",
      });
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    await logAction("CATEGORY_DELETED", req.user?.id, {
      categoryId: category.id,
    });

    res.status(204).send();
  } catch (error: any) {
    console.error("Category deletion error:", error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.format(),
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
