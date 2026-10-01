"use client";

import { useEffect, useState } from "react";

type TechnicalSheet = { id: string; slug: string; name: string; version: number };

export default function NewOfferPage() {
  const [technicalLeaves, setTechnicalLeaves] = useState<TechnicalSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/technical-sheets")
      .then((response) => response.json())
      .then((rows: TechnicalSheet[]) => setTechnicalLeaves(rows))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const kicker = document.querySelector<HTMLElement>(".offer-wizard-kicker");
    if (kicker) kicker.textContent = "NOVA PONUDA";
  }, []);

  function toggle(leaf: string) {
    setSelected((current) => current.includes(leaf) ? current.filter((item) => item !== leaf) : [...current, leaf]);
  }

  const selectedQuery = selected.length ? `?technicalSheets=${encodeURIComponent(selected.join(","))}` : "";
  return <main className="offer-wizard"><style>{`.offer-wizard{min-height:100vh;background:#f3f4f2;padding:32px 24px;color:#1e2326}.offer-wizard-inner{max-width:720px;margin:0 auto}.offer-wizard-back{color:#667078;text-decoration:none;font-size:14px}.offer-wizard-kicker{margin-top:64px;color:#8a6a3b;font-size:12px;font-weight:700;letter-spacing:.24em}.offer-wizard h1{margin:16px 0 0;font-size:36px;line-height:1.1}.offer-wizard-intro{margin:12px 0 0;color:#667078;font-size:14px;line-height:1.6}.offer-wizard-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:32px}.offer-wizard-option{min-height:104px;border:1px solid rgba(30,35,38,.14);border-radius:16px;background:#fff;padding:22px;text-align:left;cursor:pointer;transition:.2s}.offer-wizard-option:hover{border-color:#b5945f;transform:translateY(-2px)}.offer-wizard-option.selected{border:2px solid #b5945f;background:#fffaf1;box-shadow:0 8px 24px rgba(30,35,38,.08)}.offer-wizard-option-title{display:flex;align-items:center;justify-content:space-between;font-size:18px;font-weight:700}.offer-wizard-check{color:#8a6a3b;font-size:20px}.offer-wizard-footer{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:24px;padding:18px 20px;border:1px solid rgba(30,35,38,.12);border-radius:16px;background:#fff}.offer-wizard-count{color:#667078;font-size:14px}.offer-wizard-next{border:0;border-radius:10px;background:#1e2326;color:#fff;padding:12px 18px;font-weight:700;text-decoration:none}@media(max-width:600px){.offer-wizard-options{grid-template-columns:1fr}.offer-wizard h1{font-size:30px}.offer-wizard-footer{align-items:stretch;flex-direction:column}.offer-wizard-next{text-align:center}}`}</style><div className="offer-wizard-inner"><a href="/ponuda" className="offer-wizard-back">← Natrag na ponude</a><p className="offer-wizard-kicker">NOVA PONUDA · 1. KORAK</p><h1>Koje tehničke listove dodati?</h1><p className="offer-wizard-intro">Tehnički listovi nisu obavezni. Odaberite ih ili nastavite bez njih. Bit će dodani na kraj ponude redoslijedom kojim ih označite.</p><div className="offer-wizard-options">{loading ? <p>Učitavam tehničke listove…</p> : technicalLeaves.map((leaf) => <button key={leaf.id} type="button" onClick={() => toggle(leaf.name)} className={`offer-wizard-option ${selected.includes(leaf.name) ? "selected" : ""}`}><span className="offer-wizard-option-title"><span>{leaf.name}</span><span className="offer-wizard-check">{selected.includes(leaf.name) ? "✓" : "＋"}</span></span></button>)}</div><div className="offer-wizard-footer"><span className="offer-wizard-count">Odabrano: <strong>{selected.length || "ništa"}</strong></span><a href={`/ponuda/new/edit${selectedQuery}`} className="offer-wizard-next">Nastavi na ponudu →</a></div></div></main>;
}
