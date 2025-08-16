// src/routes/category.route.ts
import { Router } from "express";
import {
  createCategory,
  listCategories,
  updateCategory,
  removeCategory,
} from "../controllers/category.controller";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", listCategories);

// Protected routes
router.post(
  "/",
  authMiddleware,
  authorizeRoles("HOSPITAL_ADMIN"),
  createCategory
);

router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("HOSPITAL_ADMIN"),
  updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("HOSPITAL_ADMIN"),
  removeCategory
);

export default router;
