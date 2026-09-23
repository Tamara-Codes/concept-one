import { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Zidni paneli | Concept One",
  description: "Zidni paneli za krovove i fasade.",
};

export default function Page() {
  return <CategoryPage categorySlug="pu-paneli" />;
}
