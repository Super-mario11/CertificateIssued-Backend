import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  addStudentCertificate,
  getStudent,
  updateStudent
} from "../controllers/student.controller.js";
import {
  addStudentCertificateRules,
  updateStudentRules
} from "../validators/student.validator.js";

const router = Router();

router.use(requireAuth);

router.get("/:id", getStudent);

router.put("/:id", updateStudentRules, validate, updateStudent);

router.post(
  "/:id/certificates",
  addStudentCertificateRules,
  validate,
  addStudentCertificate
);

export default router;
