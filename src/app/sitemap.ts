import type { MetadataRoute } from "next";

import { site } from "@/data/site";

const publicRoutes = [
  { path: "", changeFrequency: "monthly", priority: 1 },
  { path: "/alubravarija", changeFrequency: "monthly", priority: 0.9 },
  { path: "/vrata", changeFrequency: "monthly", priority: 0.9 },
  { path: "/podovi", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pu-paneli", changeFrequency: "monthly", priority: 0.9 },
  { path: "/o-nama", changeFrequency: "yearly", priority: 0.7 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${site.url}${path}`,
    changeFrequency,
    priority,
  }));
}
