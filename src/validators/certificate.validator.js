import { body } from "express-validator";

const statusValues = ["active", "revoked", "ACTIVE", "REVOKED"];

function getStudentName(req) {
  return req.body?.student?.fullName || req.body?.studentName;
}

function getCertificateField(req, field) {
  return req.body?.certificate?.[field] ?? req.body?.[field];
}

export const createCertificateRules = [
  body("student.fullName").optional().isString().notEmpty(),
  body("student.email").optional().isEmail(),
  body("student.profileImage").optional().isString().notEmpty(),
  body("student.allowMultipleCertificates").optional().isBoolean(),
  body("studentName").optional().isString().notEmpty(),
  body("studentEmail").optional().isEmail(),
  body("profileImage").optional().isString().notEmpty(),
  body("allowMultipleCertificates").optional().isBoolean(),
  body("certificate.courseName").optional().isString().notEmpty(),
  body("certificate.skillsLearned").optional().isString().notEmpty(),
  body("certificate.comments").optional().isString(),
  body("certificate.issueDate").optional().isISO8601(),
  body("certificate.certificateUrl").optional().isString().notEmpty(),
  body("certificate.handoverUrl").optional().isString().notEmpty(),
  body("certificate.status").optional().isIn(statusValues),
  body("courseName").optional().isString().notEmpty(),
  body("skillsLearned").optional().isString().notEmpty(),
  body("comments").optional().isString(),
  body("issueDate").optional().isISO8601(),
  body("certificateUrl").optional().isString().notEmpty(),
  body("handoverUrl").optional().isString().notEmpty(),
  body("status").optional().isIn(statusValues),
  body().custom((value, { req }) => {
    const studentName = getStudentName(req);
    const courseName = getCertificateField(req, "courseName");
    const skillsLearned = getCertificateField(req, "skillsLearned");
    const certificateUrl = getCertificateField(req, "certificateUrl");
    if (!studentName) throw new Error("student.fullName is required");
    if (!courseName) throw new Error("courseName is required");
    if (!skillsLearned) throw new Error("skillsLearned is required");
    if (!certificateUrl) throw new Error("certificateUrl is required");
    return true;
  })
];

export const updateCertificateRules = [
  body("student.fullName").optional().isString().notEmpty(),
  body("student.email").optional().isEmail(),
  body("student.profileImage").optional().isString().notEmpty(),
  body("student.allowMultipleCertificates").optional().isBoolean(),
  body("studentName").optional().isString().notEmpty(),
  body("studentEmail").optional().isEmail(),
  body("profileImage").optional().isString().notEmpty(),
  body("allowMultipleCertificates").optional().isBoolean(),
  body("certificate.courseName").optional().isString().notEmpty(),
  body("certificate.skillsLearned").optional().isString().notEmpty(),
  body("certificate.comments").optional().isString(),
  body("certificate.issueDate").optional().isISO8601(),
  body("certificate.certificateUrl").optional().isString().notEmpty(),
  body("certificate.handoverUrl").optional().isString().notEmpty(),
  body("certificate.status").optional().isIn(statusValues),
  body("courseName").optional().isString().notEmpty(),
  body("skillsLearned").optional().isString().notEmpty(),
  body("comments").optional().isString(),
  body("issueDate").optional().isISO8601(),
  body("certificateUrl").optional().isString().notEmpty(),
  body("handoverUrl").optional().isString().notEmpty(),
  body("status").optional().isIn(statusValues),
  body().custom((value, { req }) => {
    const hasStudent =
      req.body?.student?.fullName || req.body?.studentName || req.body?.studentEmail;
    const hasCertificate =
      getCertificateField(req, "courseName") ||
      getCertificateField(req, "skillsLearned") ||
      getCertificateField(req, "comments") ||
      getCertificateField(req, "issueDate") ||
      getCertificateField(req, "certificateUrl") ||
      getCertificateField(req, "handoverUrl") ||
      getCertificateField(req, "status");
    if (!hasStudent && !hasCertificate) {
      throw new Error("No valid fields provided for update");
    }
    if (req.body?.student && !req.body.student.fullName) {
      throw new Error("student.fullName is required when student is provided");
    }
    return true;
  })
];
