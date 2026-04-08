-- Ensure admin_auth matches the Prisma AdminAuth model column names.
-- This migration is intentionally defensive to support older DB states.

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

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'admin_auth'
      AND column_name = 'password_hash'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'admin_auth'
      AND column_name = 'passwordHash'
  ) THEN
    EXECUTE 'ALTER TABLE "admin_auth" RENAME COLUMN "password_hash" TO "passwordHash"';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'admin_auth'
      AND column_name = 'reset_token_hash'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'admin_auth'
      AND column_name = 'resetTokenHash'
  ) THEN
    EXECUTE 'ALTER TABLE "admin_auth" RENAME COLUMN "reset_token_hash" TO "resetTokenHash"';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'admin_auth'
      AND column_name = 'reset_token_expiry'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'admin_auth'
      AND column_name = 'resetTokenExpiry'
  ) THEN
    EXECUTE 'ALTER TABLE "admin_auth" RENAME COLUMN "reset_token_expiry" TO "resetTokenExpiry"';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'admin_auth'
      AND column_name = 'token_version'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'admin_auth'
      AND column_name = 'tokenVersion'
  ) THEN
    EXECUTE 'ALTER TABLE "admin_auth" RENAME COLUMN "token_version" TO "tokenVersion"';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'admin_auth'
      AND column_name = 'created_at'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'admin_auth'
      AND column_name = 'createdAt'
  ) THEN
    EXECUTE 'ALTER TABLE "admin_auth" RENAME COLUMN "created_at" TO "createdAt"';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'admin_auth'
      AND column_name = 'updated_at'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'admin_auth'
      AND column_name = 'updatedAt'
  ) THEN
    EXECUTE 'ALTER TABLE "admin_auth" RENAME COLUMN "updated_at" TO "updatedAt"';
  END IF;
END $$;

ALTER TABLE "admin_auth"
  ADD COLUMN IF NOT EXISTS "passwordHash" TEXT,
  ADD COLUMN IF NOT EXISTS "resetTokenHash" TEXT,
  ADD COLUMN IF NOT EXISTS "resetTokenExpiry" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "tokenVersion" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;