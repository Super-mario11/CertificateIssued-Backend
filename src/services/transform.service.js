export function normalizeStatus(status) {
  if (!status) return "ACTIVE";
  const normalized = String(status).toLowerCase();
  return normalized === "revoked" ? "REVOKED" : "ACTIVE";
}

function statusToApi(status) {
  return status === "REVOKED" ? "revoked" : "active";
}

export function serializeCertificate(certificate) {
  return {
    id: certificate.id,
    certificateId: certificate.certificateId,
    studentId: certificate.studentId,
    courseName: certificate.courseName,
    skillsLearned: certificate.skillsLearned,
    comments: certificate.comments,
    issueDate: certificate.issueDate,
    certificateUrl: certificate.certificateUrl,
    handoverUrl: certificate.handoverUrl,
    status: statusToApi(certificate.status),
    createdAt: certificate.createdAt,
    student: certificate.student
      ? {
          id: certificate.student.id,
          fullName: certificate.student.fullName,
          name: certificate.student.fullName,
          email: certificate.student.email,
          profileImage: certificate.student.profileImage
        }
      : undefined
  };
}

export function serializeStudentWithCertificates(student) {
  return {
    id: student.id,
    fullName: student.fullName,
    name: student.fullName,
    email: student.email,
    profileImage: student.profileImage,
    allowMultipleCertificates: student.allowMultipleCertificates,
    createdAt: student.createdAt,
    certificates: student.certificates
      ? student.certificates.map((item) =>
          serializeCertificate({ ...item, student })
        )
      : []
  };
}
