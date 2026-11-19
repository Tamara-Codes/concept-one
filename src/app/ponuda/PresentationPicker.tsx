"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ArchivedPresentations } from "@/lib/technical-presentations";
import styles from "./TechnicalPresentations.module.css";

export default function PresentationPicker({ archive, value, onChange, disabled }: {
  archive: ArchivedPresentations[];
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const labelId = useId();
  const [offerId, index] = value.split(":");
  const selectedOffer = archive.find(({ id }) => id === offerId);
  const selectedPage = selectedOffer?.presentations[Number(index)];
  const query = search.trim().toLocaleLowerCase("hr");
  const groups = archive.map((offer) => ({
    ...offer,
    pages: offer.presentations.map((page, pageIndex) => ({ ...page, pageIndex }))
      .filter((page) => `${offer.offerNumber} ${offer.clientName} ${page.title}`.toLocaleLowerCase("hr").includes(query)),
  })).filter((offer) => offer.pages.length);

  useEffect(() => {
    if (!open) return;
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  function choose(selection: string) {
    onChange(selection);
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <div className={styles.picker} ref={root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
      }}>
      <span className={styles.pickerLabel} id={labelId}>Odaberite tehničku prezentaciju</span>
      <button type="button" className={styles.pickerTrigger} ref={trigger}
        aria-labelledby={labelId} aria-expanded={open && !disabled} aria-controls={panelId} disabled={disabled}
        onClick={() => { setSearch(""); setOpen(!open); }}>
        <span className={styles.pickerSelection}>
          <span>{selectedPage?.title.trim() || "Odaberite stranicu…"}</span>
          {selectedOffer && <small>{selectedOffer.offerNumber}{selectedOffer.clientName && ` · ${selectedOffer.clientName}`}</small>}
        </span>
        <span className={styles.pickerChevron} aria-hidden="true">⌄</span>
      </button>
      {open && !disabled && (
        <div className={styles.pickerPanel} id={panelId}>
          <div className={styles.pickerSearch}>
            <input className={styles.input} type="search" autoFocus
              aria-label="Pretraži ponude i prezentacije" placeholder="Pretraži broj ponude, klijenta ili naslov…"
              value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <div className={styles.pickerResults}>
            {!groups.length && <p className={styles.pickerEmpty} role="status">Nema rezultata za ovu pretragu.</p>}
            {groups.map((offer) => (
              <section className={styles.pickerGroup} key={offer.id} aria-label={offer.offerNumber}>
                <div className={styles.pickerGroupHeading}>
                  <strong>{offer.offerNumber}</strong>
                  {offer.clientName && <span>{offer.clientName}</span>}
                </div>
                {offer.pages.map((page) => {
                  const selection = `${offer.id}:${page.pageIndex}`;
                  return (
                    <button type="button" className={styles.pickerOption} key={selection}
                      aria-pressed={value === selection} onClick={() => choose(selection)}>
                      <span>{page.title.trim() || "Tehnička prezentacija"}</span>
                      {value === selection && <span className={styles.pickerCheck} aria-hidden="true">✓</span>}
                    </button>
                  );
                })}
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
