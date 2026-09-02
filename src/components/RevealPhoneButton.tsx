"use client";

import { useState, type MouseEvent } from "react";

interface RevealPhoneButtonProps {
  phone: string;
  display: string;
  className: string;
  defaultLabel?: string;
}

export default function RevealPhoneButton({
  phone,
  display,
  className,
  defaultLabel = "Nazovite nas",
}: RevealPhoneButtonProps) {
  const [revealed, setRevealed] = useState(false);

  if (revealed) {
    return (
      <a
        href={`tel:${phone}`}
        className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-co-accent hover:text-co-accent-dark transition-colors duration-300"
      >
        {display}
      </a>
    );
  }

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setRevealed(true);
  };

  return (
    <a href={`tel:${phone}`} onClick={onClick} className={className}>
      {defaultLabel}
    </a>
  );
}
