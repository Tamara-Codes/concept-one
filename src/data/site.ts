// Central place for company info and categories.
// TODO: replace placeholder contact details with real Concept One data.
export const site = {
  name: "Concept One",
  company: "Concept One d.o.o.",
  tagline: "Aluminij, vrata, podovi i paneli",
  phone: "+385910000000",
  phoneDisplay: "091 000 0000",
  email: "info@conceptone.hr",
  address: "Ulica bb, 51000 Rijeka",
  facebook: "https://facebook.com/",
  instagram: "https://instagram.com/",
};

export type Category = "alubravarija" | "vrata" | "podovi" | "pu-paneli";

export interface CategoryInfo {
  slug: Category;
  name: string;
  short: string;
  description: string;
  image: string;
  features: string[];
}

export const categories: CategoryInfo[] = [
  {
    slug: "alubravarija",
    name: "Alubravarija",
    short: "Aluminijski prozori, stijene i fasadni sustavi",
    description:
      "Aluminijska bravarija po mjeri — prozori, ulazne i klizne stijene, fasadni sustavi i zimski vrtovi vrhunske kvalitete.",
    image: "/images/pages/cat-alubravarija.jpg",
    features: [
      "Prozori i balkonska vrata",
      "Klizne i harmonika stijene",
      "Fasadni sustavi",
      "Zimski vrtovi i pergole",
    ],
  },
  {
    slug: "vrata",
    name: "Vrata",
    short: "Ulazna, sobna i protupožarna vrata",
    description:
      "Ulazna, sobna i protupožarna vrata koja spajaju sigurnost, izolaciju i moderan dizajn.",
    image: "/images/pages/cat-vrata.jpg",
    features: [
      "Ulazna aluminijska vrata",
      "Sobna vrata",
      "Protupožarna vrata",
      "Garažna vrata",
    ],
  },
  {
    slug: "podovi",
    name: "Podovi",
    short: "Laminat, parket i vinilni podovi",
    description:
      "Široka ponuda podnih obloga — laminat, parket, vinil i SPC podovi za svaki prostor i stil.",
    image: "/images/pages/cat-podovi.jpg",
    features: ["Laminat", "Parket", "Vinilni i SPC podovi", "Podne lajsne"],
  },
  {
    slug: "pu-paneli",
    name: "PU paneli",
    short: "Poliuretanski sendvič paneli za krov i fasadu",
    description:
      "Poliuretanski sendvič paneli za krovove i fasade — brza montaža, izvrsna toplinska izolacija i dugotrajnost.",
    image: "/images/pages/cat-pu-paneli.jpg",
    features: [
      "Krovni PU paneli",
      "Fasadni PU paneli",
      "Hladnjačarski paneli",
      "Pripadajući limovi i opšavi",
    ],
  },
];
