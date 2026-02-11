import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  listCertificates,
  getCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate
} from "../controllers/certificate.controller.js";
import {
  createCertificateRules,
  updateCertificateRules
} from "../validators/certificate.validator.js";

const router = Router();

router.use(requireAuth);

router.get("/", listCertificates);
router.get("/:id", getCertificate);

router.post("/", createCertificateRules, validate, createCertificate);

router.put("/:id", updateCertificateRules, validate, updateCertificate);

router.delete("/:id", deleteCertificate);

export default router;
