import NewOfferPage from "../ponuda/new/page";

export const metadata = {
  title: "Preview nove ponude | Concept One",
  robots: { index: false, follow: false },
};

// Public visual preview only. The real /ponuda/new route remains protected.
export default function NewOfferPreviewPage() {
  return <NewOfferPage />;
}
