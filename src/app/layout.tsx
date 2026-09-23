import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "Concept One | Bravarija, vrata, podovi, zidne obloge i ograde",
  description:
    "Concept One - Vaš partner za aluminijsku i PVC bravariju, unutarnja vrata, unutarnje i vanjske podove, zidne obloge i ogradne sisteme.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
