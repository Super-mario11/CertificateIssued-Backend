import prisma from "../utils/prisma.js";

function normalizeStudentInput(input = {}) {
  const fullName = (input.fullName || "").trim();
  const email = input.email ? input.email.trim().toLowerCase() : null;
  const profileImage = input.profileImage || null;
  const allowMultipleCertificates =
    typeof input.allowMultipleCertificates === "boolean"
      ? input.allowMultipleCertificates
      : undefined;
  return {
    fullName,
    email,
    profileImage,
    allowMultipleCertificates
  };
}

export async function findOrCreateStudent(input) {
  const data = normalizeStudentInput(input);
  if (!data.fullName) {
    throw Object.assign(new Error("Student full name is required"), {
      status: 400
    });
  }

  if (data.email) {
    const existing = await prisma.student.findUnique({
      where: { email: data.email }
    });
    if (existing) return existing;
  }

  const byName = await prisma.student.findFirst({
    where: { fullName: data.fullName }
  });
  if (byName) return byName;

  return prisma.student.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      profileImage: data.profileImage,
      ...(typeof data.allowMultipleCertificates === "boolean"
        ? { allowMultipleCertificates: data.allowMultipleCertificates }
        : {})
    }
  });
}
