"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { site } from "@/data/site";

const navLinks = [
  { href: "/", label: "Naslovna" },
  { href: "/alubravarija", label: "Alubravarija" },
  { href: "/vrata", label: "Vrata" },
  { href: "/podovi", label: "Podovi" },
  { href: "/pu-paneli", label: "PU paneli" },
  { href: "/o-nama", label: "O nama" },
];

function PhoneIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-sm font-medium tracking-widest uppercase text-co-charcoal/70 hover:text-co-accent-dark transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop phone */}
          <a
            href={`tel:${site.phone}`}
            className="hidden lg:flex items-center gap-2 text-sm text-co-charcoal/60 hover:text-co-accent-dark transition-colors"
          >
            <PhoneIcon />
            {site.phoneDisplay}
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            aria-label="Otvori izbornik"
          >
            <span className={`block w-6 h-0.5 bg-co-charcoal transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-co-charcoal transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-co-charcoal transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[400px]" : "max-h-0"}`}>
        <nav className="border-t border-black/5 bg-white px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-sans text-sm font-medium tracking-widest uppercase text-co-charcoal/70 hover:text-co-accent-dark transition-colors py-2.5"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-black/5 mt-2 pt-3">
            <a
              href={`tel:${site.phone}`}
              className="inline-flex items-center gap-2 text-sm text-co-charcoal/60 hover:text-co-accent-dark transition-colors py-2"
            >
              <PhoneIcon />
              {site.phoneDisplay}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
