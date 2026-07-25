import { marked } from "marked";
import type { PaperTrailItem } from "./schema";
import { itemUrl, SITE_URL } from "./urls";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Atom feed builder (§3.4). Findings ship full-content entries; Releases
 * ship abstract-only — that rule is per-item, so it holds across the full
 * feed, the per-shelf feeds, and every per-topic feed alike. Entry <id>
 * is the PT- identifier, stable across any future URL change.
 */
export function buildAtomFeed({
  title,
  feedUrl,
  items,
}: {
  title: string;
  feedUrl: string;
  items: PaperTrailItem[];
}): string {
  const updated = items[0]
    ? (items[0].dateModified ?? items[0].datePublished).toISOString()
    : new Date(0).toISOString();

  const entries = items
    .map((item) => {
      const url = itemUrl(item);
      const updatedAt = (item.dateModified ?? item.datePublished).toISOString();
      // Raw (unescaped) HTML — esc() below applies once, at interpolation,
      // for both branches. Pre-escaping the abstract here would double-escape
      // it (e.g. "&" -> "&amp;" -> "&amp;amp;") once <content> also escapes it.
      const contentHtml =
        item.shelf === "finding" ? (marked.parse(item.body, { async: false }) as string) : `<p>${item.abstract}</p>`;

      return `  <entry>
    <id>${esc(item.id)}</id>
    <title>${esc(item.title)}</title>
    <link href="${esc(url)}" />
    <published>${item.datePublished.toISOString()}</published>
    <updated>${updatedAt}</updated>
    <summary>${esc(item.abstract)}</summary>
    <content type="html">${esc(contentHtml)}</content>
    <author><name>PublicLogic LLC</name></author>
  </entry>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${esc(title)}</title>
  <id>${esc(feedUrl)}</id>
  <link href="${esc(feedUrl)}" rel="self" />
  <link href="${esc(SITE_URL)}/paper-trail" />
  <updated>${updated}</updated>
${entries}
</feed>
`;
}
