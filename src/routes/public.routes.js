import { Router } from "express";
import {
  getAllStudents,
  getCertificateByCertificateId,
  getStudentCertificates,
  verifyCertificate
} from "../controllers/public.controller.js";

const router = Router();

router.get("/students", getAllStudents);
router.get("/certificates/:certificateId", getCertificateByCertificateId);
router.get("/students/:studentId/certificates", getStudentCertificates);
router.get("/verify/:certificateId", verifyCertificate);

export default router;
