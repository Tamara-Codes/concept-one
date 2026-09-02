import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Concept One | Alubravarija, vrata, podovi i PU paneli",
  description:
    "Concept One - Vaš partner za aluminijsku bravariju, vrata, podove i PU panele.",
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
