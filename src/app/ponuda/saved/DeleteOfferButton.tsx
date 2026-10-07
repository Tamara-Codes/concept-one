"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./saved.module.css";

export default function DeleteOfferButton({ id, offerNumber }: { id: string; offerNumber: string }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  function openConfirmation() {
    setError("");
    dialogRef.current?.showModal();
  }

  async function deleteOffer() {
    setDeleting(true);
    setError("");
    try {
      const response = await fetch(`/api/offers/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Ponuda se nije mogla obrisati.");
      }
      dialogRef.current?.close();
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Ponuda se nije mogla obrisati.");
      setDeleting(false);
    }
  }

  return (
    <div className={styles.deleteArea}>
      <button
        type="button"
        className={styles.deleteButton}
        onClick={openConfirmation}
        disabled={deleting}
        aria-label={`Obriši ponudu ${offerNumber}`}
      >
        {deleting ? "Brišem…" : "Obriši"}
      </button>
      <dialog
        ref={dialogRef}
        className={styles.confirmDialog}
        aria-labelledby={`delete-offer-title-${id}`}
        aria-describedby={`delete-offer-description-${id}`}
        onCancel={(event) => { if (deleting) event.preventDefault(); }}
        onClick={(event) => {
          if (!deleting && event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        <div className={styles.confirmContent}>
          <p className={styles.confirmEyebrow}>BRISANJE PONUDE</p>
          <h2 id={`delete-offer-title-${id}`} className={styles.confirmTitle}>Obrisati ovu ponudu?</h2>
          <p className={styles.confirmNumber}>{offerNumber}</p>
          <p id={`delete-offer-description-${id}`} className={styles.confirmDescription}>
            Ponuda i njezine stavke bit će trajno obrisane. Ovu radnju nije moguće poništiti.
          </p>
          {error && <p className={styles.confirmError} role="alert">{error}</p>}
          <div className={styles.confirmActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => dialogRef.current?.close()}
              disabled={deleting}
              autoFocus
            >
              Odustani
            </button>
            <button
              type="button"
              className={styles.confirmDeleteButton}
              onClick={deleteOffer}
              disabled={deleting}
            >
              {deleting ? "Brišem…" : "Trajno obriši"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
