import prisma from "../utils/prisma.js";
import { generateUniqueCertificateId } from "../services/certificate.service.js";
import { normalizeStatus, serializeCertificate, serializeStudentWithCertificates } from "../services/transform.service.js";

export async function getStudent(req, res, next) {
  try {
    const id = Number(req.params.id);
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

export async function updateStudent(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { fullName, email, profileImage, allowMultipleCertificates } = req.body;
    const student = await prisma.student.update({
      where: { id },
      data: {
        fullName,
        email,
        profileImage,
        ...(typeof allowMultipleCertificates === "boolean"
          ? { allowMultipleCertificates }
          : {})
      }
    });
    return res.json(student);
  } catch (err) {
    return next(err);
  }
}

export async function addStudentCertificate(req, res, next) {
  try {
    const id = Number(req.params.id);
    const {
      courseName,
      skillsLearned,
      comments,
      issueDate,
      status,
      certificateUrl,
      handoverUrl
    } = req.body;

    const student = await prisma.student.findUnique({
      where: { id },
      include: { certificates: true }
    });
    if (!student) return res.status(404).json({ message: "Not found" });
    if (!student.allowMultipleCertificates && student.certificates.length > 0) {
      return res.status(400).json({
        message: "This student can only have one certificate."
      });
    }
    const certificateId = await generateUniqueCertificateId();
    const item = await prisma.certificate.create({
      data: {
        certificateId,
        studentId: id,
        courseName,
        skillsLearned,
        comments: comments || null,
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        status: normalizeStatus(status),
        certificateUrl,
        handoverUrl: handoverUrl || null
      },
      include: { student: true }
    });
    return res.status(201).json(serializeCertificate(item));
  } catch (err) {
    return next(err);
  }
}
