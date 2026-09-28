"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { site } from "@/data/site";

type Item = {
  id: string;
  desc: string;
  imageSrc: string;
  imageName: string;
  qty: number;
  price: number;
  discountPct: number;
  dimensions: string;
  isSurcharge: boolean;
};

const eur = new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR" });
const offerSectionVisibility = {
  projects: false,
};

type TechnicalSheet = {
  id: string;
  name: string;
  description: string;
  storageKey: string;
};

type InitialOffer = {
  id: string;
  offerNumber: string;
  offerDate: string;
  validUntil: string | null;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;
  coContact: string;
  coEmail: string;
  discountPct: string | number;
  showDiscount: boolean;
  vatRate: string | number;
  paymentTerms: string;
  deliveryTerms: string;
  termsPageTitle: string;
  termsPageSubtitle: string;
  notesHeading: string;
  offerNotes: string[];
  warrantyHeading: string;
  warrantyParagraphs: string[];
  items: Array<{
    description: string;
    imageName: string | null;
    quantity: string | number;
    unitPrice: string | number;
    discountPct: string | number;
    dimensions: string;
    isSurcharge: boolean;
  }>;
};

function money(n: number) {
  return eur.format(Number.isFinite(n) ? n : 0);
}

function newItem(): Item {
  return {
    id: crypto.randomUUID(),
    desc: "",
    imageSrc: "",
    imageName: "",
    qty: 0,
    price: 0,
    discountPct: 0,
    dimensions: "",
    isSurcharge: false,
  };
}

function newSurchargeItem(): Item {
  return {
    id: crypto.randomUUID(),
    desc: "",
    imageSrc: "",
    imageName: "",
    qty: 0,
    price: 0,
    discountPct: 0,
    dimensions: "",
    isSurcharge: true,
  };
}

// Parses a number typed either the US way (1234.56) or the Croatian way
// (1.234,56 / 245,00), so pasted Excel cells work either way.
function parseNum(raw: string): number {
  let s = (raw || "").replace(/[€%\s]/g, "").trim();
  if (!s) return 0;
  if (/,\d{1,2}$/.test(s)) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else {
    s = s.replace(/,/g, "");
  }
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

// Maps one pasted row's tab-separated cells to item fields. Column count
// tells us whether Excel's r/b and/or Ukupno columns were included.
function mapPastedRow(cols: string[]): Partial<Item> {
  if (cols.length <= 1) {
    return { desc: cols[0] || "", qty: 1, price: 0, discountPct: 0 };
  }
  if (cols.length === 2) {
    return { desc: cols[0], qty: parseNum(cols[1]), price: 0, discountPct: 0 };
  }
  if (cols.length === 3) {
    return { desc: cols[0], qty: parseNum(cols[1]), price: parseNum(cols[2]), discountPct: 0 };
  }
  if (cols.length === 4) {
    return {
      desc: cols[0],
      qty: parseNum(cols[1]),
      price: parseNum(cols[2]),
      discountPct: parseNum(cols[3]),
    };
  }
  // 5+ columns: assume the leading r/b column (and, past 5, a trailing
  // Ukupno column) came along for the ride.
  return {
    desc: cols[1],
    qty: parseNum(cols[2]),
    price: parseNum(cols[3]),
    discountPct: parseNum(cols[4]),
  };
}

function OfferPageFooter() {
  return (
    <div className="offer-page-footer">
      <strong>CONCEPT ONE</strong>
      <span>www.conceptone.hr</span>
    </div>
  );
}

function OfferPageHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="offer-static-heading">
      <div className="offer-static-brand">CONCEPT ONE</div>
      <h2>{title}</h2>
      <p>{subtitle}</p>
      <div className="offer-gold-rule" />
    </header>
  );
}

export default function PonudaForm({ technicalSheets = [], initialOffer }: { technicalSheets?: TechnicalSheet[]; initialOffer?: InitialOffer }) {
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "exists" | "error">("idle");
  const [offerNumber, setOfferNumber] = useState(initialOffer?.offerNumber ?? "001-2026");
  const [offerDate, setOfferDate] = useState(initialOffer?.offerDate ?? new Date().toLocaleDateString("hr-HR"));
  const [validUntil, setValidUntil] = useState(initialOffer?.validUntil ?? "");

  const [clientName, setClientName] = useState(initialOffer?.clientName ?? "");
  const [clientAddress, setClientAddress] = useState(initialOffer?.clientAddress ?? "");
  const [clientPhone, setClientPhone] = useState(initialOffer?.clientPhone ?? "");
  const [clientEmail, setClientEmail] = useState(initialOffer?.clientEmail ?? "");

  const [coContact, setCoContact] = useState(initialOffer?.coContact ?? `${site.contacts[0].name} · ${site.contacts[0].phoneDisplay}`);
  const [coEmail, setCoEmail] = useState(initialOffer?.coEmail ?? site.contacts[0].email);

  const [items, setItems] = useState<Item[]>(initialOffer?.items?.length ? initialOffer.items.map((item) => ({ ...newItem(), id: crypto.randomUUID(), desc: item.description, imageName: item.imageName ?? "", qty: Number(item.quantity), price: Number(item.unitPrice), discountPct: Number(item.discountPct), dimensions: item.dimensions, isSurcharge: item.isSurcharge })) : [newItem()]);
  const [discountPct, setDiscountPct] = useState(Number(initialOffer?.discountPct ?? 0));
  const [showDiscount, setShowDiscount] = useState(initialOffer?.showDiscount ?? false);
  const [vatRate, setVatRate] = useState(Number(initialOffer?.vatRate ?? 25));
  const [paymentTerms, setPaymentTerms] = useState(initialOffer?.paymentTerms ?? "40% po potvrdi narudžbe, ostatak po obavijesti o spremnosti robe");
  const [deliveryTerms, setDeliveryTerms] = useState(initialOffer?.deliveryTerms ?? "30–45 radnih dana od potvrde narudžbe");
  const [termsPageTitle, setTermsPageTitle] = useState(initialOffer?.termsPageTitle ?? "Napomena i jamstvo");
  const [termsPageSubtitle, setTermsPageSubtitle] = useState(initialOffer?.termsPageSubtitle ?? "Uvjeti ponude");
  const [notesHeading, setNotesHeading] = useState(initialOffer?.notesHeading ?? "Napomena");
  const [offerNotes, setOfferNotes] = useState(initialOffer?.offerNotes ?? [
    "Montaža nije uključena u cijenu.",
    "PDV nije uključen u cijenu.",
    "Prijevoz na lokaciju uključen je u cijenu.",
    "Dizalice i ostala mehanizacija na gradilištu nisu uključene u cijenu.",
    "Svi usmeni dogovori, izmjene ili dopune koje nisu navedene u pisanoj ponudi smatraju se nevažećima i nisu obvezujući za Concept One.",
  ]);
  const [warrantyHeading, setWarrantyHeading] = useState(initialOffer?.warrantyHeading ?? "Jamstvo");
  const [warrantyParagraphs, setWarrantyParagraphs] = useState(initialOffer?.warrantyParagraphs ?? [
    "Prodavatelj daje jamstvo u trajanju od 5 godina na profile i postojanost boje, okove i mehanizme te termoizolacijske staklene jedinice. Također, prodavatelj daje jamstvo u trajanju od 2 godine na dodatnu opremu (rolete, komarnike i slično), osim u slučajevima mehaničkih oštećenja, nepravilne uporabe, neadekvatnog održavanja ili nepridržavanja uputa za uporabu.",
    "Jamstvo ne obuhvaća oštećenja nastala tijekom prijevoza, rukovanja na lokaciji ili montaže, kao ni oštećenja koja su posljedica nepravilnog skladištenja, manipulacije ili ugradnje od strane trećih osoba.",
  ]);

  function updateItem(id: string, patch: Partial<Item>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }
  function addItem() {
    setItems((prev) => [...prev, newItem()]);
  }
  function addSurchargeAfter(id: string) {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === id);
      if (idx === -1) return [...prev, newSurchargeItem()];
      const next = [...prev];
      next.splice(idx + 1, 0, newSurchargeItem());
      return next;
    });
  }
  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }
  function duplicateItem(id: string) {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === id);
      if (idx === -1) return prev;
      const copy = { ...prev[idx], id: crypto.randomUUID() };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  }

  // Lets someone paste a block copied from Excel straight into the Opis
  // cell: the first row fills the row being pasted into, every extra row
  // becomes a new stavka inserted right after it.
  function pasteIntoRow(id: string, isSurcharge: boolean, text: string) {
    const lines = text.split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0);
    const rows = lines.map((line) => mapPastedRow(line.split("\t")));
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === id);
      if (idx === -1 || rows.length === 0) return prev;
      const updatedFirst = { ...prev[idx], ...rows[0] };
      const extra = rows
        .slice(1)
        .map((patch) => ({ ...(isSurcharge ? newSurchargeItem() : newItem()), ...patch }));
      const next = [...prev];
      next.splice(idx, 1, updatedFirst, ...extra);
      return next;
    });
  }

  function pasteImageIntoRow(id: string, file: File) {
    const reader = new FileReader();
    reader.onload = () =>
      updateItem(id, {
        imageSrc: String(reader.result),
        imageName: file.name || "Slika proizvoda",
      });
    reader.readAsDataURL(file);
  }

  const lineTotals = useMemo(
    () => items.map((it) => it.qty * it.price * (1 - it.discountPct / 100)),
    [items]
  );
  const subtotal = useMemo(() => lineTotals.reduce((a, b) => a + b, 0), [lineTotals]);
  const discountAmount = subtotal * (discountPct / 100);
  const vatBase = subtotal - discountAmount;
  const vatAmount = vatBase * (vatRate / 100);
  const grandTotal = vatBase + vatAmount;

  async function saveOffer() {
    setSaveState("saving");
    try {
      const response = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId: initialOffer?.id,
          offerNumber,
          offerDate,
          validUntil,
          clientName,
          clientAddress,
          clientPhone,
          clientEmail,
          coContact,
          coEmail,
          discountPct,
          showDiscount,
          vatRate,
          paymentTerms,
          deliveryTerms,
          termsPageTitle,
          termsPageSubtitle,
          notesHeading,
          offerNotes,
          warrantyHeading,
          warrantyParagraphs,
          technicalSheetIds: technicalSheets.map((sheet) => sheet.id),
          items: items.map((item, index) => ({
            position: index,
            description: item.desc,
            imageKey: null,
            imageName: item.imageName || null,
            imageContentType: null,
            quantity: item.qty,
            unitPrice: item.price,
            discountPct: item.discountPct,
            dimensions: item.dimensions,
            isSurcharge: item.isSurcharge,
          })),
        }),
      });
      if (response.status === 409) {
        setSaveState("exists");
        return;
      }
      if (!response.ok) throw new Error("Spremanje nije uspjelo");
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <div className="min-h-screen bg-co-warm-dark py-10 print:bg-white print:py-0">
      <div className="no-print max-w-[210mm] mx-auto px-4 mb-4 flex items-center justify-between">
        <a href={initialOffer ? "/ponuda/saved" : "/ponuda"} className="text-sm text-co-charcoal/50 hover:text-co-accent-dark transition-colors">
          &larr; Natrag na ponude
        </a>
        <div className="flex items-center gap-3">
          <button
            onClick={saveOffer}
            disabled={saveState === "saving" || saveState === "saved" || saveState === "exists"}
            className="text-sm font-semibold px-5 py-2 rounded-md border border-co-charcoal/20 bg-white text-co-charcoal hover:bg-co-warm transition-colors disabled:cursor-default disabled:opacity-60"
          >
            {saveState === "saving" ? "Spremam…" : saveState === "saved" ? "Spremljeno" : saveState === "exists" ? "Već spremljeno" : "Spremi ponudu"}
          </button>
          <button
            onClick={() => window.print()}
            className="text-sm font-semibold px-5 py-2 rounded-md bg-co-charcoal text-white hover:bg-co-accent-dark transition-colors"
          >
            Ispi&scaron;i / Spremi kao PDF
          </button>
          {saveState === "exists" && <span className="text-sm text-slate-600">Broj ponude već postoji u arhivi.</span>}
          {saveState === "error" && <span className="text-sm text-red-700">Spremanje nije uspjelo.</span>}
        </div>
      </div>

      <div className="offer-document max-w-[210mm] mx-auto">
        <section className="offer-page offer-cover-page">
          <Image
            src="/images/offer/cover.png"
            alt="Concept One naslovnica ponude"
            fill
            priority
            sizes="210mm"
            className="offer-cover-image"
          />
          <div className="offer-cover-copy">
            <h1>PONUDA</h1>
            <p className="offer-cover-subtitle">Prilagođeno rješenje za vaš prostor</p>
            <div className="offer-cover-fields">
              <label>
                <span>BROJ PONUDE</span>
                <input value={offerNumber} onChange={(e) => setOfferNumber(e.target.value)} />
              </label>
              <label>
                <span>KLIJENT</span>
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="ime klijenta"
                />
              </label>
              <label>
                <span>DATUM PONUDE</span>
                <input value={offerDate} onChange={(e) => setOfferDate(e.target.value)} />
              </label>
              <label>
                <span>PONUDA VRIJEDI DO</span>
                <input
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  placeholder="dd.mm.gggg."
                />
              </label>
            </div>
          </div>
          <div className="offer-cover-footer">
            <strong>CONCEPT ONE</strong>
            <span>www.conceptone.hr</span>
          </div>
        </section>

        <section className="offer-page offer-about-page">
          <div className="offer-about-image">
            <Image
              src="/images/pages/about.jpg"
              alt="Savjetovanje o aluminijskom sustavu"
              fill
              sizes="44vw"
              className="object-cover"
            />
          </div>
          <div className="offer-about-copy">
            <div className="offer-static-brand">CONCEPT ONE</div>
            <h2>O nama</h2>
            <h3>Jedan partner za cijeli objekt</h3>
            <p>
              Concept One nudi aluminijsku i PVC bravariju, vrata, podove i PU panele. Odabiremo
              rješenja koja odgovaraju vašem projektu i pratimo vas od savjetovanja do ugradnje.
            </p>
            <p>
              Surađujemo s provjerenim proizvođačima i pomažemo pri odabiru materijala, završnih
              obrada i tehničkih rješenja za stambene i poslovne prostore.
            </p>
            <ul>
              <li>Aluminijska i PVC bravarija</li>
              <li>Vrata</li>
              <li>Podovi</li>
              <li>Zidni paneli</li>
            </ul>
          </div>
          <OfferPageFooter />
        </section>

        <section className="sheet offer-page offer-form-page shadow-2xl print:shadow-none">
        {/* Header */}
        <div className="d3-head">
          <Image
            src="/images/brand/logo-dark.png"
            alt="Concept One"
            width={200}
            height={200}
            className="d3-logo"
          />
          <div className="d3-headtext">
            <h1 className="d3-title">Ponuda</h1>
            <div className="d3-subline">
              <span>Br.</span>
              <input
                value={offerNumber}
                onChange={(e) => setOfferNumber(e.target.value)}
                className="field w-32"
              />
              <span>&bull;</span>
              <input
                value={offerDate}
                onChange={(e) => setOfferDate(e.target.value)}
                className="field w-24"
              />
            </div>
          </div>
        </div>

        <div className="d3-hr" />

        {/* Client / contact */}
        <div className="d3-parties">
          <div>
            <p className="d3-label">Naru&#269;itelj</p>
            <input
              placeholder="Naziv klijenta"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="field d3-clientname w-full"
            />
            <input
              placeholder="Adresa, mjesto"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              className="field d3-clientline w-full mt-1"
            />
            <input
              placeholder="Telefon"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="field d3-clientline w-full mt-1"
            />
            <input
              placeholder="E-mail"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="field d3-clientline w-full mt-1"
            />
          </div>
          <div className="d3-right">
            <p className="d3-label">Va&scaron;a kontakt osoba</p>
            <input
              value={coContact}
              onChange={(e) => setCoContact(e.target.value)}
              className="field d3-clientline w-full text-right"
            />
            <input
              value={coEmail}
              onChange={(e) => setCoEmail(e.target.value)}
              className="field d3-clientline w-full text-right mt-1"
            />
            <div className="d3-validuntil">
              <span>Vrijedi do</span>
              <input
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                placeholder="dd.mm.gggg."
                className="field text-right"
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="d3-tablewrap">
        <table className="d3-table">
          <colgroup>
            <col className="d3-col-rbr" />
            <col />
            <col className="d3-col-dim" />
            <col className="d3-col-num" />
            <col className="d3-col-num" />
            <col className="d3-col-num" />
            <col className="d3-col-total" />
            <col className="no-print d3-col-actions" />
          </colgroup>
          <thead>
            <tr>
              <th>R.br.</th>
              <th>Opis</th>
              <th>Dimenzije</th>
              <th className="num">Kol.</th>
              <th className="num">Cijena &euro;</th>
              <th className="num">Rabat %</th>
              <th className="num">Ukupno</th>
              <th className="no-print" />
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={it.id} className={it.isSurcharge ? "d3-row-surcharge" : undefined}>
                <td className="d3-rbr">{i + 1}</td>
                <td>
                  {it.isSurcharge && <div className="d3-surchargetag">Nadoplata</div>}
                  <textarea
                    ref={(el) => {
                      if (el) {
                        el.style.height = "auto";
                        el.style.height = `${el.scrollHeight}px`;
                      }
                    }}
                    value={it.desc}
                    onChange={(e) => {
                      updateItem(it.id, { desc: e.target.value });
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    onPaste={(e) => {
                      const imageFile = Array.from(e.clipboardData.items)
                        .find((item) => item.kind === "file" && item.type.startsWith("image/"))
                        ?.getAsFile();
                      if (imageFile && !it.isSurcharge) {
                        e.preventDefault();
                        pasteImageIntoRow(it.id, imageFile);
                        return;
                      }
                      const text = e.clipboardData.getData("text/plain");
                      if (!text.includes("\t") && !text.includes("\n")) return;
                      e.preventDefault();
                      pasteIntoRow(it.id, it.isSurcharge, text);
                    }}
                    placeholder={
                      it.isSurcharge ? "Opis nadoplate" : "Opis proizvoda / usluge — zalijepi tekst ili sliku"
                    }
                    rows={1}
                    className={
                      it.isSurcharge
                        ? "field d3-name d3-name-surcharge w-full resize-none block overflow-hidden"
                        : "field d3-name w-full resize-none block overflow-hidden"
                    }
                  />
                  {it.imageSrc && !it.isSurcharge && (
                    <div className="d3-item-image-wrap">
                      <img src={it.imageSrc} alt={it.imageName || "Slika proizvoda"} className="d3-item-image" />
                      <button
                        type="button"
                        className="no-print d3-item-image-remove"
                        onClick={() => updateItem(it.id, { imageSrc: "", imageName: "" })}
                      >
                        Ukloni sliku
                      </button>
                    </div>
                  )}
                </td>
                <td>
                  {!it.isSurcharge && (
                    <input
                      value={it.dimensions}
                      onChange={(e) => updateItem(it.id, { dimensions: e.target.value })}
                      placeholder="95 x 210 x 18 cm"
                      className="field w-full"
                    />
                  )}
                </td>
                <td className="num">
                  <input
                    type="number"
                    max={100}
                    value={it.qty === 0 ? "" : it.qty}
                    onChange={(e) =>
                      updateItem(it.id, { qty: Math.min(100, parseFloat(e.target.value) || 0) })
                    }
                    className="field text-right w-full"
                  />
                </td>
                <td className="num">
                  <input
                    type="number"
                    value={it.price === 0 ? "" : it.price}
                    onChange={(e) => updateItem(it.id, { price: parseFloat(e.target.value) || 0 })}
                    className="field text-right w-full"
                  />
                </td>
                <td className="num">
                  <input
                    type="number"
                    value={it.discountPct === 0 ? "" : it.discountPct}
                    onChange={(e) =>
                      updateItem(it.id, { discountPct: parseFloat(e.target.value) || 0 })
                    }
                    className="field text-right w-full"
                  />
                </td>
                <td className="num">
                  <div className={it.isSurcharge ? "d3-total d3-total-surcharge" : "d3-total"}>
                    {money(lineTotals[i])}
                  </div>
                </td>
                <td className="no-print d3-actionscell">
                  <button
                    onClick={() => duplicateItem(it.id)}
                    className="d3-iconbtn d3-duplicate"
                    aria-label="Dupliciraj stavku"
                    title="Dupliciraj stavku"
                  >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="2" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                      <path
                        d="M5.5 11.5V13a1.5 1.5 0 0 0 1.5 1.5h5.5A1.5 1.5 0 0 0 14 13V7.5A1.5 1.5 0 0 0 12.5 6H11"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </button>
                  {!it.isSurcharge && (
                    <button
                      onClick={() => addSurchargeAfter(it.id)}
                      className="d3-iconbtn d3-addsurcharge"
                      aria-label="Dodaj nadoplatu"
                      title="Dodaj nadoplatu"
                    >
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                        <path d="M8 4v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <circle cx="8" cy="12.5" r="1" fill="currentColor" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => removeItem(it.id)}
                    className="d3-iconbtn d3-remove"
                    aria-label="Ukloni stavku"
                    title="Ukloni stavku"
                  >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 4l8 8M12 4l-8 8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="no-print">
            <tr>
              <td colSpan={8} className="d3-addrow-cell">
                <button onClick={addItem} className="d3-addrow" aria-label="Dodaj stavku" title="Dodaj stavku">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
        </div>

        {/* Totals */}
        <div className="d3-totals">
          <div className="d3-subrow">
            <span>Iznos bez PDV-a</span>
            <b>{money(subtotal)}</b>
          </div>
          {showDiscount ? (
            <div className="d3-subrow">
              <span className="flex items-center gap-1">
                Popust na ponudu
                <input
                  type="number"
                  value={discountPct}
                  onChange={(e) => setDiscountPct(parseFloat(e.target.value) || 0)}
                  className="field w-10 text-right"
                />
                %
                <button
                  onClick={() => {
                    setShowDiscount(false);
                    setDiscountPct(0);
                  }}
                  className="no-print d3-remove-inline"
                  aria-label="Ukloni popust"
                >
                  &times;
                </button>
              </span>
              <b>&minus;{money(discountAmount)}</b>
            </div>
          ) : (
            <div className="d3-subrow no-print">
              <button onClick={() => setShowDiscount(true)} className="d3-adddim">
                + Popust na ponudu
              </button>
            </div>
          )}
          <div className="d3-subrow">
            <span className="flex items-center gap-1">
              PDV
              <input
                type="number"
                value={vatRate}
                onChange={(e) => setVatRate(parseFloat(e.target.value) || 0)}
                className="field w-10 text-right"
              />
              %
            </span>
            <b>{money(vatAmount)}</b>
          </div>
          <div className="d3-grand">
            <span>Ukupno</span>
            <b>{money(grandTotal)}</b>
          </div>
        </div>

        {/* Terms */}
        <div className="d3-terms">
          <div>
            <span>Uvjeti pla&#263;anja</span>
            <input
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="field w-full mt-1"
            />
          </div>
          <div>
            <span>Rok isporuke</span>
            <input
              value={deliveryTerms}
              onChange={(e) => setDeliveryTerms(e.target.value)}
              className="field w-full mt-1"
            />
          </div>
        </div>

        {/* Signature */}
        <div className="d3-sign">
          <div className="d3-signbox">
            <div className="d3-signspace" />
            <div className="d3-signlabel">Sastavio</div>
          </div>
          <div className="d3-signbox">
            <div className="d3-signspace" />
            <div className="d3-signlabel">Ponudu prihva&#263;a &mdash; potpis i datum</div>
          </div>
        </div>

        {/* Footer */}
        <div className="d3-foot">
          <p>
            {site.legalName} &bull; {site.address} &bull; OIB: {site.oib} &bull; MB: {site.mb}
          </p>
          <p>
            {site.court}, MBS: {site.mbs} &bull; Temeljni kapital {site.capital} &bull; Direktor:{" "}
            {site.director}
          </p>
          <p>
            IBAN: {site.iban} &bull; {site.bank} &bull; www.conceptone.hr
          </p>
        </div>
        </section>

        <section className="offer-page offer-terms-page">
          <header className="offer-static-heading offer-editable-static-heading">
            <div className="offer-static-brand">CONCEPT ONE</div>
            <input
              value={termsPageTitle}
              onChange={(event) => setTermsPageTitle(event.target.value)}
              aria-label="Naslov stranice napomene i jamstva"
              className="offer-editable-heading-title"
            />
            <input
              value={termsPageSubtitle}
              onChange={(event) => setTermsPageSubtitle(event.target.value)}
              aria-label="Podnaslov stranice napomene i jamstva"
              className="offer-editable-heading-subtitle"
            />
            <div className="offer-gold-rule" />
          </header>
          <div className="offer-terms-content">
            <input
              value={notesHeading}
              onChange={(event) => setNotesHeading(event.target.value)}
              aria-label="Naslov napomene"
              className="offer-terms-heading-input"
            />
            <ul>
              {offerNotes.map((note, index) => (
                <li key={index}>
                  <textarea
                    ref={(element) => {
                      if (element) {
                        element.style.height = "auto";
                        element.style.height = `${element.scrollHeight}px`;
                      }
                    }}
                    value={note}
                    onChange={(event) => {
                      setOfferNotes((previous) =>
                        previous.map((item, itemIndex) => (itemIndex === index ? event.target.value : item))
                      );
                      event.target.style.height = "auto";
                      event.target.style.height = `${event.target.scrollHeight}px`;
                    }}
                    aria-label={`Napomena ${index + 1}`}
                    rows={1}
                    className="offer-terms-textarea"
                  />
                </li>
              ))}
            </ul>

            <input
              value={warrantyHeading}
              onChange={(event) => setWarrantyHeading(event.target.value)}
              aria-label="Naslov jamstva"
              className="offer-terms-heading-input offer-terms-heading-warranty"
            />
            {warrantyParagraphs.map((paragraph, index) => (
              <textarea
                key={index}
                ref={(element) => {
                  if (element) {
                    element.style.height = "auto";
                    element.style.height = `${element.scrollHeight}px`;
                  }
                }}
                value={paragraph}
                onChange={(event) => {
                  setWarrantyParagraphs((previous) =>
                    previous.map((item, itemIndex) => (itemIndex === index ? event.target.value : item))
                  );
                  event.target.style.height = "auto";
                  event.target.style.height = `${event.target.scrollHeight}px`;
                }}
                aria-label={`Jamstvo ${index + 1}`}
                rows={1}
                className="offer-terms-textarea offer-terms-paragraph"
              />
            ))}
          </div>
          <OfferPageFooter />
        </section>

        <section className="offer-page offer-brands-page">
          <OfferPageHeading
            title="Brendovi u našoj ponudi"
            subtitle="Suradnja s provjerenim proizvođačima"
          />
          <div className="offer-brand-logos">
            <div className="offer-brand-grid" aria-label="Brendovi u ponudi">
              <div className="offer-brand-logo offer-brand-sprite offer-brand-schueco" role="img" aria-label="Schüco" />
              <div className="offer-brand-logo offer-brand-sprite offer-brand-alumil" role="img" aria-label="Alumil" />
              <div className="offer-brand-logo offer-brand-sprite offer-brand-feal" role="img" aria-label="FEAL" />
              <div className="offer-brand-logo offer-brand-sprite offer-brand-rehau" role="img" aria-label="Rehau" />
              <div className="offer-brand-logo">
                <Image
                  src="/images/offer/brand-koemmerling.png"
                  alt="Kömmerling"
                  fill
                  sizes="40mm"
                  className="object-contain"
                />
              </div>
              <div className="offer-brand-logo offer-brand-sprite offer-brand-medle" role="img" aria-label="Medle" />
              <div className="offer-brand-logo offer-brand-sprite offer-brand-hormann" role="img" aria-label="Hörmann" />
              <div className="offer-brand-logo">
                <Image
                  src="/images/offer/brand-deco.png"
                  alt="Déco"
                  fill
                  sizes="40mm"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
          {offerSectionVisibility.projects && (
            <>
              <div className="offer-project-heading">
                <h2>Naši projekti</h2>
                <p>Odabrani projekti iz našeg portfelja</p>
                <div className="offer-gold-rule" />
              </div>
              <div className="offer-project-image">
                <Image
                  src="/images/offer/projects.png"
                  alt="Odabrani projekti"
                  fill
                  sizes="178mm"
                  className="object-cover"
                />
              </div>
            </>
          )}
          <OfferPageFooter />
        </section>

        {technicalSheets.map((sheet) => (
          <section className="offer-page offer-technical-page" key={sheet.name}>
            <OfferPageHeading title={`Tehnička prezentacija: ${sheet.name}`} subtitle="Proizvod uključen u ponudu" />
            <div className="offer-technical-copy">
              <h3>{sheet.name}</h3>
              <p>{sheet.description}</p>
              <p>Ovo je testni tehnički list. PDF i slika proizvoda mogu se dodati u R2 spremnik prije produkcije.</p>
            </div>
            <div className="offer-technical-image">
              <Image
                src="/images/offer/technical.png"
                alt={`Testni prikaz za ${sheet.name}`}
                fill
                sizes="178mm"
                className="object-contain"
              />
            </div>
            <OfferPageFooter />
          </section>
        ))}
      </div>

      <style>{`
        .offer-document {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .offer-page {
          position: relative;
          width: 210mm;
          min-height: 297mm;
          overflow: hidden;
          background: #ffffff;
          color: #202225;
          box-shadow: 0 24px 60px rgba(20, 24, 26, 0.2);
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        .offer-cover-page {
          isolation: isolate;
        }
        .offer-form-page {
          overflow: visible;
        }
        .offer-cover-image {
          object-fit: cover;
          z-index: -1;
        }
        .offer-cover-copy {
          position: absolute;
          left: 16mm;
          top: 45mm;
          width: 78mm;
        }
        .offer-cover-copy h1 {
          margin: 0;
          font-family: "Manrope", system-ui, sans-serif;
          font-size: 31pt;
          line-height: 1;
          font-weight: 800;
          letter-spacing: 0.01em;
          color: #202225;
        }
        .offer-cover-subtitle {
          margin: 8mm 0 17mm;
          color: #54595d;
          font-size: 12.5pt;
        }
        .offer-cover-fields {
          display: flex;
          flex-direction: column;
          gap: 9mm;
        }
        .offer-cover-fields label {
          display: block;
        }
        .offer-cover-fields span {
          display: block;
          margin-bottom: 2.5mm;
          color: #8f7044;
          font-size: 8.5pt;
          font-weight: 800;
          letter-spacing: 0.04em;
        }
        .offer-cover-fields input {
          display: block;
          width: 100%;
          border: 0;
          border-bottom: 1px solid #b5945f;
          outline: none;
          background: transparent;
          padding: 0 0 2.5mm;
          color: #202225;
          font: 14pt/1.2 "Manrope", system-ui, sans-serif;
        }
        .offer-cover-fields input:focus {
          border-bottom-color: #202225;
        }
        .offer-cover-fields input::placeholder {
          color: rgba(32, 34, 37, 0.55);
        }
        .offer-cover-footer {
          position: absolute;
          left: 16mm;
          bottom: 18mm;
          display: flex;
          flex-direction: column;
          gap: 2mm;
          font-size: 9pt;
        }
        .offer-cover-footer strong {
          color: #8f7044;
          letter-spacing: 0.04em;
        }
        .offer-cover-footer span {
          color: #202225;
        }

        .offer-about-page {
          display: grid;
          grid-template-columns: 44% 56%;
          padding-bottom: 22mm;
        }
        .offer-about-image {
          position: relative;
          min-height: 275mm;
        }
        .offer-about-copy {
          padding: 28mm 15mm 18mm 17mm;
        }
        .offer-static-brand {
          color: #8f7044;
          font-size: 9pt;
          font-weight: 800;
          letter-spacing: 0.08em;
        }
        .offer-about-copy h2,
        .offer-static-heading h2,
        .offer-project-heading h2 {
          margin: 7mm 0 0;
          color: #202225;
          font-family: "Fraunces", Georgia, serif;
          font-size: 29pt;
          line-height: 1.05;
          font-weight: 700;
        }
        .offer-about-copy h3 {
          margin: 5mm 0 15mm;
          font-family: "Fraunces", Georgia, serif;
          font-size: 18pt;
          line-height: 1.2;
        }
        .offer-about-copy p {
          margin: 0 0 8mm;
          color: #54595d;
          font-size: 11pt;
          line-height: 1.55;
        }
        .offer-about-copy ul {
          margin: 12mm 0 0;
          padding: 0;
          list-style: none;
          font-family: "Fraunces", Georgia, serif;
          font-size: 15pt;
          font-weight: 700;
          line-height: 1.55;
        }
        .offer-page-footer {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 22mm;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 15mm;
          background: #202225;
          color: #ffffff;
          font-size: 8.5pt;
          line-height: 1.55;
        }
        .offer-page-footer strong {
          color: #b5945f;
          letter-spacing: 0.07em;
        }

        .offer-static-heading {
          padding: 18mm 15mm 0;
        }
        .offer-static-heading h2 {
          margin-top: 7mm;
        }
        .offer-static-heading p,
        .offer-project-heading p {
          margin: 4mm 0 0;
          color: #54595d;
          font-size: 12pt;
        }
        .offer-editable-heading-title,
        .offer-editable-heading-subtitle,
        .offer-terms-heading-input,
        .offer-terms-textarea {
          display: block;
          width: 100%;
          border: 0;
          outline: none;
          background: transparent;
        }
        .offer-editable-heading-title:focus,
        .offer-editable-heading-subtitle:focus,
        .offer-terms-heading-input:focus,
        .offer-terms-textarea:focus {
          box-shadow: inset 0 -1px 0 #b5945f;
        }
        .offer-editable-heading-title {
          margin-top: 7mm;
          color: #202225;
          font-family: "Fraunces", Georgia, serif;
          font-size: 29pt;
          line-height: 1.05;
          font-weight: 700;
        }
        .offer-editable-heading-subtitle {
          margin-top: 4mm;
          color: #54595d;
          font-size: 12pt;
        }
        .offer-gold-rule {
          width: 100%;
          height: 1.2mm;
          margin-top: 8mm;
          background: #b5945f;
        }
        .offer-terms-content {
          padding: 11mm 15mm 30mm;
        }
        .offer-terms-content h3,
        .offer-technical-copy h3 {
          margin: 0 0 5mm;
          color: #8f7044;
          font-size: 11pt;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .offer-terms-content h3:nth-of-type(2) {
          margin-top: 18mm;
        }
        .offer-terms-heading-input {
          margin: 0 0 5mm;
          color: #8f7044;
          font-size: 11pt;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .offer-terms-heading-warranty {
          margin-top: 18mm;
        }
        .offer-terms-content ul {
          margin: 0;
          padding-left: 6mm;
          color: #54595d;
          font-size: 12pt;
          line-height: 1.7;
        }
        .offer-terms-textarea {
          resize: none;
          overflow: hidden;
          padding: 0;
          color: inherit;
          font: inherit;
          line-height: inherit;
        }
        .offer-terms-paragraph {
          margin: 0 0 7mm;
          color: #54595d;
          font-size: 11pt;
          line-height: 1.6;
        }
        .offer-terms-content p,
        .offer-technical-copy p {
          margin: 0 0 7mm;
          color: #54595d;
          font-size: 11pt;
          line-height: 1.6;
        }
        .offer-brand-logos {
          position: relative;
          width: calc(100% - 30mm);
          height: 64mm;
          margin: 11mm 15mm 0;
        }
        .offer-brand-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          grid-template-rows: repeat(2, minmax(0, 1fr));
          gap: 7mm 5mm;
          width: 100%;
          height: 100%;
        }
        .offer-brand-logo {
          position: relative;
          min-width: 0;
          min-height: 0;
        }
        .offer-brand-sprite {
          background-image: url("/images/offer/brand-logos.png");
          background-repeat: no-repeat;
          background-size: 400% 200%;
        }
        .offer-brand-schueco {
          background-position: 0 0;
        }
        .offer-brand-alumil {
          background-position: 0 100%;
        }
        .offer-brand-feal {
          background-position: 33.333% 0;
        }
        .offer-brand-rehau {
          background-position: 66.667% 0;
        }
        .offer-brand-medle {
          background-position: 33.333% 100%;
        }
        .offer-brand-hormann {
          background-position: 66.667% 100%;
        }
        .offer-project-heading {
          padding: 8mm 15mm 0;
        }
        .offer-project-heading h2 {
          margin-top: 0;
          font-size: 27pt;
        }
        .offer-project-heading .offer-gold-rule {
          margin-top: 6mm;
        }
        .offer-project-image {
          position: relative;
          width: calc(100% - 30mm);
          height: 99mm;
          margin: 8mm 15mm 28mm;
        }
        .offer-technical-copy {
          padding: 10mm 15mm 0;
        }
        .offer-technical-image {
          position: relative;
          width: calc(100% - 30mm);
          height: 92mm;
          margin: 7mm 15mm 28mm;
        }
        .sheet {
          --bg: #ffffff;
          --panel: #f3f4f2;
          --ink: #1e2326;
          --name: #1e2326;
          --muted: #6b7280;
          --line: #e4e7e3;
          --accent: #8a6a3b;
          --accent-ink: #c9a467;

          background: var(--bg);
          color: var(--ink);
          font-family: "Manrope", system-ui, sans-serif;
          font-size: 14px;
          padding: 18mm 16mm;
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
          color-scheme: light;
        }
        .d3-head {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .d3-logo {
          width: 96px;
          height: 96px;
          flex-shrink: 0;
        }
        .d3-headtext {
          display: flex;
          flex-direction: column;
        }
        .d3-title {
          font-family: "Fraunces", Georgia, serif;
          font-size: 40px;
          font-weight: 700;
          font-style: normal;
          letter-spacing: 0.01em;
          color: var(--name);
          margin: 0;
          line-height: 1;
        }
        .d3-subline {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          font-size: 12px;
          color: var(--muted);
        }
        .d3-subline .field {
          font-size: 12px;
          font-weight: 600;
          color: var(--ink);
        }
        .d3-validuntil {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 8px;
          font-size: 11px;
          color: var(--muted);
        }
        .d3-validuntil .field {
          width: 84px;
        }
        .d3-hr {
          height: 2px;
          background: var(--ink);
          margin: 18px 0 22px;
        }
        .d3-parties {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }
        .d3-right {
          text-align: right;
        }
        .d3-label {
          font-size: 10.5px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--accent);
          font-weight: 700;
          margin: 0 0 7px;
        }
        .d3-clientname {
          font-family: "Fraunces", Georgia, serif;
          font-size: 21px;
          font-weight: 600;
          font-style: normal;
          color: var(--name);
        }
        .d3-clientline {
          font-size: 13px;
          color: var(--muted);
        }

        .d3-tablewrap {
          overflow-x: auto;
          margin-top: 4px;
        }
        .d3-table {
          width: 100%;
          min-width: 640px;
          border-collapse: collapse;
          table-layout: fixed;
        }
        .d3-col-rbr {
          width: 30px;
        }
        .d3-col-dim {
          width: 130px;
        }
        .d3-col-num {
          width: 66px;
        }
        .d3-col-total {
          width: 78px;
        }
        .d3-col-actions {
          width: 82px;
        }
        .d3-table th {
          background: var(--panel);
          color: var(--accent);
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 700;
          text-align: left;
          padding: 7px 6px;
          white-space: nowrap;
          border: 1px solid var(--line);
          border-bottom: 2px solid var(--ink);
        }
        .d3-table th.num {
          text-align: right;
        }
        .d3-table td {
          border: 1px solid var(--line);
          padding: 5px 6px;
          vertical-align: top;
        }
        .d3-table td.num {
          text-align: right;
        }
        .d3-actionscell {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 4px !important;
          border: none !important;
        }
        .d3-rbr {
          text-align: center;
          color: var(--muted);
          font-size: 12px;
          vertical-align: middle !important;
        }
        .d3-name {
          font-size: 13.5px;
          font-weight: 500;
          color: var(--ink);
        }
        .d3-name::placeholder {
          color: var(--muted);
          font-weight: 400;
        }
        .d3-item-image-wrap {
          margin-top: 6px;
        }
        .d3-item-image {
          display: block;
          max-width: 100%;
          max-height: 34mm;
          object-fit: contain;
          object-position: left top;
        }
        .d3-item-image-remove {
          margin-top: 4px;
          color: #b3261e;
          font-size: 9px;
          font-weight: 700;
        }
        .d3-item-image-remove:hover {
          text-decoration: underline;
        }
        .d3-remove-inline {
          color: var(--muted);
          opacity: 0.6;
          font-size: 13px;
          line-height: 1;
        }
        .d3-remove-inline:hover {
          opacity: 1;
          color: #b3261e;
        }
        .d3-adddim {
          font-size: 10.5px;
          color: var(--muted);
          border-bottom: 1px dashed var(--line);
          padding-bottom: 1px;
        }
        .d3-adddim:hover {
          color: var(--accent);
          border-bottom-color: var(--accent);
        }
        .d3-surchargetag {
          font-size: 8.5px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #b3261e;
          font-weight: 700;
          margin-bottom: 2px;
        }
        .d3-name-surcharge {
          color: #b3261e !important;
        }
        .d3-row-surcharge td {
          background: #fdf3f2;
        }
        .d3-addrow-cell {
          border: 1px dashed var(--line) !important;
          border-top: none !important;
          padding: 6px !important;
          text-align: center;
        }
        .d3-addrow {
          width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          color: var(--muted);
          opacity: 0.75;
          transition: background-color 0.15s, color 0.15s, opacity 0.15s;
        }
        .d3-addrow:hover {
          opacity: 1;
          color: var(--accent);
          background: var(--panel);
        }
        .d3-total {
          font-weight: 600;
          color: var(--accent);
          font-variant-numeric: tabular-nums;
        }
        .d3-total-surcharge {
          color: #b3261e !important;
        }
        .d3-iconbtn {
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 5px;
          color: var(--muted);
          opacity: 0.75;
          transition: background-color 0.15s, color 0.15s, opacity 0.15s;
        }
        .d3-duplicate:hover {
          opacity: 1;
          color: var(--accent);
          background: var(--panel);
        }
        .d3-remove:hover {
          opacity: 1;
          color: #b3261e;
          background: #fdf3f2;
        }
        .d3-addsurcharge {
          color: #b3261e;
          opacity: 0.85;
        }
        .d3-addsurcharge:hover {
          opacity: 1;
          background: #fdf3f2;
        }

        .d3-totals {
          margin: 20px 0 0 auto;
          width: 280px;
        }
        .d3-subrow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: var(--muted);
          padding: 5px 0;
          font-variant-numeric: tabular-nums;
        }
        .d3-subrow b {
          color: var(--ink);
          font-weight: 600;
        }
        .d3-grand {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          background: var(--ink);
          color: #ffffff;
          padding: 12px 16px;
          font-family: "Fraunces", Georgia, serif;
        }
        .d3-grand span {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 700;
          color: #ffffff;
        }
        .d3-grand b {
          font-size: 22px;
          font-weight: 700;
          color: var(--accent-ink);
        }

        .d3-terms {
          margin-top: 34px;
          font-size: 13px;
          color: var(--muted);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .d3-terms span {
          color: var(--accent);
          text-transform: uppercase;
          font-size: 10.5px;
          letter-spacing: 0.1em;
          font-weight: 700;
        }

        .d3-sign {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-top: 56px;
        }
        .d3-signbox {
          display: flex;
          flex-direction: column;
        }
        .d3-signspace {
          height: 56px;
          border-bottom: 1px solid var(--line);
        }
        .d3-signlabel {
          font-size: 11.5px;
          color: var(--muted);
          padding-top: 8px;
        }

        .d3-foot {
          margin-top: 30px;
          padding-top: 14px;
          border-top: 1px solid var(--line);
          font-size: 9.5px;
          color: var(--muted);
          line-height: 1.9;
          text-align: center;
        }
        .d3-foot p {
          margin: 0;
        }

        .field {
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--line);
          padding: 1px 2px;
          outline: none;
          color: inherit;
          font: inherit;
        }
        .field:focus {
          border-bottom: 1px solid var(--accent);
        }
        .field::placeholder {
          color: var(--muted);
        }

        @media print {
          .no-print {
            display: none !important;
          }
          .field {
            border-bottom: none !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
          .offer-document {
            display: block;
            max-width: none !important;
          }
          .offer-page {
            width: 210mm;
            min-height: 297mm;
            box-shadow: none !important;
            break-after: page;
            page-break-after: always;
          }
          .offer-page:last-child {
            break-after: auto;
            page-break-after: auto;
          }
          .offer-form-page {
            height: auto;
            overflow: visible;
          }
          .sheet {
            box-shadow: none !important;
            max-width: none !important;
            width: 210mm;
          }
        }
      `}</style>
    </div>
  );
}
