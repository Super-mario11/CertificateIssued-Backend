import prisma from "../utils/prisma.js";
import {
  serializeCertificate,
  serializeStudentWithCertificates
} from "../services/transform.service.js";

export async function getAllStudents(req, res, next) {
  try {
    const students = await prisma.student.findMany({
      orderBy: { createdAt: "desc" },
      include: { certificates: { orderBy: { createdAt: "desc" } } }
    });
    return res.json(students.map(serializeStudentWithCertificates));
  } catch (err) {
    return next(err);
  }
}

export async function getCertificateByCertificateId(req, res, next) {
  try {
    const certificateId = req.params.certificateId;
    const item = await prisma.certificate.findUnique({
      where: { certificateId },
      include: { student: true }
    });
    if (!item) return res.status(404).json({ message: "Not found" });
    return res.json(serializeCertificate(item));
  } catch (err) {
    return next(err);
  }
}

export async function getStudentCertificates(req, res, next) {
  try {
    const id = Number(req.params.studentId);
    const student = await prisma.student.findUnique({
      where: { id },
      include: { certificates: { orderBy: { createdAt: "desc" } } }
    });
    if (!student) return res.status(404).json({ message: "Not found" });
    return res.json(serializeStudentWithCertificates(student));
  } catch (err) {
    return next(err);
  }
}

export async function verifyCertificate(req, res, next) {
  try {
    const certificateId = req.params.certificateId;
    const item = await prisma.certificate.findUnique({
      where: { certificateId },
      include: { student: true }
    });
    if (!item) {
      return res.status(404).json({
        certificateId,
        valid: false,
        status: "not_found"
      });
    }
    const serialized = serializeCertificate(item);
    const isActive = serialized.status === "active";
    return res.json({
      certificateId: serialized.certificateId,
      valid: isActive,
      status: serialized.status,
      student: serialized.student,
      courseName: serialized.courseName,
      issueDate: serialized.issueDate
    });
  } catch (err) {
    return next(err);
  }
}
