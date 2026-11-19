import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { offerItems, offers } from "@/lib/db/schema";
import { getAllowedOfferUser } from "@/lib/offer-access";
import { isOfferImageReferenced } from "@/lib/offer-image-references";
import { getR2BucketName, getR2Client } from "@/lib/storage/r2";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!await getAllowedOfferUser()) {
    return Response.json({ error: "Nemate pristup ponudama." }, { status: 401 });
  }

  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return Response.json({ error: "Neispravan ID ponude." }, { status: 400 });
  }

  try {
    const db = getDb();
    const items = await db
      .select({ imageKey: offerItems.imageKey })
      .from(offerItems)
      .where(eq(offerItems.offerId, id));
    const [deleted] = await db.delete(offers).where(eq(offers.id, id)).returning({
      technicalPresentations: offers.technicalPresentations,
    });
    if (!deleted) return Response.json({ error: "Ponuda nije pronađena." }, { status: 404 });

    // The database cascade removes items and sheet links. Remove image objects
    // only when no other offer still references them.
    const imageKeys = new Set([...items, ...(deleted.technicalPresentations ?? [])].map(({ imageKey }) => imageKey));
    for (const key of imageKeys) {
      if (!key) continue;
      try {
        if (await isOfferImageReferenced(key)) continue;
        await getR2Client().send(new DeleteObjectCommand({ Bucket: getR2BucketName(), Key: key }));
      } catch (error) {
        // The offer is gone even if R2 is temporarily unavailable. Its image
        // cannot be served without an offer item that references it.
        console.error("Failed to remove deleted offer image", error);
      }
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete offer", error);
    return Response.json({ error: "Ponuda se nije mogla obrisati." }, { status: 500 });
  }
}
