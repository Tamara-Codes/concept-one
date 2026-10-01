import { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Podovi | Concept One",
  description: "Laminat, parket, vinilni i SPC podovi za svaki prostor.",
  alternates: { canonical: "/podovi" },
};

export default function Page() {
  return <CategoryPage categorySlug="podovi" />;
}
