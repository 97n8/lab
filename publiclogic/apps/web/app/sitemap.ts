import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://publiclogic.org";
  const routes = [
    "",
    "/work",
    "/casespaces",
    "/pj",
    "/vault",
    "/kpl",
    "/stay",
    "/stay/guestbook",
    "/muni",
    "/cemetery",
    "/job",
    "/form",
    "/seed",
    "/recordstream",
    "/contact",
  ];
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
