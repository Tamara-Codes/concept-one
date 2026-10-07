import { GetObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { getAllowedOfferUser } from "@/lib/offer-access";
import { getDb } from "@/lib/db";
import { offerItems } from "@/lib/db/schema";
import { getR2BucketName, getR2Client } from "@/lib/storage/r2";
import { InvalidOfferImageError, MAX_IMAGE_BYTES, saveOfferImage } from "@/lib/offer-images";

export async function POST(request: Request) {
  if (!await getAllowedOfferUser()) return new Response(null, { status: 401 });
  if (Number(request.headers.get("content-length")) > MAX_IMAGE_BYTES) {
    return Response.json({ error: "Slika je prevelika (najviše 4 MB)." }, { status: 413 });
  }

  try {
    const bytes = new Uint8Array(await request.arrayBuffer());
    const image = await saveOfferImage(bytes, request.headers.get("content-type") || "");
    return Response.json(image, { status: 201 });
  } catch (error) {
    if (error instanceof InvalidOfferImageError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    console.error("Failed to upload offer image", error);
    return Response.json({ error: "Slika se nije mogla spremiti." }, { status: 502 });
  }
}

export async function GET(request: Request) {
  if (!await getAllowedOfferUser()) return new Response(null, { status: 401 });

  const key = new URL(request.url).searchParams.get("key");
  if (!key) return new Response(null, { status: 400 });

  const [item] = await getDb().select({ imageKey: offerItems.imageKey }).from(offerItems).where(eq(offerItems.imageKey, key)).limit(1);
  if (!item) return new Response(null, { status: 404 });

  try {
    const object = await getR2Client().send(new GetObjectCommand({ Bucket: getR2BucketName(), Key: key }));
    if (!object.Body) return new Response(null, { status: 404 });
    const bytes = await object.Body.transformToByteArray();
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": object.ContentType || "application/octet-stream",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Failed to load offer image", error);
    return new Response(null, { status: 502 });
  }
}
