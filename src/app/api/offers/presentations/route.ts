import { desc, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { offers } from "@/lib/db/schema";
import { getAllowedOfferUser } from "@/lib/offer-access";
import type { ArchivedPresentations } from "@/lib/technical-presentations";

export async function GET() {
  if (!await getAllowedOfferUser()) return new Response(null, { status: 401 });

  const rows = await getDb().select({
    id: offers.id,
    offerNumber: offers.offerNumber,
    clientName: offers.clientName,
    presentations: offers.technicalPresentations,
  }).from(offers)
    .where(sql`jsonb_array_length(${offers.technicalPresentations}) > 0`)
    .orderBy(desc(offers.updatedAt), desc(offers.id));

  const archive: ArchivedPresentations[] = rows.map((row) => ({
    ...row,
    presentations: row.presentations ?? [],
  }));
  return Response.json(archive, { headers: { "Cache-Control": "private, no-store" } });
}
