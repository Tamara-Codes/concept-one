import { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "O nama | Concept One",
  description:
    "Concept One - Vaš partner za aluminijsku i PVC bravariju, unutarnja vrata, unutarnje i vanjske podove, zidne obloge i ogradne sisteme.",
  alternates: { canonical: "/o-nama" },
};

const googleMapsUrl =
  "https://www.google.com/maps/search/?api=1&query=%C4%86ikovi%C4%87i%20128%2C%2051215%20Kastav";
const googleMapsEmbedUrl =
  "https://www.google.com/maps?q=%C4%86ikovi%C4%87i+128%2C+51215+Kastav&z=15&output=embed";

const advantages = [
  {
    title: "Sve na jednom mjestu",
    text: "Aluminijska i PVC bravarija, unutarnja vrata, unutarnji i vanjski podovi, vanjske i unutarnje zidne obloge te ogradni sistemi.",
  },
  { title: "Kvaliteta", text: "Surađujemo isključivo s provjerenim proizvođačima." },
  { title: "Savjetovanje", text: "Stručni tim za pomoć pri odabiru rješenja za svaki projekt." },
  { title: "Montaža", text: "Vlastiti montažni timovi i garancija na ugradnju." },
];

const brands = [
  { name: "Schüco", image: "/images/brands/schueco.png" },
  { name: "Alumil", image: "/images/brands/alumil.png" },
  { name: "FEAL", image: "/images/brands/feal.png" },
  { name: "Rehau", image: "/images/brands/rehau.png" },
  { name: "Kömmerling", image: "/images/offer/brand-koemmerling.png" },
  { name: "Medle", image: "/images/brands/medle.png" },
  { name: "Hörmann", image: "/images/brands/hormann.png" },
  { name: "Déco", image: "/images/offer/brand-deco.png" },
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
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-co-accent-dark mb-4">
                Naša priča
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-co-charcoal leading-tight mb-8">
                Jedan partner
                <br />
                <span className="italic font-medium">za cijeli objekt</span>
              </h2>
              <div className="space-y-5 font-sans text-base text-co-charcoal/60 leading-relaxed">
                <p>
                  Concept One nudi aluminijsku i PVC bravariju, unutarnja vrata,
                  unutarnje i vanjske podove, vanjske i unutarnje zidne obloge te
                  ogradne sisteme — sve što je potrebno za završetak stambenog
                  ili poslovnog objekta, od jednog dobavljača.
                </p>
                <p>
                  Vjerujemo da svaki prostor zaslužuje materijale koji spajaju
                  estetiku, funkcionalnost i trajnost.
                </p>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden bg-co-warm">
              <Image
                src="/images/pages/about.jpg"
                alt="Concept One"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-co-warm py-14 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-co-accent-dark mb-4">
              Zašto Concept One
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-co-charcoal">
              Naše <span className="italic font-medium">prednosti</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((item, i) => (
              <div key={i} className="bg-white p-8 border border-black/5">
                <p className="font-serif text-5xl font-light text-co-accent-dark/25 mb-4">0{i + 1}</p>
                <h3 className="font-serif text-xl font-medium text-co-charcoal mb-3">{item.title}</h3>
                <p className="font-sans text-sm text-co-charcoal/50 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands from the offer */}
      <section className="py-14 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-co-charcoal">
              Brendovi u <span className="italic font-medium">našoj ponudi</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Brendovi u našoj ponudi">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="flex items-center justify-center border border-black/5 bg-white p-6"
                style={{ minHeight: 132 }}
              >
                <Image
                  src={brand.image}
                  alt={brand.name}
                  width={260}
                  height={110}
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  style={{ width: "100%", height: 92, objectFit: "contain" }}
                />
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
                  <p className="font-sans text-xs tracking-widest uppercase text-white/40 mb-2">Kontakt</p>
                  <div className="space-y-3 font-sans text-base text-white/70">
                    {site.contacts.map((contact) => (
                      <div key={contact.email}>
                        <p className="text-white/40">{contact.name} — {contact.specialty}</p>
                        <a href={`tel:${contact.phone}`} className="block hover:text-co-accent transition-colors">{contact.phoneDisplay}</a>
                        <a href={`mailto:${contact.email}`} className="block hover:text-co-accent transition-colors">{contact.email}</a>
                      </div>
                    ))}
                  </div>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-co-accent hover:text-white transition-colors"
                >
                  Otvori u Google kartama
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <div className="relative aspect-square lg:aspect-auto min-h-[400px] overflow-hidden bg-white/5 border border-white/10">
              <iframe
                src={googleMapsEmbedUrl}
                title={`Karta lokacije: ${site.address}`}
                className="absolute inset-0 h-full w-full border-0"
                loading="eager"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
