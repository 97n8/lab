import type { PaperTrailItem } from "./schema";

export const SITE_URL = "https://publiclogic.org";

export function itemPath(item: Pick<PaperTrailItem, "year" | "slug">): string {
  return `/paper-trail/${item.year}/${item.slug}`;
}

export function itemUrl(item: Pick<PaperTrailItem, "year" | "slug" | "canonicalOverride">): string {
  return item.canonicalOverride ?? `${SITE_URL}${itemPath(item)}`;
}

export function itemPdfUrl(item: Pick<PaperTrailItem, "year" | "slug">): string {
  return `${SITE_URL}${itemPath(item)}.pdf`;
}

export function topicPath(tag: string): string {
  return `/paper-trail/topics/${tag}`;
}
