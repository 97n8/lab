import type { PaperTrailItem } from "./schema";
import { itemPdfUrl, itemUrl } from "./urls";

export type SealData = {
  id: string;
  version: string;
  shelfLabel: string;
  publishedLabel: string;
  modifiedLabel: string | null;
  canonicalUrl: string;
  pdfUrl: string;
  isCorrected: boolean;
};

/**
 * One shared shape for the seal block so the item page, the /print route,
 * and the OG image render the same facts (§4.9, §7). `sealed` is a
 * pass-through state in Phase 1 — it does not change what the seal says,
 * only whether the record is publicly listed (§8).
 */
export function buildSeal(item: PaperTrailItem): SealData {
  const publishedLabel = item.datePublished.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const modifiedLabel = item.dateModified
    ? item.dateModified.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return {
    id: item.id,
    version: item.version,
    shelfLabel: item.shelf === "release" ? "Release" : "Finding",
    publishedLabel,
    modifiedLabel,
    canonicalUrl: itemUrl(item),
    pdfUrl: itemPdfUrl(item),
    isCorrected: item.corrections.length > 0,
  };
}
