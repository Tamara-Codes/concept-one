import PonudaForm from "../../PonudaForm";
import { inArray } from "drizzle-orm";
import { eq, asc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { offerItems, offerTechnicalSheets, offers, technicalSheets } from "@/lib/db/schema";

export const metadata = { title: "Uredi novu ponudu | Concept One" };

export default async function NewOfferEditorPage({
  searchParams,
}: {
  searchParams?: Promise<{ technicalSheets?: string; offerId?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const offerId = params.offerId;
  const db = getDb();
  const [savedOffer] = offerId
    ? await db.select().from(offers).where(eq(offers.id, offerId)).limit(1)
    : [];
  const savedItems = savedOffer
    ? await db.select().from(offerItems).where(eq(offerItems.offerId, savedOffer.id)).orderBy(asc(offerItems.position))
    : [];
  const savedSheets = savedOffer
    ? await db
        .select({ id: technicalSheets.id, name: technicalSheets.name, description: technicalSheets.description, storageKey: technicalSheets.storageKey, position: offerTechnicalSheets.position })
        .from(offerTechnicalSheets)
        .innerJoin(technicalSheets, eq(technicalSheets.id, offerTechnicalSheets.technicalSheetId))
        .where(eq(offerTechnicalSheets.offerId, savedOffer.id))
        .orderBy(asc(offerTechnicalSheets.position))
    : [];
  const selectedNames = params.technicalSheets?.split(",").filter(Boolean) ?? [];
  const rows = selectedNames.length && !savedOffer
    ? await db
        .select({ id: technicalSheets.id, name: technicalSheets.name, description: technicalSheets.description, storageKey: technicalSheets.storageKey })
        .from(technicalSheets)
        .where(inArray(technicalSheets.name, selectedNames))
    : [];
  const selectedSheets = selectedNames
    .map((name) => rows.find((row) => row.name === name))
    .filter((row): row is (typeof rows)[number] => Boolean(row));

  const initialOffer = savedOffer
    ? {
        id: savedOffer.id,
        offerNumber: savedOffer.offerNumber,
        offerDate: savedOffer.offerDate,
        validUntil: savedOffer.validUntil,
        clientName: savedOffer.clientName,
        clientAddress: savedOffer.clientAddress,
        clientPhone: savedOffer.clientPhone,
        clientEmail: savedOffer.clientEmail,
        coContact: savedOffer.coContact,
        coEmail: savedOffer.coEmail,
        discountPct: savedOffer.discountPct,
        showDiscount: savedOffer.showDiscount,
        vatRate: savedOffer.vatRate,
        paymentTerms: savedOffer.paymentTerms,
        deliveryTerms: savedOffer.deliveryTerms,
        termsPageTitle: savedOffer.termsPageTitle,
        termsPageSubtitle: savedOffer.termsPageSubtitle,
        notesHeading: savedOffer.notesHeading,
        offerNotes: savedOffer.offerNotes,
        warrantyHeading: savedOffer.warrantyHeading,
        warrantyParagraphs: savedOffer.warrantyParagraphs,
        items: savedItems,
      }
    : undefined;

  return <PonudaForm technicalSheets={savedOffer ? savedSheets : selectedSheets} initialOffer={initialOffer} />;
}
