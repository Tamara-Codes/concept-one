"use client";

import { useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { offerImageUrl } from "@/lib/offer-image-client";
import type { ArchivedPresentations, TechnicalPresentation } from "@/lib/technical-presentations";
import styles from "./TechnicalPresentations.module.css";

export type PresentationDraft = TechnicalPresentation & {
  id: string;
  imageData: string;
};

const imageTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
function fitDescription(field: HTMLTextAreaElement | null) {
  if (!field) return;
  field.style.height = "auto";
  field.style.height = `${field.scrollHeight}px`;
}

function readImage(file: Blob): Promise<string> {
  if (!imageTypes.includes(file.type) || !file.size || file.size > 4 * 1024 * 1024) {
    throw new Error("Odaberite PNG, JPEG, WebP ili GIF sliku do 4 MB.");
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Slika se nije mogla učitati."));
    reader.readAsDataURL(file);
  });
}

export default function TechnicalPresentations({
  pages, setPages, busy, setBusy, saving, heading, footer,
}: {
  pages: PresentationDraft[];
  setPages: Dispatch<SetStateAction<PresentationDraft[]>>;
  busy: boolean;
  setBusy: (busy: boolean) => void;
  saving: boolean;
  heading: ReactNode;
  footer: ReactNode;
}) {
  const [copyOpen, setCopyOpen] = useState(false);
  const [loadingArchive, setLoadingArchive] = useState(false);
  const [archive, setArchive] = useState<ArchivedPresentations[]>([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [copyError, setCopyError] = useState("");
  const [imageError, setImageError] = useState<{ id: string; message: string } | null>(null);
  const disabled = busy || saving;

  function appendPage(page: TechnicalPresentation, imageData = "") {
    const id = crypto.randomUUID();
    setPages((current) => [...current, { ...page, id, imageData }]);
  }

  function editPage(id: string, patch: Partial<PresentationDraft>) {
    setPages((current) => current.map((page) => page.id === id ? { ...page, ...patch } : page));
  }

  async function toggleCopy() {
    setCopyOpen(!copyOpen);
    if (copyOpen) return;
    setLoadingArchive(true);
    setSelectedPage("");
    setCopyError("");
    try {
      const response = await fetch("/api/offers/presentations");
      if (!response.ok) throw new Error();
      setArchive(await response.json());
    } catch {
      setArchive([]);
      setCopyError("Arhiva tehničkih prezentacija nije dostupna.");
    } finally {
      setLoadingArchive(false);
    }
  }

  async function copyPage() {
    const [offerId, index] = selectedPage.split(":");
    const source = archive.find(({ id }) => id === offerId)?.presentations[Number(index)];
    if (!source) return;
    setBusy(true);
    setCopyError("");
    try {
      let imageData = "";
      if (source.imageKey) {
        const image = await fetch(offerImageUrl(source.imageKey));
        if (!image.ok) throw new Error("Slika iz odabrane ponude nije dostupna.");
        imageData = await readImage(await image.blob());
      }
      appendPage({ ...source, imageKey: null }, imageData);
      setCopyOpen(false);
    } catch (error) {
      setCopyError(error instanceof Error ? error.message : "Prezentacija se nije mogla kopirati.");
    } finally {
      setBusy(false);
    }
  }

  async function chooseImage(id: string, file: File) {
    setBusy(true);
    setImageError(null);
    try {
      editPage(id, { imageKey: null, imageData: await readImage(file) });
    } catch (error) {
      setImageError({ id, message: error instanceof Error ? error.message : "Slika se nije mogla učitati." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className={`${styles.toolbar} no-print`} id="tehnicke-prezentacije">
        <div className={styles.actions}>
          <button type="button" className={styles.primaryButton} disabled={disabled}
            onClick={() => appendPage({ title: "", description: "", imageKey: null })}>
            Dodaj tehničku prezentaciju
          </button>
          <button type="button" className={styles.button} disabled={disabled || loadingArchive}
            aria-expanded={copyOpen} onClick={toggleCopy}>
            Kopiraj iz ponude
          </button>
        </div>
        {copyOpen && (
          <div className={styles.archive}>
            {loadingArchive && <p role="status" className={styles.message}>Učitavam arhivu…</p>}
            {!loadingArchive && !archive.length && !copyError && (
              <p className={styles.message}>U arhivi još nema spremljenih tehničkih prezentacija.</p>
            )}
            {!loadingArchive && archive.length > 0 && (
              <>
                <label className={styles.archiveField}>
                  Odaberite tehničku prezentaciju
                  <select className={styles.input}
                    value={selectedPage} disabled={disabled} onChange={(event) => setSelectedPage(event.target.value)}>
                    <option value="">Odaberite stranicu…</option>
                    {archive.map((offer) => (
                      <optgroup key={offer.id} label={[offer.offerNumber, offer.clientName].filter(Boolean).join(" · ")}>
                        {offer.presentations.map((page, index) => (
                          <option key={index} value={`${offer.id}:${index}`}>
                            {index + 1}. {page.title.trim() || "Tehnička prezentacija"}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </label>
                <button type="button" className={styles.primaryButton} disabled={disabled || !selectedPage} onClick={copyPage}>
                  {busy ? "Učitavam…" : "Kopiraj stranicu"}
                </button>
              </>
            )}
            {copyError && <p role="alert" className={styles.error}>{copyError}</p>}
          </div>
        )}
      </div>

      {pages.map((page) => {
        const src = page.imageData || (page.imageKey ? offerImageUrl(page.imageKey) : "");
        return (
          <section className="offer-page offer-technical-page" key={page.id}>
            {heading}
            <div className="offer-technical-copy">
              <fieldset disabled={disabled} className={`${styles.editor} no-print`}>
                <label className={styles.field}>
                  Naslov
                  <input className={styles.input} placeholder="Npr. Aluminijska klizna stijena"
                    value={page.title} onChange={(event) => editPage(page.id, { title: event.target.value })} />
                </label>
                <label className={styles.field}>
                  Opis
                  <textarea ref={fitDescription} rows={5} className={`${styles.input} ${styles.description}`}
                    placeholder="Upišite tehničke podatke i opis proizvoda…"
                    value={page.description} onChange={(event) => {
                      fitDescription(event.currentTarget);
                      editPage(page.id, { description: event.currentTarget.value });
                    }} />
                </label>
                <label className={styles.upload}>
                  <span className={styles.uploadTitle}>{src ? "Zamijeni sliku" : "+ Dodaj sliku"}</span>
                  <span className={styles.uploadHint}>PNG, JPEG, WebP ili GIF · do 4 MB</span>
                  <input type="file" accept={imageTypes.join(",")} className={styles.fileInput}
                    aria-label={src ? "Zamijeni sliku" : "Dodaj sliku"}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      if (file) void chooseImage(page.id, file);
                    }} />
                </label>
                {imageError?.id === page.id && <p role="alert" className={styles.error}>{imageError.message}</p>}
                <div className={styles.editorActions}>
                  {src && <button type="button" className={styles.textButton}
                    onClick={() => editPage(page.id, { imageKey: null, imageData: "" })}>Ukloni sliku</button>}
                  <button type="button" className={styles.removeButton}
                    onClick={() => setPages((current) => current.filter(({ id }) => id !== page.id))}>
                    Ukloni stranicu
                  </button>
                </div>
              </fieldset>
              <div className="offer-technical-print-copy">
                {page.title.trim() && <h3>{page.title}</h3>}
                {page.description.trim() && <p>{page.description}</p>}
              </div>
            </div>
            {src && (
              <div className="offer-technical-image">
                {/* Draft images are local data URLs. Saved images require the user's session. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={page.title.trim() || "Slika tehničke prezentacije"} />
              </div>
            )}
            {footer}
          </section>
        );
      })}
    </>
  );
}
