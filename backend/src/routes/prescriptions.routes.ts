import { Router } from "express";
import { PrescriptionsController } from "../controllers/prescriptions.controller";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware";
import { uploadPrescriptionPDF } from "../utils/upload/upload.prescriptions";

const router = Router();

// Patient upload
router.post(
  "/",
  authMiddleware,
  authorizeRoles("PATIENT", "DOCTOR", "HOSPITAL_ADMIN"), // allow all users to upload for themselves if needed
  uploadPrescriptionPDF.single("file"), // field name "file"
  PrescriptionsController.create
);

// Patient: mine
router.get("/mine", authMiddleware, PrescriptionsController.mine);

// Doctor/Admin: list all/pending
router.get(
  "/",
  authMiddleware,
  authorizeRoles("DOCTOR", "HOSPITAL_ADMIN"),
  PrescriptionsController.list
);

// Approve/Reject
router.patch(
  "/:id/approve",
  authMiddleware,
  authorizeRoles("DOCTOR", "HOSPITAL_ADMIN"),
  PrescriptionsController.approve
);

router.patch(
  "/:id/reject",
  authMiddleware,
  authorizeRoles("DOCTOR", "HOSPITAL_ADMIN"),
  PrescriptionsController.reject
);

// Secure file stream
router.get("/:id/file", authMiddleware, PrescriptionsController.streamFile);

export default router;
