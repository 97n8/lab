// Step 2A — the human review resolution loop. This is the moment PJ becomes
// trustworthy: not because it automates everything, but because it knows when
// NOT to. When the resolver returns needs_review, the signal is preserved as a
// ReviewItem; a human later resolves it (append / open / ignore), and that
// resolution emits a SECOND receipt linked to the first. The second receipt
// proves: PJ did not guess, a person decided, and the decision was preserved.

import { shortHash } from "./seed.js";
import { hashCanonical } from "./canonical.js";

const HUMAN_VERB = {
  append: "human_appended_to_casespace",
  open: "human_opened_casespace",
  ignore: "human_ignored_signal",
};

function deepFreeze(v) {
  if (v && typeof v === "object") {
    for (const k of Object.keys(v)) deepFreeze(v[k]);
    Object.freeze(v);
  }
  return v;
}

/**
 * Preserve a held signal as a reviewable item. Carries the original signal,
 * object, decision, and the first (flagged_for_review) receipt id — nothing is
 * thrown away while a human is deciding.
 * @returns a frozen ReviewItem
 */
export function createReviewItem({ signal, object, decision, receipt }, opts = {}) {
  return deepFreeze({
    id: `rev_${shortHash(`${signal.id}:${object.id}`)}`,
    status: "open",
    signalId: signal.id,
    objectId: object.id,
    signal,
    object,
    decision,
    firstReceiptId: receipt.id,
    createdAt: opts.timestamp ?? receipt.timestamp ?? null,
  });
}

/**
 * Resolve a held item with a human decision. Emits a SECOND receipt linked to
 * the first via priorReceiptId. Pure — does not mutate the ReviewItem.
 * @param {object} item   a ReviewItem
 * @param {{action:"append"|"open"|"ignore", caseSpaceId?:string, caseSpaceType?:string, resolvedBy:string, reason?:string}} choice
 * @returns {Promise<{resolution, receipt}>}
 */
export async function resolveReviewItem(item, choice = {}, opts = {}) {
  const { action, caseSpaceId, caseSpaceType, resolvedBy, reason } = choice;
  if (!HUMAN_VERB[action]) throw new Error(`Review: human action must be append | open | ignore (got "${action}").`);
  if (action === "append" && !caseSpaceId) throw new Error("Review: append requires a caseSpaceId.");
  if (action === "open" && !caseSpaceType) throw new Error("Review: open requires a caseSpaceType.");
  if (!resolvedBy) throw new Error("Review: resolvedBy is required — a person owns this decision.");

  const verb = HUMAN_VERB[action];
  const checksum = await hashCanonical(item.object);
  const receipt = {
    id: `rcpt_${shortHash(`${item.firstReceiptId}:${verb}:${resolvedBy}`)}`,
    priorReceiptId: item.firstReceiptId,
    signalId: item.signalId,
    objectId: item.objectId,
    action: verb,
    timestamp: opts.timestamp ?? null,
    source: item.signal.source,
    resolvedBy,
    reason: reason ?? null,
    preserved: true,
    checksum,
  };
  if (action === "append") receipt.caseSpaceId = caseSpaceId;
  if (action === "open") receipt.caseSpaceType = caseSpaceType;

  const resolution = { action, caseSpaceId: caseSpaceId ?? null, caseSpaceType: caseSpaceType ?? null, resolvedBy, reason: reason ?? null };
  return { resolution, receipt: deepFreeze(receipt) };
}

/**
 * A small in-memory queue of held signals. Append-only in spirit: resolving an
 * item records a resolution and a second receipt; it never overwrites the
 * original signal, object, or first receipt, and an item can't be resolved twice.
 */
export function createReviewQueue() {
  const items = new Map();
  return {
    flag(reviewItem) {
      items.set(reviewItem.id, reviewItem);
      return reviewItem;
    },
    get(id) {
      return items.get(id);
    },
    list(status) {
      return [...items.values()].filter((r) => !status || r.status === status);
    },
    async resolve(id, choice, opts = {}) {
      const item = items.get(id);
      if (!item) throw new Error(`Review: no item ${id}.`);
      if (item.status === "resolved") throw new Error(`Review: item ${id} is already resolved — no silent overwrite.`);
      const { resolution, receipt } = await resolveReviewItem(item, choice, opts);
      // Store a resolved VIEW; the original (frozen) signal/object/firstReceipt ride along untouched.
      const resolved = deepFreeze({ ...item, status: "resolved", resolution, secondReceiptId: receipt.id });
      items.set(id, resolved);
      return { reviewItem: resolved, receipt };
    },
  };
}
