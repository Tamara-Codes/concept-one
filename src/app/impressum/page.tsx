import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Impressum | Concept One",
  description: "Podaci o tvrtki INNOVA PROJEKT d.o.o.",
  robots: { index: false },
};

const rows: [string, string][] = [
  ["Tvrtka", site.legalName],
  ["Skraćena tvrtka", site.company],
  ["Sjedište", site.address],
  ["OIB", site.oib],
  ["Registarski sud", site.court],
  ["MBS", site.mbs],
  ["Temeljni kapital", site.capital],
  ["Član uprave", site.director],
  ["Banka", site.bank],
  ["IBAN", site.iban],
  ["E-mail", site.email],
  ["Telefon", site.phoneDisplay],
];

export default function ImpressumPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-co-accent mb-4">
            Podaci o tvrtki
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-co-charcoal mb-10">
            Impressum
          </h1>
          <dl className="divide-y divide-black/5 border-y border-black/5">
            {rows.map(([label, value]) => (
              <div key={label} className="grid sm:grid-cols-3 gap-1 sm:gap-6 py-3">
                <dt className="font-sans text-xs tracking-widest uppercase text-co-charcoal/40 sm:pt-0.5">{label}</dt>
                <dd className="sm:col-span-2 font-sans text-base text-co-charcoal/80">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <Footer />
    </main>
  );
}
