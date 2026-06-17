import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://publiclogic.org";
  return [
    "",
    "/solutions",
    "/products",
    "/permit-bridge",
    "/method",
    "/about",
    "/resources",
    "/labs",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
