CREATE TABLE IF NOT EXISTS "admin_auth" (
    "id" INTEGER NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "resetTokenHash" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_auth_pkey" PRIMARY KEY ("id")
);
