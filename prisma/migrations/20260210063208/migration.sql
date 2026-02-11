/*
  Warnings:

  - You are about to drop the column `createdAt` on the `certificates` table. All the data in the column will be lost.
  - You are about to drop the column `handover_url` on the `certificates` table. All the data in the column will be lost.
  - The `status` column on the `certificates` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `createdAt` on the `students` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('ACTIVE', 'REVOKED');

-- AlterTable
ALTER TABLE "certificates" DROP COLUMN "createdAt",
DROP COLUMN "handover_url",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" "CertificateStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "students" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
