import { randomBytes } from "node:crypto";

export function generateCertificateId(prefix = "CERT") {
  const token = randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}-${token}`;
}
