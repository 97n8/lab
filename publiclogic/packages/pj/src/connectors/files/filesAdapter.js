// PJ's file-surface adapter: list files from a port, run each through the
// connector, collect the receipts. It owns no placement logic of its own —
// every decision is the runtime resolver's, every proof is a receipt. Held
// signals (needs_review) are preserved in a review queue, not dropped and not
// guessed.
//
// Hard boundaries (product doctrine): no silent file movement, no renaming, no
// write-back. It stops at the receipt. A file becomes a traceable object with a
// decision and a receipt; turning that into an opened/appended CaseSpace on the
// verified spine is the next step (FORM/PRR wiring).

import { createReviewQueue } from "@publiclogic/golden-path";
import { filesConnector } from "./filesConnector.js";

function summarize(results) {
  const byAction = { open: 0, append: 0, needs_review: 0, ignore: 0 };
  for (const r of results) byAction[r.action.action] = (byAction[r.action.action] ?? 0) + 1;
  return { total: results.length, receipts: results.length, byAction };
}

/**
 * @param {{ port: import("./ports.js").FilesPort, connector?: any, review?: any }} cfg
 */
export function createFilesAdapter({ port, connector = filesConnector, review = createReviewQueue() } = {}) {
  if (!port || typeof port.listFiles !== "function") {
    throw new Error("pj/files: a FilesPort with listFiles() is required.");
  }

  return {
    review,
    /**
     * Pull the surface and process every file. `ctx.existing` is the set of
     * active CaseSpaces the resolver matches against.
     * @returns {Promise<{results: object[], review: any, summary: object}>}
     */
    async pull(ctx = {}) {
      const files = await port.listFiles();
      const results = [];
      for (const file of files) {
        // process(): receive → normalize → resolve → receipt. Held signals are
        // flagged into `review` automatically via the opts.review hook.
        results.push(await connector.process(file, { ...ctx, review }));
      }
      return { results, review, summary: summarize(results) };
    },
  };
}
