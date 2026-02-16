import bcrypt from "bcryptjs";
import prisma from "../utils/prisma.js";

const ADMIN_AUTH_ID = 1;

export async function getOrCreateAdminAuth() {
  const existing = await prisma.adminAuth.findUnique({
    where: { id: ADMIN_AUTH_ID }
  });

  if (existing) return existing;

  const initialPassword = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(initialPassword, 10);

  return prisma.adminAuth.create({
    data: {
      id: ADMIN_AUTH_ID,
      passwordHash
    }
  });
}

