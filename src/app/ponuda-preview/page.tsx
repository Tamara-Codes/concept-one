import PonudaPage from "../ponuda/page";

export const metadata = {
  title: "Preview ponuda | Concept One",
  robots: { index: false, follow: false },
};

// Public visual preview only. The real /ponuda route remains protected by the auth proxy.
export default function OfferDashboardPreviewPage() {
  return <PonudaPage searchParams={Promise.resolve({ preview: "1" })} />;
}
