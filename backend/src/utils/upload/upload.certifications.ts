// src/utils/upload.ts
import multer from "multer";
import path from "path";
import { Request } from "express";

// Ensure directory exists
const uploadDir = path.join(__dirname, "../../public/uploads/certifications");
import fs from "fs";
fs.mkdirSync(uploadDir, { recursive: true });

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req: Request, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const sanitizedFilename = file.originalname
      .replace(ext, "")
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    cb(null, `cert-${sanitizedFilename}-${uniqueSuffix}${ext}`);
  },
});

// Create upload middleware
export const uploadPDF = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5, // Max 5 files
  },
});
