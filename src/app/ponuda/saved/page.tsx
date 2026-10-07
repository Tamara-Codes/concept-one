import { desc } from "drizzle-orm";
import { connection } from "next/server";
import { getDb } from "@/lib/db";
import { offers } from "@/lib/db/schema";
import { getAllowedOfferUser } from "@/lib/offer-access";
import Logo from "@/components/Logo";
import DeleteOfferButton from "./DeleteOfferButton";
import styles from "./saved.module.css";

export const metadata = { title: "Spremljene ponude | Concept One" };

function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  return day && month && year ? `${day}.${month}.${year}.` : value;
}

export default async function SavedOffersPage() {
  await connection();
  const allowedUser = await getAllowedOfferUser();
  const savedOffers = allowedUser
    ? await getDb()
        .select({
          id: offers.id,
          offerNumber: offers.offerNumber,
          offerDate: offers.offerDate,
          clientName: offers.clientName,
          status: offers.status,
          updatedAt: offers.updatedAt,
        })
        .from(offers)
        .orderBy(desc(offers.updatedAt))
    : [];

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <Logo />
          <a href="/ponuda" className={styles.backLink}>← Nazad</a>
        </header>

        <section className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>ARHIVA PONUDA</p>
            <h1>Spremljene ponude</h1>
            <p className={styles.subtitle}>Pregledajte i nastavite rad na spremljenim ponudama.</p>
          </div>
          <div className={styles.countBox}>
            <strong>{savedOffers.length}</strong>
            <span>{savedOffers.length === 1 ? "spremljena ponuda" : "spremljene ponude"}</span>
          </div>
        </section>

        {savedOffers.length === 0 ? (
          <div className={styles.empty}>Još nema spremljenih ponuda.</div>
        ) : (
          <section className={styles.offerList} aria-label="Spremljene ponude">
            {savedOffers.map((offer) => (
              <article key={offer.id} className={styles.offerRow}>
                <span className={styles.goldLine} aria-hidden="true" />
                <a href={`/ponuda/new/edit?offerId=${offer.id}`} className={styles.offerCard}>
                  <div className={styles.offerIdentity}>
                    <span className={styles.status}><i />{offer.status === "draft" ? "Skica" : offer.status}</span>
                    <h2>{offer.offerNumber}</h2>
                    <p>{offer.clientName || "Klijent nije upisan"}</p>
                  </div>
                  <div className={styles.offerMeta}>
                    <span>Datum ponude</span>
                    <strong>{formatDate(offer.offerDate)}</strong>
                    <small>Ažurirano {offer.updatedAt.toLocaleDateString("hr-HR")}</small>
                  </div>
                  <div className={styles.openAction}>
                    <span>Otvori</span>
                    <b>→</b>
                  </div>
                </a>
                <DeleteOfferButton id={offer.id} offerNumber={offer.offerNumber} />
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
