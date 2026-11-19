import "server-only";

import { eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { offerItems, offers } from "@/lib/db/schema";

export async function isOfferImageReferenced(key: string) {
  const db = getDb();
  const [item] = await db.select({ id: offerItems.id }).from(offerItems)
    .where(eq(offerItems.imageKey, key)).limit(1);
  if (item) return true;

  const [offer] = await db.select({ id: offers.id }).from(offers)
    .where(sql`${offers.technicalPresentations} @> ${JSON.stringify([{ imageKey: key }])}::jsonb`)
    .limit(1);
  return Boolean(offer);
}
