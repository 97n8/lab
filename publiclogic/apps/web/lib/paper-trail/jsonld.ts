import type { AuthorRegistry, PaperTrailItem, TagRegistry } from "./schema";
import { itemPath, itemUrl, SITE_URL, topicPath } from "./urls";

const EMBLEM_URL = `${SITE_URL}/brand/publiclogic-logo.png`;

function isoDate(d: Date): string {
  return d.toISOString();
}

/** shelf === "release" -> NewsArticle; "finding" -> Report if sourced, else Article (§3.2). */
export function articleType(item: Pick<PaperTrailItem, "shelf" | "sources">): "NewsArticle" | "Article" | "Report" {
  if (item.shelf === "release") return "NewsArticle";
  return item.sources.length > 0 ? "Report" : "Article";
}

export function buildArticleJsonLd(item: PaperTrailItem, authors: AuthorRegistry, tags: TagRegistry) {
  const url = itemUrl(item);
  return {
    "@context": "https://schema.org",
    "@type": articleType(item),
    headline: item.title,
    description: item.abstract,
    identifier: item.id,
    version: item.version,
    datePublished: isoDate(item.datePublished),
    ...(item.dateModified ? { dateModified: isoDate(item.dateModified) } : {}),
    author: item.authors.map((key) => ({
      "@type": "Person",
      name: authors[key]?.name ?? key,
      ...(authors[key]?.jobTitle ? { jobTitle: authors[key].jobTitle } : {}),
    })),
    publisher: {
      "@type": "Organization",
      name: "PublicLogic LLC",
      logo: { "@type": "ImageObject", url: EMBLEM_URL },
    },
    mainEntityOfPage: url,
    keywords: item.tags.map((t) => tags[t]?.label ?? t).join(", "),
    ...(item.corrections.length > 0
      ? {
          correction: item.corrections.map((c) => ({
            "@type": "CorrectionComment",
            datePublished: isoDate(c.date),
            text: c.note,
          })),
        }
      : {}),
  };
}

export function buildBreadcrumbJsonLd(item: PaperTrailItem) {
  const shelfLabel = item.shelf === "release" ? "Releases" : "Findings";
  const shelfPath = item.shelf === "release" ? "/paper-trail/releases" : "/paper-trail/findings";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "The Paper Trail", item: `${SITE_URL}/paper-trail` },
      { "@type": "ListItem", position: 2, name: shelfLabel, item: `${SITE_URL}${shelfPath}` },
      { "@type": "ListItem", position: 3, name: item.title, item: `${SITE_URL}${itemPath(item)}` },
    ],
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PublicLogic LLC",
    url: SITE_URL,
    logo: EMBLEM_URL,
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "The Paper Trail",
    url: `${SITE_URL}/paper-trail`,
    publisher: { "@type": "Organization", name: "PublicLogic LLC" },
  };
}

export function buildTopicHubJsonLd(tag: string, label: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `The Paper Trail — ${label}`,
    url: `${SITE_URL}${topicPath(tag)}`,
    isPartOf: { "@type": "WebSite", name: "The Paper Trail", url: `${SITE_URL}/paper-trail` },
  };
}
