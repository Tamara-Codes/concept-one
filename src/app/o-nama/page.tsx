import { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "O nama | Concept One",
  description: "Concept One - Vaš partner za aluminijsku bravariju, vrata, podove i PU panele.",
};

const advantages = [
  { title: "Sve na jednom mjestu", text: "Alubravarija, vrata, podovi i PU paneli od jednog dobavljača." },
  { title: "Kvaliteta", text: "Surađujemo isključivo s provjerenim proizvođačima." },
  { title: "Savjetovanje", text: "Stručni tim za pomoć pri odabiru rješenja za svaki projekt." },
  { title: "Montaža", text: "Vlastiti montažni timovi i garancija na ugradnju." },
];

export default function ONamaPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative h-[40vh] sm:h-[50vh] min-h-[320px] sm:min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/pages/onama-hero.jpg"
            alt="Concept One"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-12 lg:pb-16 w-full">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-white/50 mb-4">
            {site.company}
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[0.95]">
            O nama
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-14 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-24 items-start">
            <div>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-co-accent mb-4">
                Naša priča
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-co-charcoal leading-tight mb-8">
                Jedan partner
                <br />
                <span className="italic font-medium">za cijeli objekt</span>
              </h2>
              <div className="space-y-5 font-sans text-base text-co-charcoal/60 leading-relaxed">
                <p>
                  Concept One nudi aluminijsku bravariju, vrata, podove i PU
                  panele — sve što je potrebno za završetak stambenog ili
                  poslovnog objekta, od jednog dobavljača.
                </p>
                <p>
                  Ovaj tekst je privremeni predložak. Ovdje dolazi priča o
                  tvrtki, iskustvu tima i načinu rada.
                </p>
                <p>
                  Vjerujemo da svaki prostor zaslužuje materijale koji spajaju
                  estetiku, funkcionalnost i trajnost.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="relative aspect-[4/3] overflow-hidden bg-co-warm">
                <Image
                  src="/images/pages/about.jpg"
                  alt="Concept One"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
                {[
                  ["4", "Programa"],
                  ["1", "Partner"],
                  ["100%", "Po mjeri"],
                ].map(([n, label]) => (
                  <div key={label}>
                    <p className="font-serif text-3xl sm:text-4xl font-light text-co-accent">{n}</p>
                    <p className="font-sans text-[10px] sm:text-xs tracking-widest uppercase text-co-charcoal/40 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-co-warm py-14 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-co-accent mb-4">
              Zašto Concept One
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-co-charcoal">
              Naše <span className="italic font-medium">prednosti</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((item, i) => (
              <div key={i} className="bg-white p-8 border border-black/5">
                <p className="font-serif text-5xl font-light text-co-accent/20 mb-4">0{i + 1}</p>
                <h3 className="font-serif text-xl font-medium text-co-charcoal mb-3">{item.title}</h3>
                <p className="font-sans text-sm text-co-charcoal/50 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-14 sm:py-20 lg:py-28 bg-co-charcoal">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-co-accent mb-4">
                Kontakt
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white leading-tight mb-8">
                Posjetite nas
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-white/40 mb-2">Adresa</p>
                  <p className="font-sans text-base text-white/70">
                    {site.company}
                    <br />
                    {site.street}
                    <br />
                    {site.city}
                  </p>
                </div>
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-white/40 mb-2">Podaci o tvrtki</p>
                  <p className="font-sans text-base text-white/70">
                    OIB: {site.oib}
                    <br />
                    MB: {site.mb}
                    <br />
                    Član uprave: {site.director}
                  </p>
                </div>
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-white/40 mb-2">Telefon</p>
                  <p className="font-sans text-base text-white/70">
                    <a href={`tel:${site.phone}`} className="hover:text-co-accent transition-colors">{site.phoneDisplay}</a>
                  </p>
                </div>
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-white/40 mb-2">Email</p>
                  <p className="font-sans text-base text-white/70">
                    <a href={`mailto:${site.email}`} className="hover:text-co-accent transition-colors">{site.email}</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Map placeholder — replace with real Google Maps embed */}
            <div className="relative aspect-square lg:aspect-auto min-h-[400px] flex items-center justify-center bg-white/5 border border-white/10">
              <p className="font-sans text-sm tracking-widest uppercase text-white/30">Karta — uskoro</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
