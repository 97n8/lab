import type { PaperTrailItem } from "./schema";
import { itemUrl } from "./urls";

/**
 * `PublicLogic LLC. "{title}." The Paper Trail, {date}, {url}. Record PT-2026-001, v{version}.`
 * The exact string that ships in the citation block's copy button (§4.8).
 */
export function buildCitation(item: PaperTrailItem): string {
  const date = item.datePublished.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `PublicLogic LLC. "${item.title}." The Paper Trail, ${date}, ${itemUrl(item)}. Record ${item.id}, v${item.version}.`;
}
