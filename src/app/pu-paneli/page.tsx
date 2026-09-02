import { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "PU paneli | Concept One",
  description: "Poliuretanski sendvic paneli za krovove i fasade.",
};

export default function Page() {
  return <CategoryPage categorySlug="pu-paneli" />;
}
