// The adapter: list files from a port, run each through the connector, collect
// the receipts. It owns no placement logic of its own — every decision is the
// core resolver's, every proof is a receipt. Held signals (needs_review) are
// preserved in a review queue, not dropped and not guessed.
//
// What this step deliberately does NOT do: wire into FORM/PRR. It stops at the
// receipt. A signal becomes a traceable object with a decision and a receipt;
// turning that into an opened/appended CaseSpace is the next step.

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
    throw new Error("connector-files: a FilesPort with listFiles() is required.");
  }

  return {
    review,
    /**
     * Pull the surface and process every file. `ctx.existing` is the set of
     * active CaseSpaces the core resolver matches against.
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
