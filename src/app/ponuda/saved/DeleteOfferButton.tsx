"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./saved.module.css";

export default function DeleteOfferButton({ id, offerNumber }: { id: string; offerNumber: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function deleteOffer() {
    if (!window.confirm(`Trajno obrisati ponudu ${offerNumber}? Ovu radnju nije moguće poništiti.`)) return;

    setDeleting(true);
    setError("");
    try {
      const response = await fetch(`/api/offers/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Ponuda se nije mogla obrisati.");
      }
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
        onClick={deleteOffer}
        disabled={deleting}
        aria-label={`Obriši ponudu ${offerNumber}`}
      >
        {deleting ? "Brišem…" : "Obriši"}
      </button>
      {error && <p className={styles.deleteError} role="alert">{error}</p>}
    </div>
  );
}
