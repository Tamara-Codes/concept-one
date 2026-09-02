import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import RevealPhoneButton from "./RevealPhoneButton";
import { categories, site, type Category } from "@/data/site";

interface CategoryPageProps {
  categorySlug: Category;
}

export default function CategoryPage({ categorySlug }: CategoryPageProps) {
  const category = categories.find((c) => c.slug === categorySlug)!;
  const others = categories.filter((c) => c.slug !== categorySlug);

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative h-[40vh] sm:h-[50vh] min-h-[320px] sm:min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-12 lg:pb-16 w-full">
          <nav className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-white/40 mb-4">
            <Link href="/" className="hover:text-white/70 transition-colors">Naslovna</Link>
            <span>/</span>
            <span className="text-white/70">{category.name}</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[0.95]">
            {category.name}
          </h1>
          <p className="font-sans text-base text-white/60 max-w-xl mt-4 leading-relaxed">
            {category.description}
          </p>
        </div>
      </section>

      {/* Intro + features (placeholder content) */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-24 items-start">
            <div>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-co-accent mb-4">
                {category.short}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-co-charcoal leading-tight mb-8">
                Kvaliteta i <span className="italic font-medium">preciznost</span>
                <br />
                u svakom detalju
              </h2>
              <div className="space-y-5 font-sans text-base text-co-charcoal/60 leading-relaxed">
                <p>
                  Ovdje dolazi opis ponude za kategoriju {category.name.toLowerCase()}.
                  Tekst je privremeni i služi kao predložak dok se ne pripremi
                  konačan sadržaj, fotografije i cjenik.
                </p>
                <p>
                  Naš tim stoji vam na raspolaganju za savjetovanje, izmjeru i
                  izradu ponude prilagođene vašem projektu.
                </p>
              </div>
            </div>

            <div>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-co-charcoal/40 mb-6">
                Iz ponude
              </p>
              <ul className="divide-y divide-black/5 border-y border-black/5">
                {category.features.map((f, i) => (
                  <li key={f} className="flex items-center gap-6 py-5">
                    <span className="font-serif text-2xl font-light text-co-accent/40 w-8">0{i + 1}</span>
                    <span className="font-serif text-xl text-co-charcoal">{f}</span>
                  </li>
                ))}
              </ul>
              <p className="font-sans text-sm text-co-charcoal/40 mt-6">
                Cijene na upit{" "}
                <span className="text-co-charcoal/25">|</span>{" "}
                <a
                  href={`mailto:${site.email}?subject=Upit – ${category.name}`}
                  className="text-co-accent hover:text-co-accent-dark transition-colors"
                >
                  Zatražite ponudu
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Other categories */}
      <section className="bg-co-warm py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-co-accent mb-8">
            Pogledajte i
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {others.map((c) => (
              <Link key={c.slug} href={`/${c.slug}`} className="group relative aspect-[4/3] overflow-hidden">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <h3 className="absolute bottom-5 left-5 font-serif text-2xl font-medium text-white">{c.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-co-charcoal py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-white mb-4">
            Zainteresirani za <span className="italic font-medium">{category.name.toLowerCase()}</span>?
          </h2>
          <p className="font-sans text-base text-white/50 mb-8 leading-relaxed">
            Kontaktirajte nas za stručno savjetovanje, izmjeru i ponudu.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <RevealPhoneButton
              phone={site.phone}
              display={site.phoneDisplay}
              className="inline-flex items-center gap-3 bg-co-accent hover:bg-co-accent-dark text-white px-6 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm font-medium tracking-widest uppercase transition-all duration-300"
            />
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-3 border border-white/30 hover:border-white/60 text-white px-6 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm font-medium tracking-widest uppercase transition-all duration-300"
            >
              Pošaljite upit
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
