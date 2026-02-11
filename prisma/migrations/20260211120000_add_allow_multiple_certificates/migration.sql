-- Add missing column used by current Student model.
ALTER TABLE "students"
ADD COLUMN IF NOT EXISTS "allow_multiple_certificates" BOOLEAN NOT NULL DEFAULT true;
