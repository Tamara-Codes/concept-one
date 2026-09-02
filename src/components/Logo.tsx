import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex-shrink-0 leading-none">
      <span className="font-serif text-2xl font-bold text-co-charcoal tracking-tight">Concept</span>
      <span className="font-serif text-2xl font-bold text-co-accent-dark tracking-tight ml-1.5">One</span>
    </Link>
  );
}
