import type { MetadataRoute } from "next";
import { getPublishedItems, getTagRegistry } from "../lib/paper-trail/collection";
import { itemUrl } from "../lib/paper-trail/urls";

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
    "/paper-trail",
    "/paper-trail/releases",
    "/paper-trail/findings",
  ];
  const staticEntries = routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const topicEntries = Object.keys(getTagRegistry()).map((tag) => ({
    url: `${base}/paper-trail/topics/${tag}`,
    lastModified: new Date(),
  }));

  // Invariant 4 (§2.2): only status: published items ever reach the sitemap.
  const itemEntries = getPublishedItems().map((item) => ({
    url: itemUrl(item),
    lastModified: item.dateModified ?? item.datePublished,
  }));

  return [...staticEntries, ...topicEntries, ...itemEntries];
}
