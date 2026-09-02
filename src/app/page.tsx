import Image from "next/image";
import Link from "next/link";
import { categories, site } from "@/data/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
  </svg>
);

const highlights = [
  { badge: "Izmjera", title: "Besplatna izmjera", description: "Dolazimo na objekt, mjerimo i savjetujemo bez naknade." },
  { badge: "Montaža", title: "Stručna ugradnja", description: "Vlastiti montažni timovi za sve naše proizvode." },
  { badge: "Ponuda", title: "Ponuda u 48 sati", description: "Brza i transparentna ponuda prilagođena vašem projektu." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative h-screen min-h-[550px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/pages/hero.jpg"
            alt="Concept One"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-20 lg:pb-28 w-full">
          <p className="animate-fade-up font-sans text-xs md:text-sm tracking-[0.3em] uppercase text-white/60 mb-4">
            {site.company}
          </p>
          <h1 className="animate-fade-up delay-100 font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light text-white leading-[0.95] mb-6">
            Concept
            <br />
            <span className="text-co-red font-medium italic">One</span>
          </h1>
          <p className="animate-fade-up delay-200 font-sans text-base md:text-lg text-white/70 max-w-xl leading-relaxed mb-10">
            Aluminijska bravarija, vrata, podovi i PU paneli. Sve za vaš
            objekt na jednom mjestu — od izmjere do montaže.
          </p>
          <div className="animate-fade-up delay-300 flex flex-wrap gap-4">
            <Link
              href="/alubravarija"
              className="inline-flex items-center gap-3 bg-co-red hover:bg-co-red-dark text-white px-6 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm font-medium tracking-widest uppercase transition-all duration-300"
            >
              Pogledajte ponudu
              <ArrowIcon />
            </Link>
            <Link
              href="/o-nama"
              className="inline-flex items-center gap-3 border border-white/30 hover:border-white/60 text-white px-6 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm font-medium tracking-widest uppercase transition-all duration-300"
            >
              O nama
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in delay-700">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/40" />
        </div>
      </section>

      {/* ═══════════════ HIGHLIGHT STRIP ═══════════════ */}
      <section className="relative bg-co-charcoal overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 10px, white 10px, white 11px)" }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-14">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-12">
            {highlights.map((item, i) => (
              <div key={i} className="group flex gap-4 items-start">
                <span className="flex-shrink-0 font-sans text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-white bg-co-red px-2.5 py-1.5 sm:px-3 sm:py-2 mt-1">
                  {item.badge}
                </span>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl lg:text-2xl text-white font-medium leading-tight mb-1.5">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm text-white/50 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-0.5 bg-gradient-to-r from-transparent via-co-red/50 to-transparent" />
      </section>

      {/* ═══════════════ CATEGORIES ═══════════════ */}
      <section className="py-14 sm:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-10 sm:mb-16 lg:mb-20">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-co-red mb-3">
              Naš asortiman
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-co-charcoal leading-tight">
              Sve za vaš
              <br />
              <span className="italic font-medium">objekt</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="group relative aspect-[4/3] overflow-hidden bg-co-warm"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-co-red/0 group-hover:bg-co-red/10 transition-colors duration-500" />

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-10">
                  <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">
                    {cat.short}
                  </p>
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-white mb-2">
                    {cat.name}
                  </h3>
                  <p className="font-sans text-sm text-white/60 max-w-sm leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-white/0 group-hover:text-white/80 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <span className="font-sans text-xs tracking-widest uppercase">Pogledaj</span>
                    <ArrowIcon />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ABOUT STRIP ═══════════════ */}
      <section className="bg-co-charcoal py-14 sm:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-co-red mb-4">
                O nama
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white leading-tight mb-6">
                Jedan partner
                <br />
                <span className="italic font-medium">za cijeli objekt</span>
              </h2>
              <p className="font-sans text-base text-white/50 leading-relaxed mb-8">
                Concept One objedinjuje aluminijsku bravariju, vrata, podove i
                PU panele pod jednim krovom. Od izmjere i savjetovanja do
                isporuke i montaže — jedan tim, jedna odgovornost.
              </p>
              <div className="grid grid-cols-3 gap-4 sm:gap-8">
                {[
                  ["4", "Programa"],
                  ["1", "Partner"],
                  ["100%", "Po mjeri"],
                ].map(([n, label]) => (
                  <div key={label}>
                    <p className="font-serif text-3xl sm:text-4xl font-light text-co-red">{n}</p>
                    <p className="font-sans text-[10px] sm:text-xs tracking-widest uppercase text-white/40 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/pages/about.jpg"
                alt="Concept One"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 border border-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="relative py-16 sm:py-28 lg:py-36 bg-co-warm">
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-co-charcoal leading-tight mb-6">
            Kontaktirajte
            <br />
            <span className="italic font-medium">naš tim</span>
          </h2>
          <p className="font-sans text-base text-co-charcoal/60 mb-10 leading-relaxed">
            Stojimo vam na raspolaganju za savjete, izmjeru i ponudu.
          </p>
          <div className="flex flex-col items-center gap-3">
            <p className="font-sans text-sm tracking-widest uppercase text-co-charcoal/50">
              Nazovite nas
            </p>
            <a
              href={`tel:${site.phone}`}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-co-charcoal hover:text-co-red transition-colors duration-300"
            >
              {site.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
