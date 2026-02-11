import { body } from "express-validator";

const statusValues = ["active", "revoked", "ACTIVE", "REVOKED"];

export const updateStudentRules = [
  body("fullName").optional().isString().notEmpty(),
  body("email").optional().isEmail(),
  body("profileImage").optional().isString().notEmpty(),
  body("allowMultipleCertificates").optional().isBoolean(),
  body().custom((value, { req }) => {
    const hasAny =
      req.body?.fullName ||
      req.body?.email ||
      req.body?.profileImage ||
      typeof req.body?.allowMultipleCertificates === "boolean";
    if (!hasAny) throw new Error("No valid fields provided for update");
    return true;
  })
];

export const addStudentCertificateRules = [
  body("courseName").isString().notEmpty(),
  body("skillsLearned").isString().notEmpty(),
  body("comments").optional().isString(),
  body("issueDate").optional().isISO8601(),
  body("certificateUrl").isString().notEmpty(),
  body("handoverUrl").optional().isString().notEmpty(),
  body("status").optional().isIn(statusValues)
];
