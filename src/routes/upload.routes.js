import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.middleware.js";
import { uploadCertificate } from "../controllers/upload.controller.js";

const router = Router();

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf"
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new Error("Invalid file type. Only JPG, PNG, WEBP, and PDF are allowed."));
      return;
    }
    cb(null, true);
  }
});

router.post("/", requireAuth, upload.single("file"), uploadCertificate);

export default router;
