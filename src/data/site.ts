// Central place for company info and categories.
// Legal data from public registers (Fina info.BIZ / fininfo.hr), checked 2026-09-02.
// TODO: phone, email and social links are still placeholders — not publicly listed.
export const site = {
  name: "Concept One",
  company: "INNOVA PROJEKT d.o.o.",
  legalName:
    "INNOVA PROJEKT društvo s ograničenom odgovornošću za građevinarstvo i usluge",
  tagline: "Aluminij, vrata, podovi i paneli",
  phone: "+385910000000",
  phoneDisplay: "091 000 0000",
  email: "info@conceptone.hr",
  street: "Ćikovići 128",
  city: "51215 Kastav",
  address: "Ćikovići 128, 51215 Kastav",
  oib: "51970776577",
  mb: "05347653",
  // TODO: MBS, IBAN and bank are not in public sources — get from the client.
  mbs: "000000000",
  director: "Tomislav Milardović",
  capital: "2.500,00 EUR, uplaćen u cijelosti",
  court: "Trgovački sud u Rijeci",
  bank: "Naziv banke d.d.",
  iban: "HR00 0000 0000 0000 0000 0",
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
