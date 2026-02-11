import prisma from "../utils/prisma.js";
import { generateUniqueCertificateId } from "../services/certificate.service.js";
import { findOrCreateStudent } from "../services/student.service.js";
import { normalizeStatus, serializeCertificate } from "../services/transform.service.js";

export async function listCertificates(_req, res, next) {
  try {
    const items = await prisma.certificate.findMany({
      orderBy: { createdAt: "desc" },
      include: { student: true }
    });
    return res.json(items.map(serializeCertificate));
  } catch (err) {
    return next(err);
  }
}

export async function getCertificate(req, res, next) {
  try {
    const id = Number(req.params.id);
    const item = await prisma.certificate.findUnique({
      where: { id },
      include: { student: true }
    });
    if (!item) return res.status(404).json({ message: "Not found" });
    return res.json(serializeCertificate(item));
  } catch (err) {
    return next(err);
  }
}

export async function createCertificate(req, res, next) {
  try {
    const studentInput = req.body.student || {
      fullName: req.body.studentName,
      email: req.body.studentEmail,
      profileImage: req.body.profileImage,
      allowMultipleCertificates: req.body.allowMultipleCertificates
    };
    const certificateInput = req.body.certificate || req.body;
    const student = await findOrCreateStudent(studentInput);
    if (!student.allowMultipleCertificates) {
      const existingCount = await prisma.certificate.count({
        where: { studentId: student.id }
      });
      if (existingCount > 0) {
        return res.status(400).json({
          message: "This student can only have one certificate."
        });
      }
    }
    const certificateId = await generateUniqueCertificateId();
    const item = await prisma.certificate.create({
      data: {
        certificateId,
        studentId: student.id,
        courseName: certificateInput.courseName,
        skillsLearned: certificateInput.skillsLearned,
        comments: certificateInput.comments || null,
        issueDate: certificateInput.issueDate
          ? new Date(certificateInput.issueDate)
          : new Date(),
        status: normalizeStatus(certificateInput.status),
        certificateUrl: certificateInput.certificateUrl,
        handoverUrl: certificateInput.handoverUrl || null
      },
      include: { student: true }
    });
    return res.status(201).json(serializeCertificate(item));
  } catch (err) {
    return next(err);
  }
}

export async function updateCertificate(req, res, next) {
  try {
    const id = Number(req.params.id);
    const studentInput = req.body.student || {
      fullName: req.body.studentName,
      email: req.body.studentEmail,
      profileImage: req.body.profileImage,
      allowMultipleCertificates: req.body.allowMultipleCertificates
    };
    const certificateInput = req.body.certificate || req.body;
    const student = studentInput?.fullName
      ? await findOrCreateStudent(studentInput)
      : null;

    const item = await prisma.certificate.update({
      where: { id },
      data: {
        studentId: student ? student.id : undefined,
        courseName: certificateInput.courseName,
        skillsLearned: certificateInput.skillsLearned,
        comments: certificateInput.comments,
        issueDate: certificateInput.issueDate
          ? new Date(certificateInput.issueDate)
          : undefined,
        status: certificateInput.status
          ? normalizeStatus(certificateInput.status)
          : undefined,
        certificateUrl: certificateInput.certificateUrl,
        handoverUrl: certificateInput.handoverUrl
      },
      include: { student: true }
    });
    return res.json(serializeCertificate(item));
  } catch (err) {
    return next(err);
  }
}

export async function deleteCertificate(req, res, next) {
  try {
    const id = Number(req.params.id);
    await prisma.certificate.delete({ where: { id } });
    return res.json({ message: "Deleted" });
  } catch (err) {
    return next(err);
  }
}
