-- Align students table with current Prisma schema.
-- Safe guards are used to avoid failures if parts already exist.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'students'
      AND column_name = 'name'
  ) THEN
    EXECUTE 'ALTER TABLE "students" RENAME COLUMN "name" TO "full_name"';
  END IF;
END $$;

ALTER TABLE "students"
  ADD COLUMN IF NOT EXISTS "email" TEXT,
  ADD COLUMN IF NOT EXISTS "profile_image" TEXT;

DROP INDEX IF EXISTS "students_name_key";
CREATE UNIQUE INDEX IF NOT EXISTS "students_email_key" ON "students"("email");
