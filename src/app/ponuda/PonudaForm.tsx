"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { site } from "@/data/site";

type Item = {
  id: string;
  desc: string;
  qty: number;
  price: number;
  discountPct: number;
  image: string | null;
};

const PRESET_IMAGES = [
  { key: "none", label: "Bez slike", src: null as string | null },
  { key: "vrata", label: "Vrata", src: "/images/pages/cat-vrata.jpg" },
  { key: "alubravarija", label: "Alubravarija", src: "/images/pages/cat-alubravarija.jpg" },
  { key: "podovi", label: "Podovi", src: "/images/pages/cat-podovi.jpg" },
  { key: "pu-paneli", label: "PU paneli", src: "/images/pages/cat-pu-paneli.jpg" },
];

const eur = new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR" });
function money(n: number) {
  return eur.format(Number.isFinite(n) ? n : 0);
}

function newItem(image: string | null = null): Item {
  return { id: crypto.randomUUID(), desc: "", qty: 1, price: 0, discountPct: 0, image };
}

export default function PonudaForm() {
  const [offerNumber, setOfferNumber] = useState("PONUDA-2026-001");
  const [offerDate, setOfferDate] = useState(() => new Date().toLocaleDateString("hr-HR"));
  const [validUntil, setValidUntil] = useState("");

  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");

  const [coContact, setCoContact] = useState(
    `${site.contacts[0].name} · ${site.contacts[0].phoneDisplay}`
  );
  const [coEmail, setCoEmail] = useState(site.contacts[0].email);

  const [items, setItems] = useState<Item[]>([newItem("/images/pages/cat-vrata.jpg")]);
  const [discountPct, setDiscountPct] = useState(0);
  const [vatRate, setVatRate] = useState(25);

  const [paymentTerms, setPaymentTerms] = useState(
    "40% po potvrdi narudžbe, ostatak po obavijesti o spremnosti robe"
  );
  const [deliveryTerms, setDeliveryTerms] = useState("30–45 radnih dana od potvrde narudžbe");

  function updateItem(id: string, patch: Partial<Item>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }
  function addItem() {
    setItems((prev) => [...prev, newItem()]);
  }
  function removeItem(id: string) {
    setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev));
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

  return (
    <div className="min-h-screen bg-co-warm-dark py-10 print:bg-white print:py-0">
      <div className="no-print max-w-[210mm] mx-auto px-4 mb-4 flex items-center justify-between">
        <a href="/" className="text-sm text-co-charcoal/50 hover:text-co-accent-dark transition-colors">
          &larr; Natrag na stranicu
        </a>
        <div className="flex items-center gap-3">
          <button
            onClick={addItem}
            className="text-sm font-medium px-4 py-2 rounded-md border border-co-charcoal/15 text-co-charcoal/80 hover:border-co-accent-dark hover:text-co-accent-dark transition-colors"
          >
            + Dodaj stavku
          </button>
          <button
            onClick={() => window.print()}
            className="text-sm font-semibold px-5 py-2 rounded-md bg-co-charcoal text-white hover:bg-co-accent-dark transition-colors"
          >
            Ispi&scaron;i / Spremi kao PDF
          </button>
        </div>
      </div>

      <div className="sheet max-w-[210mm] mx-auto shadow-2xl print:shadow-none">
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
        <div className="d3-items">
          {items.map((it, i) => (
            <div key={it.id} className="d3-row">
              <div className="d3-photo-wrap">
                <div className="d3-photo">
                  {it.image ? (
                    <img src={it.image} alt="" />
                  ) : (
                    <div className="d3-photo-empty" />
                  )}
                </div>
                <select
                  className="no-print d3-photo-select"
                  value={PRESET_IMAGES.find((p) => p.src === it.image)?.key ?? "none"}
                  onChange={(e) =>
                    updateItem(it.id, {
                      image: PRESET_IMAGES.find((p) => p.key === e.target.value)?.src ?? null,
                    })
                  }
                >
                  {PRESET_IMAGES.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d3-info">
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
                  placeholder="Opis proizvoda / usluge"
                  rows={1}
                  className="field d3-name w-full resize-none block overflow-hidden"
                />
                <div className="d3-qty">
                  <div>
                    <span>Kol.</span>
                    <input
                      type="number"
                      value={it.qty}
                      onChange={(e) => updateItem(it.id, { qty: parseFloat(e.target.value) || 0 })}
                      className="field text-right"
                    />
                  </div>
                  <div>
                    <span>Cijena &euro;</span>
                    <input
                      type="number"
                      value={it.price}
                      onChange={(e) => updateItem(it.id, { price: parseFloat(e.target.value) || 0 })}
                      className="field text-right"
                    />
                  </div>
                  <div>
                    <span>Rabat %</span>
                    <input
                      type="number"
                      value={it.discountPct}
                      onChange={(e) =>
                        updateItem(it.id, { discountPct: parseFloat(e.target.value) || 0 })
                      }
                      className="field text-right"
                    />
                  </div>
                </div>
              </div>

              <div className="d3-rowend">
                <div className="d3-total">{money(lineTotals[i])}</div>
                <button
                  onClick={() => removeItem(it.id)}
                  className="no-print d3-remove"
                  aria-label="Ukloni stavku"
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="d3-totals">
          <div className="d3-subrow">
            <span>Iznos bez PDV-a</span>
            <b>{money(subtotal)}</b>
          </div>
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
            </span>
            <b>&minus;{money(discountAmount)}</b>
          </div>
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
      </div>

      <style jsx global>{`
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

        .d3-items {
          display: flex;
          flex-direction: column;
        }
        .d3-row {
          display: grid;
          grid-template-columns: 96px 1fr 110px;
          gap: 16px;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid var(--line);
        }
        .d3-photo-wrap {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .d3-photo {
          width: 96px;
          height: 72px;
          overflow: hidden;
          background: var(--panel);
        }
        .d3-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .d3-photo-empty {
          width: 100%;
          height: 100%;
        }
        .d3-photo-select {
          font-size: 9px;
          background: var(--panel);
          color: var(--muted);
          border: 1px solid var(--line);
          border-radius: 4px;
          padding: 2px 4px;
        }
        .d3-name {
          font-family: "Fraunces", Georgia, serif;
          font-size: 17px;
          font-weight: 600;
          font-style: normal;
          color: var(--name);
        }
        .d3-name::placeholder {
          color: var(--muted);
          font-weight: 500;
        }
        .d3-qty {
          display: grid;
          grid-template-columns: repeat(3, 72px);
          gap: 14px;
          margin-top: 10px;
        }
        .d3-qty div {
          display: flex;
          flex-direction: column;
        }
        .d3-qty span {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted);
          margin-bottom: 2px;
        }
        .d3-qty .field {
          font-size: 13px;
          font-variant-numeric: tabular-nums;
        }
        .d3-rowend {
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: flex-end;
        }
        .d3-total {
          text-align: right;
          font-family: "Fraunces", Georgia, serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--accent);
          font-variant-numeric: tabular-nums;
        }
        .d3-remove {
          color: var(--muted);
          opacity: 0.6;
          font-size: 14px;
          line-height: 1;
          padding: 2px 4px;
        }
        .d3-remove:hover {
          opacity: 1;
          color: #e08a2c;
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
