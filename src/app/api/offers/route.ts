import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { getDb } from "@/lib/db";
import { getAuth } from "@/lib/auth";
import { getAllowedOfferUser } from "@/lib/offer-access";
import { offerItems, offerTechnicalSheets, offers } from "@/lib/db/schema";
import { getR2BucketName, getR2Client } from "@/lib/storage/r2";
import type { TechnicalPresentation } from "@/lib/technical-presentations";

function isoDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return new Date().toISOString().slice(0, 10);
  const cro = value.match(/^(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})/);
  if (cro) return `${cro[3]}-${cro[2].padStart(2, "0")}-${cro[1].padStart(2, "0")}`;
  return value;
}

function isTechnicalPresentation(value: unknown): value is TechnicalPresentation {
  if (!value || typeof value !== "object") return false;
  const page = value as Record<string, unknown>;
  return typeof page.title === "string" && typeof page.description === "string"
    && (page.imageKey === null || (typeof page.imageKey === "string" && page.imageKey.length > 0));
}

class UnknownOfferImageError extends Error {}

export async function POST(request: Request) {
  const allowedUser = await getAllowedOfferUser();
  if (!allowedUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: session } = await getAuth().getSession();
  const email = session?.user?.email?.trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !body.offerNumber || !Array.isArray(body.items)
    || !body.items.every((item: unknown) => item !== null && typeof item === "object" && !Array.isArray(item))) {
    return NextResponse.json({ error: "Offer number and items are required" }, { status: 400 });
  }
  const presentations: unknown = body.technicalPresentations;
  if (presentations !== undefined && (!Array.isArray(presentations) || !presentations.every(isTechnicalPresentation))) {
    return NextResponse.json({ error: "Neispravna tehnička prezentacija." }, { status: 400 });
  }
  const technicalPresentations: TechnicalPresentation[] | undefined = presentations?.map(
    ({ title, description, imageKey }) => ({ title, description, imageKey }),
  );
  const updating = typeof body.offerId === "string" && body.offerId.length > 0;
  if (updating && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.offerId)) {
    return NextResponse.json({ error: "Neispravan ID ponude." }, { status: 400 });
  }
  const offerId = updating ? String(body.offerId) : crypto.randomUUID();

  const db = getDb();
  try {
    const offerValues = {
        offerNumber: String(body.offerNumber),
        offerDate: isoDate(body.offerDate),
        validUntil: body.validUntil ? isoDate(body.validUntil) : null,
        objekat: typeof body.objekat === "string" ? body.objekat.trim() : undefined,
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
        certificateNotes: typeof body.certificateNotes === "string" ? body.certificateNotes : undefined,
        installationNotes: typeof body.installationNotes === "string" ? body.installationNotes : undefined,
        technicalPresentations,
        updatedBy: email,
      };
    const existingImageKeys = new Set<string>();
    if (updating) {
      const [[savedOffer], savedItems] = await Promise.all([
        db.select({ presentations: offers.technicalPresentations }).from(offers).where(eq(offers.id, offerId)).limit(1),
        db.select({ imageKey: offerItems.imageKey }).from(offerItems).where(eq(offerItems.offerId, offerId)),
      ]);
      if (!savedOffer) return NextResponse.json({ error: "Offer not found" }, { status: 404 });
      for (const { imageKey } of [...savedItems, ...(savedOffer.presentations ?? [])]) {
        if (imageKey) existingImageKeys.add(imageKey);
      }
    }

    const validatedImages = new Map<string, string | undefined>();
    async function checkImage(key: string) {
      if (existingImageKeys.has(key)) return undefined;
      if (validatedImages.has(key)) return validatedImages.get(key);
      if (!/^offers\/images\/[0-9a-f-]{36}\.(?:png|jpg|webp|gif)$/.test(key)) throw new UnknownOfferImageError();
      try {
        const object = await getR2Client().send(new HeadObjectCommand({ Bucket: getR2BucketName(), Key: key }));
        validatedImages.set(key, object.ContentType);
        return object.ContentType;
      } catch {
        throw new UnknownOfferImageError();
      }
    }

    const preparedItems: (Record<string, unknown> & { imageKey: string | null; imageContentType: string | null })[] = [];
    for (const item of body.items as Record<string, unknown>[]) {
      const imageKey = typeof item.imageKey === "string" ? item.imageKey : null;
      const storedType = imageKey ? await checkImage(imageKey) : undefined;
      const imageContentType = storedType || (typeof item.imageContentType === "string" ? item.imageContentType : null);
      preparedItems.push({ ...item, imageKey, imageContentType });
    }
    for (const { imageKey } of technicalPresentations ?? []) {
      if (imageKey) await checkImage(imageKey);
    }

    const saveOffer = updating
      ? db.update(offers).set({ ...offerValues, updatedAt: new Date() }).where(eq(offers.id, offerId)).returning({ id: offers.id })
      : db.insert(offers).values({ ...offerValues, id: offerId, createdBy: email }).returning({ id: offers.id });
    const queries: [typeof saveOffer, ...BatchItem<"pg">[]] = [saveOffer];
    if (updating) {
      queries.push(
        db.delete(offerItems).where(eq(offerItems.offerId, offerId)),
        db.delete(offerTechnicalSheets).where(eq(offerTechnicalSheets.offerId, offerId)),
      );
    }

    if (preparedItems.length) {
      queries.push(db.insert(offerItems).values(
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
      ));
    }

    const sheetIds = Array.isArray(body.technicalSheetIds) ? body.technicalSheetIds.filter((id: unknown): id is string => typeof id === "string") : [];
    if (sheetIds.length) {
      queries.push(db.insert(offerTechnicalSheets).values(
        sheetIds.map((technicalSheetId: string, position: number) => ({ offerId, technicalSheetId, position }))
      ));
    }

    const [[saved]] = await db.batch(queries);
    if (!saved) return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    return NextResponse.json({ id: offerId, imageKeys: preparedItems.map((item) => item.imageKey) }, { status: updating ? 200 : 201 });
  } catch (error) {
    if (error instanceof UnknownOfferImageError) {
      return NextResponse.json({ error: "Slika ponude nije pronađena." }, { status: 400 });
    }
    const dbError = error as { code?: string; cause?: { code?: string } };
    const code = dbError.code ?? dbError.cause?.code;
    if (code === "23505") {
      return NextResponse.json({ error: "An offer with this number already exists" }, { status: 409 });
    }
    console.error("Failed to save offer", { code, name: error instanceof Error ? error.name : undefined });
    return NextResponse.json({ error: "Offer could not be saved" }, { status: 500 });
  }
}
