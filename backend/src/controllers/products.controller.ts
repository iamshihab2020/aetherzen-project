import { Request, Response } from "express";
import prisma from "../prismaClient";
import { logAction } from "../services/audit.service";
import {
  CreateProductSchema,
  UpdateProductSchema,
  ListQuerySchema,
} from "../validation/product.validation";
import fs from "fs/promises";
import path from "path";
import { ZodError } from "zod";

export const createProduct = async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) || [];
  let cleanupFiles: string[] = files.map((file) => file.path);

  try {
    const validation = CreateProductSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.error.format(),
      });
    }

    const data = validation.data;

    // Validate category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    const productData: any = {
      title: data.name,
      description: data.description,
      priceCents: Math.round(data.price * 100),
      categoryId: data.categoryId,
      inventory: data.stock,
      isPrescriptionRequired: data.isRestricted,
      isEmergencyItem: data.isEmergencyItem,
    };

    const product = await prisma.product.create({
      data: {
        ...productData,
        ProductVariant: {
          create: data.variants.map((variant) => ({
            size: variant.size,
            model: variant.model,
            certifications: variant.certifications,
            additionalPrice: variant.additionalPrice
              ? Math.round(variant.additionalPrice * 100)
              : 0,
          })),
        },
        certifications: {
          create: files.map((file) => ({
            filename: file.originalname,
            url: `/uploads/certifications/${file.filename}`,
            issuedBy: "",
          })),
        },
      },
      include: {
        ProductVariant: true,
        certifications: true,
      },
    });

    cleanupFiles = [];
    await logAction("PRODUCT_CREATED", req.user?.id, {
      productId: product.id,
    });

    res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error: any) {
    // Clean up uploaded files on error
    for (const filePath of cleanupFiles) {
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Failed to delete file:", filePath);
      }
    }

    // Handle specific Prisma errors
    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Invalid reference data (category or variant)",
        details: error.meta,
      });
    }

    console.error("Product creation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const listProducts = async (req: Request, res: Response) => {
  try {
    // Validate query parameters
    const validation = ListQuerySchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.error.format(),
      });
    }

    const {
      page = 1,
      limit = 10,
      categoryId,
      certification,
      search,
    } = validation.data;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (search) where.title = { contains: search, mode: "insensitive" };

    if (certification) {
      where.OR = [
        {
          ProductVariant: {
            some: {
              certifications: {
                has: certification,
              },
            },
          },
        },
        {
          certifications: {
            some: {
              filename: {
                contains: certification,
                mode: "insensitive",
              },
            },
          },
        },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          ProductVariant: true,
          certifications: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      message: "Products retrieved successfully",
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Product listing error:", error);

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

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        ProductVariant: true,
        certifications: true,
        // @ts-expect-error
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error: any) {
    console.error("Product fetch error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const productId = req.params.id;
  const files = (req.files as Express.Multer.File[]) || [];
  let cleanupFiles: string[] = files.map((file) => file.path);
  let oldCertifications: { id: string; url: string }[] = [];

  try {
    const validation = UpdateProductSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.error.format(),
      });
    }

    const data = validation.data;
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        ProductVariant: true,
        certifications: true,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Validate category if provided
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        return res.status(400).json({
          message: "Invalid category ID",
        });
      }
    }

    oldCertifications = existingProduct.certifications.map((cert) => ({
      id: cert.id,
      url: cert.url,
    }));

    // Prepare update data
    const updateData: any = {
      title: data.name ?? existingProduct.title,
      description: data.description ?? existingProduct.description,
      priceCents: data.price
        ? Math.round(data.price * 100)
        : existingProduct.priceCents,
      categoryId: data.categoryId ?? existingProduct.categoryId,
      inventory: data.stock ?? existingProduct.inventory,
      isPrescriptionRequired:
        data.isRestricted ?? existingProduct.isPrescriptionRequired,
      isEmergencyItem: data.isEmergencyItem ?? existingProduct.isEmergencyItem,
    };

    const updatedProduct = await prisma.$transaction(async (prisma) => {
      await prisma.product.update({
        where: { id: productId },
        data: updateData,
      });

      if (data.variants) {
        await prisma.productVariant.deleteMany({
          where: { productId },
        });

        await prisma.productVariant.createMany({
          data: data.variants.map((variant) => ({
            ...variant,
            productId,
            additionalPrice: variant.additionalPrice
              ? Math.round(variant.additionalPrice * 100)
              : 0,
          })),
        });
      }

      if (files.length > 0) {
        await prisma.certification.deleteMany({
          where: { productId },
        });

        await prisma.certification.createMany({
          data: files.map((file) => ({
            filename: file.originalname,
            url: `/uploads/certifications/${file.filename}`,
            productId,
            issuedBy: "",
          })),
        });
      }

      return prisma.product.findUnique({
        where: { id: productId },
        include: {
          ProductVariant: true,
          certifications: true,
        },
      });
    });

    cleanupFiles = [];
    // Delete old certification files
    for (const cert of oldCertifications) {
      try {
        const filename = path.basename(cert.url);
        const filePath = path.join(
          __dirname,
          "../../public/uploads/certifications",
          filename
        );
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Failed to delete old certification:", cert.url);
      }
    }

    await logAction("PRODUCT_UPDATED", req.user?.id, {
      productId: updatedProduct?.id,
    });

    res.json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error: any) {
    // Clean up uploaded files on error
    for (const filePath of cleanupFiles) {
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Failed to delete file:", filePath);
      }
    }

    // Handle specific Prisma errors
    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Invalid reference data",
        details: error.meta,
      });
    }

    console.error("Product update error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const removeProduct = async (req: Request, res: Response) => {
  const productId = req.params.id;
  let certifications: { url: string }[] = [];

  try {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        certifications: true,
        ProductVariant: true,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Save certifications for cleanup
    certifications = existingProduct.certifications;

    await prisma.$transaction([
      prisma.certification.deleteMany({
        where: { productId },
      }),
      prisma.productVariant.deleteMany({
        where: { productId },
      }),
      // Remove product from orders
      prisma.orderItem.deleteMany({
        where: { productId },
      }),
      // Finally delete the product
      prisma.product.delete({
        where: { id: productId },
      }),
    ]);

    // Delete certification files
    for (const cert of certifications) {
      try {
        const filename = path.basename(cert.url);
        const filePath = path.join(
          __dirname,
          "../../public/uploads/certifications",
          filename
        );
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Failed to delete certification:", cert.url);
      }
    }

    // Audit log
    await logAction("PRODUCT_DELETED", req.user?.id, {
      productId: existingProduct.id,
    });

    res.status(204).send();
  } catch (error: any) {
    console.error("Product deletion error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
