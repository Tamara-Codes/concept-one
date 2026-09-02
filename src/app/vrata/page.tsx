import { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Vrata | Concept One",
  description: "Ulazna, sobna, protupozarna i garazna vrata.",
};

export default function Page() {
  return <CategoryPage categorySlug="vrata" />;
}
