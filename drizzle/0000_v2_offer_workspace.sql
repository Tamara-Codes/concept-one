CREATE TABLE IF NOT EXISTS "allowed_users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL,
  "active" boolean DEFAULT true NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "allowed_users_email_unique" ON "allowed_users" ("email");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "offers" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "offer_number" text NOT NULL,
  "offer_date" date DEFAULT CURRENT_DATE NOT NULL,
  "valid_until" date,
  "client_name" text DEFAULT '' NOT NULL,
  "client_address" text DEFAULT '' NOT NULL,
  "client_phone" text DEFAULT '' NOT NULL,
  "client_email" text DEFAULT '' NOT NULL,
  "co_contact" text DEFAULT '' NOT NULL,
  "co_email" text DEFAULT '' NOT NULL,
  "discount_pct" numeric(8, 2) DEFAULT '0' NOT NULL,
  "show_discount" boolean DEFAULT false NOT NULL,
  "vat_rate" numeric(5, 2) DEFAULT '25' NOT NULL,
  "payment_terms" text DEFAULT '' NOT NULL,
  "delivery_terms" text DEFAULT '' NOT NULL,
  "terms_page_title" text DEFAULT 'Napomena i jamstvo' NOT NULL,
  "terms_page_subtitle" text DEFAULT 'Uvjeti ponude' NOT NULL,
  "notes_heading" text DEFAULT 'Napomena' NOT NULL,
  "offer_notes" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "warranty_heading" text DEFAULT 'Jamstvo' NOT NULL,
  "warranty_paragraphs" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "status" text DEFAULT 'draft' NOT NULL,
  "created_by" text NOT NULL,
  "updated_by" text NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "offers_offer_number_unique" ON "offers" ("offer_number");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "offers_status_idx" ON "offers" ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "offers_updated_at_idx" ON "offers" ("updated_at");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "offer_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "offer_id" uuid NOT NULL,
  "position" integer NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "image_key" text,
  "image_name" text,
  "image_content_type" text,
  "quantity" numeric(12, 3) DEFAULT '0' NOT NULL,
  "unit_price" numeric(12, 2) DEFAULT '0' NOT NULL,
  "discount_pct" numeric(8, 2) DEFAULT '0' NOT NULL,
  "dimensions" text DEFAULT '' NOT NULL,
  "is_surcharge" boolean DEFAULT false NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "offer_items_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "offer_items_offer_position_idx" ON "offer_items" ("offer_id", "position");
--> statement-breakpoint
INSERT INTO "allowed_users" ("email") VALUES
  ('ivica@conceptone.hr'),
  ('sasa@conceptone.hr'),
  ('codewithtamara@gmail.com')
ON CONFLICT ("email") DO NOTHING;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "technical_sheets" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "storage_key" text NOT NULL,
  "content_type" text DEFAULT 'application/pdf' NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "active" boolean DEFAULT true NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "technical_sheets_slug_unique" ON "technical_sheets" ("slug");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "offer_technical_sheets" (
  "offer_id" uuid NOT NULL,
  "technical_sheet_id" uuid NOT NULL,
  "position" integer NOT NULL,
  PRIMARY KEY ("offer_id", "technical_sheet_id"),
  CONSTRAINT "offer_technical_sheets_offer_fk" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE CASCADE,
  CONSTRAINT "offer_technical_sheets_sheet_fk" FOREIGN KEY ("technical_sheet_id") REFERENCES "technical_sheets"("id") ON DELETE RESTRICT
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "offer_technical_sheets_offer_position_idx" ON "offer_technical_sheets" ("offer_id", "position");
--> statement-breakpoint
INSERT INTO "technical_sheets" ("slug", "name", "description", "storage_key") VALUES
  ('bravarija', 'Bravarija', 'Testna tehnička prezentacija za aluminijsku i PVC bravariju.', 'technical-sheets/bravarija-v1.pdf'),
  ('vrata', 'Vrata', 'Testna tehnička prezentacija za vrata.', 'technical-sheets/vrata-v1.pdf'),
  ('podovi', 'Podovi', 'Testna tehnička prezentacija za podove.', 'technical-sheets/podovi-v1.pdf'),
  ('zidne-obloge', 'Zidne obloge', 'Testna tehnička prezentacija za zidne obloge.', 'technical-sheets/zidne-obloge-v1.pdf')
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description", "storage_key" = EXCLUDED."storage_key", "updated_at" = now();
