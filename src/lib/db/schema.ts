import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const allowedUsers = pgTable(
  "allowed_users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("allowed_users_email_unique").on(table.email)]
);

export const offers = pgTable(
  "offers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    offerNumber: text("offer_number").notNull(),
    offerDate: date("offer_date").notNull().defaultNow(),
    validUntil: date("valid_until"),
    clientName: text("client_name").notNull().default(""),
    clientAddress: text("client_address").notNull().default(""),
    clientPhone: text("client_phone").notNull().default(""),
    clientEmail: text("client_email").notNull().default(""),
    coContact: text("co_contact").notNull().default(""),
    coEmail: text("co_email").notNull().default(""),
    discountPct: numeric("discount_pct", { precision: 8, scale: 2 }).notNull().default("0"),
    showDiscount: boolean("show_discount").notNull().default(false),
    vatRate: numeric("vat_rate", { precision: 5, scale: 2 }).notNull().default("25"),
    paymentTerms: text("payment_terms").notNull().default(""),
    deliveryTerms: text("delivery_terms").notNull().default(""),
    termsPageTitle: text("terms_page_title").notNull().default("Napomena i jamstvo"),
    termsPageSubtitle: text("terms_page_subtitle").notNull().default("Uvjeti ponude"),
    notesHeading: text("notes_heading").notNull().default("Napomena"),
    offerNotes: jsonb("offer_notes").$type<string[]>().notNull().default([]),
    warrantyHeading: text("warranty_heading").notNull().default("Jamstvo"),
    warrantyParagraphs: jsonb("warranty_paragraphs").$type<string[]>().notNull().default([]),
    status: text("status").notNull().default("draft"),
    createdBy: text("created_by").notNull(),
    updatedBy: text("updated_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("offers_offer_number_unique").on(table.offerNumber),
    index("offers_status_idx").on(table.status),
    index("offers_updated_at_idx").on(table.updatedAt),
  ]
);

export const offerItems = pgTable(
  "offer_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    offerId: uuid("offer_id")
      .notNull()
      .references(() => offers.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    description: text("description").notNull().default(""),
    imageKey: text("image_key"),
    imageName: text("image_name"),
    imageContentType: text("image_content_type"),
    quantity: numeric("quantity", { precision: 12, scale: 3 }).notNull().default("0"),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull().default("0"),
    discountPct: numeric("discount_pct", { precision: 8, scale: 2 }).notNull().default("0"),
    dimensions: text("dimensions").notNull().default(""),
    isSurcharge: boolean("is_surcharge").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("offer_items_offer_position_idx").on(table.offerId, table.position)]
);

export const technicalSheets = pgTable(
  "technical_sheets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    storageKey: text("storage_key").notNull(),
    contentType: text("content_type").notNull().default("application/pdf"),
    version: integer("version").notNull().default(1),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("technical_sheets_slug_unique").on(table.slug)]
);

export const offerTechnicalSheets = pgTable(
  "offer_technical_sheets",
  {
    offerId: uuid("offer_id").notNull().references(() => offers.id, { onDelete: "cascade" }),
    technicalSheetId: uuid("technical_sheet_id").notNull().references(() => technicalSheets.id, { onDelete: "restrict" }),
    position: integer("position").notNull(),
  },
  (table) => [index("offer_technical_sheets_offer_position_idx").on(table.offerId, table.position)]
);
