ALTER TABLE "offers"
  ADD COLUMN IF NOT EXISTS "certificate_notes" text DEFAULT '' NOT NULL,
  ADD COLUMN IF NOT EXISTS "installation_notes" text DEFAULT '' NOT NULL;
