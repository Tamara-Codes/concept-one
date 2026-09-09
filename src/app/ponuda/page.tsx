import { Metadata } from "next";
import PonudaForm from "./PonudaForm";

export const metadata: Metadata = {
  title: "Ponuda | Concept One",
  robots: { index: false, follow: false },
};

export default function PonudaPage() {
  return <PonudaForm />;
}
