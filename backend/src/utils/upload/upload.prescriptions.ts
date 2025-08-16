import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const dest = path.join(__dirname, "..", "..", "private", "prescriptions"); // NOT publicly served
if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, dest),
  filename: (_req, file, cb) => {
    // safe filename
    const base = path
      .parse(file.originalname)
      .name.replace(/[^a-z0-9_-]+/gi, "-")
      .toLowerCase();
    cb(null, `${Date.now()}-${base}.pdf`);
  },
});

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  if (file.mimetype !== "application/pdf")
    return cb(new Error("Only PDF files are allowed."));
  cb(null, true);
}

export const uploadPrescriptionPDF = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
