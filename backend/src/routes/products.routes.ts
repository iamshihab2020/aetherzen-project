// src/routes/products.route.ts
import { Router } from "express";
import {
  createProduct,
  getProductById,
  listProducts,
  removeProduct,
  updateProduct,
} from "../controllers/products.controller";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware";
import { uploadPDF } from "../utils/upload";

const router = Router();

// Public routes
router.get("/", listProducts);
router.get("/:id", getProductById);

// Protected routes
router.post(
  "/",
  authMiddleware,
  authorizeRoles("HOSPITAL_ADMIN", "DOCTOR"),
  uploadPDF.array("certificationDocs", 5),
  createProduct
);

router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("HOSPITAL_ADMIN", "DOCTOR"),
  uploadPDF.array("certificationDocs", 5),
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("HOSPITAL_ADMIN"),
  removeProduct
);

export default router;
