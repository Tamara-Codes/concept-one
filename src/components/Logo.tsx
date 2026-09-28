import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex-shrink-0 leading-none">
      <span className="font-serif text-2xl font-bold tracking-tight" style={{ color: "var(--color-co-charcoal)", textTransform: "none" }}>Concept</span>
      <span className="font-serif text-2xl font-bold tracking-tight ml-1.5" style={{ color: "var(--color-co-accent-dark)", textTransform: "none" }}>One</span>
    </Link>
  );
}
