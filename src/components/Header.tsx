"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

const navLinks = [
  { href: "/", label: "Naslovna" },
  { href: "/alubravarija", label: "Alu i PVC bravarija" },
  { href: "/vrata", label: "Vrata" },
  { href: "/podovi", label: "Podovi" },
  { href: "/pu-paneli", label: "Zidni paneli" },
  { href: "/o-nama", label: "O nama" },
];

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
        </nav>
      </div>
    </header>
  );
}
