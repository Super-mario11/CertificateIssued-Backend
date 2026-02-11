import prisma from "../utils/prisma.js";
import { generateCertificateId } from "../utils/generateId.js";

export async function generateUniqueCertificateId(prefix = "CERT") {
  for (let i = 0; i < 7; i += 1) {
    const candidate = generateCertificateId(prefix);
    const exists = await prisma.certificate.findUnique({
      where: { certificateId: candidate }
    });
    if (!exists) return candidate;
  }
  throw new Error("Failed to generate unique certificate id");
}
