import { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Aluminijska i PVC bravarija | Concept One",
  description: "Aluminijska bravarija po mjeri - prozori, stijene, fasadni sustavi i zimski vrtovi.",
};

export default function Page() {
  return <CategoryPage categorySlug="alubravarija" />;
}
