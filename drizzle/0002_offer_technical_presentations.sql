ALTER TABLE "offers"
  ADD COLUMN IF NOT EXISTS "technical_presentations" jsonb;

CREATE INDEX IF NOT EXISTS "offers_technical_presentations_idx"
  ON "offers" USING gin ("technical_presentations" jsonb_path_ops);

UPDATE "offers" AS offer
SET "technical_presentations" = legacy.pages
FROM (
  SELECT link.offer_id,
    jsonb_agg(jsonb_build_object(
      'title', sheet.name,
      'description', sheet.description,
      'imageKey', NULL::text
    ) ORDER BY link.position) AS pages
  FROM "offer_technical_sheets" AS link
  JOIN "technical_sheets" AS sheet ON sheet.id = link.technical_sheet_id
  GROUP BY link.offer_id
) AS legacy
WHERE offer.id = legacy.offer_id AND offer."technical_presentations" IS NULL;
