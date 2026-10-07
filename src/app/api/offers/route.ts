import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { getDb } from "@/lib/db";
import { getAuth } from "@/lib/auth";
import { getAllowedOfferUser } from "@/lib/offer-access";
import { offerItems, offerTechnicalSheets, offers } from "@/lib/db/schema";
import { getR2BucketName, getR2Client } from "@/lib/storage/r2";

function isoDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return new Date().toISOString().slice(0, 10);
  const cro = value.match(/^(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})/);
  if (cro) return `${cro[3]}-${cro[2].padStart(2, "0")}-${cro[1].padStart(2, "0")}`;
  return value;
}

export async function POST(request: Request) {
  const allowedUser = await getAllowedOfferUser();
  if (!allowedUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: session } = await getAuth().getSession();
  const email = session?.user?.email?.trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (!body.offerNumber || !Array.isArray(body.items)) {
    return NextResponse.json({ error: "Offer number and items are required" }, { status: 400 });
  }

  const db = getDb();
  try {
    const offerValues = {
        offerNumber: String(body.offerNumber),
        offerDate: isoDate(body.offerDate),
        validUntil: body.validUntil ? isoDate(body.validUntil) : null,
        clientName: String(body.clientName ?? ""),
        clientAddress: String(body.clientAddress ?? ""),
        clientPhone: String(body.clientPhone ?? ""),
        clientEmail: String(body.clientEmail ?? ""),
        coContact: String(body.coContact ?? ""),
        coEmail: String(body.coEmail ?? ""),
        discountPct: String(body.discountPct ?? 0),
        showDiscount: Boolean(body.showDiscount),
        vatRate: String(body.vatRate ?? 25),
        paymentTerms: String(body.paymentTerms ?? ""),
        deliveryTerms: String(body.deliveryTerms ?? ""),
        termsPageTitle: String(body.termsPageTitle ?? "Napomena i jamstvo"),
        termsPageSubtitle: String(body.termsPageSubtitle ?? "Uvjeti ponude"),
        notesHeading: String(body.notesHeading ?? "Napomena"),
        offerNotes: Array.isArray(body.offerNotes) ? body.offerNotes.map(String) : [],
        warrantyHeading: String(body.warrantyHeading ?? "Jamstvo"),
        warrantyParagraphs: Array.isArray(body.warrantyParagraphs) ? body.warrantyParagraphs.map(String) : [],
        updatedBy: email,
      };
    const existingImageKeys = new Set<string>();
    if (typeof body.offerId === "string" && body.offerId) {
      const savedItems = await db.select({ imageKey: offerItems.imageKey }).from(offerItems).where(eq(offerItems.offerId, body.offerId));
      for (const item of savedItems) if (item.imageKey) existingImageKeys.add(item.imageKey);
    }
    const preparedItems: (Record<string, unknown> & { imageKey: string | null; imageContentType: string | null })[] = [];
    for (const item of body.items as Record<string, unknown>[]) {
      let imageKey = typeof item.imageKey === "string" ? item.imageKey : null;
      let imageContentType = typeof item.imageContentType === "string" ? item.imageContentType : null;
      if (imageKey && !existingImageKeys.has(imageKey)) {
        if (!/^offers\/images\/[0-9a-f-]{36}\.(?:png|jpg|webp|gif)$/.test(imageKey)) {
          return NextResponse.json({ error: "Unknown offer image" }, { status: 400 });
        }
        try {
          const object = await getR2Client().send(new HeadObjectCommand({ Bucket: getR2BucketName(), Key: imageKey }));
          imageContentType = object.ContentType || imageContentType;
        } catch {
          return NextResponse.json({ error: "Unknown offer image" }, { status: 400 });
        }
      }
      preparedItems.push({ ...item, imageKey, imageContentType });
    }
    let offerId: string;
    if (typeof body.offerId === "string" && body.offerId) {
      const [updated] = await db.update(offers).set({ ...offerValues, updatedBy: email, updatedAt: new Date() }).where(eq(offers.id, body.offerId)).returning({ id: offers.id });
      if (!updated) return NextResponse.json({ error: "Offer not found" }, { status: 404 });
      offerId = updated.id;
      await db.delete(offerItems).where(eq(offerItems.offerId, offerId));
      await db.delete(offerTechnicalSheets).where(eq(offerTechnicalSheets.offerId, offerId));
    } else {
      const [created] = await db.insert(offers).values({ ...offerValues, createdBy: email }).returning({ id: offers.id });
      offerId = created.id;
    }

    if (preparedItems.length) {
      await db.insert(offerItems).values(
        preparedItems.map((item, index) => ({
          offerId,
          position: Number(item.position ?? index),
          description: String(item.description ?? ""),
          imageKey: item.imageKey ? String(item.imageKey) : null,
          imageName: item.imageName ? String(item.imageName) : null,
          imageContentType: item.imageContentType ? String(item.imageContentType) : null,
          quantity: String(item.quantity ?? 0),
          unitPrice: String(item.unitPrice ?? 0),
          discountPct: String(item.discountPct ?? 0),
          dimensions: String(item.dimensions ?? ""),
          isSurcharge: Boolean(item.isSurcharge),
        }))
      );
    }

    const sheetIds = Array.isArray(body.technicalSheetIds) ? body.technicalSheetIds.filter((id: unknown): id is string => typeof id === "string") : [];
    if (sheetIds.length) {
      await db.insert(offerTechnicalSheets).values(
        sheetIds.map((technicalSheetId: string, position: number) => ({ offerId, technicalSheetId, position }))
      );
    }

    return NextResponse.json({ id: offerId, imageKeys: preparedItems.map((item) => item.imageKey) }, { status: body.offerId ? 200 : 201 });
  } catch (error) {
    console.error("Failed to save offer", error);
    const dbError = error as { cause?: { code?: string } };
    if (dbError.cause?.code === "23505") {
      return NextResponse.json({ error: "An offer with this number already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Offer could not be saved" }, { status: 500 });
  }
}
