import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://publiclogic.org";
  const routes = [
    "",
    "/services",
    "/method",
    "/work",
    "/permit-bridge",
    "/about",
    "/pj",
    "/contact",
  ];
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
