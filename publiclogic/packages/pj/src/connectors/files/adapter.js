// The file-surface adapter: pull canonical files from a Source, run each through
// the FileSurfaceConnector, collect the receipts. It owns no placement logic and
// no vendor logic — the Source handles the vendor, the connector normalizes, the
// runtime core decides and proves. Held signals (needs_review) are preserved in a
// review queue, not dropped and not guessed.
//
// Hard boundaries (product doctrine): no silent file movement, no renaming, no
// write-back. It stops at the receipt. Wiring a decision onto the verified spine
// (FORM/PRR → ARCHIEVE → SEAL) is Step 4.

import { createReviewQueue } from "@publiclogic/golden-path";
import { fileSurfaceConnector } from "./fileSurfaceConnector.js";

function summarize(results) {
  const byAction = { open: 0, append: 0, needs_review: 0, ignore: 0 };
  for (const r of results) byAction[r.action.action] = (byAction[r.action.action] ?? 0) + 1;
  return { total: results.length, receipts: results.length, byAction };
}

/**
 * @param {{ source: import("./sources/source.js").FileSource, connector?: any, review?: any }} cfg
 */
export function createFileSurfaceAdapter({ source, connector = fileSurfaceConnector, review = createReviewQueue() } = {}) {
  if (!source || typeof source.listFiles !== "function") {
    throw new Error("pj/files: a FileSource with listFiles() is required.");
  }

  return {
    review,
    source: source.source,
    /**
     * Pull the surface and process every file. `ctx.existing` is the set of active
     * CaseSpaces the resolver matches against (PJ's CaseSpace policy supplies it).
     * @returns {Promise<{results: object[], review: any, summary: object}>}
     */
    async pull(ctx = {}) {
      const files = await source.listFiles();
      const results = [];
      for (const file of files) {
        results.push(await connector.process({ source: source.source, file }, { ...ctx, review }));
      }
      return { results, review, summary: summarize(results) };
    },
  };
}
