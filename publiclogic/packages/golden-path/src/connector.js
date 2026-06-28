// The PJ connector interface — the product. KPL is the proof.
//
// The whole of PJ in miniature:  Signal in → governed object → receipt out.
// A connector only knows how to RECEIVE and NORMALIZE its source. Everything
// after that is source-agnostic core: the resolver decides where the object
// goes (open / append / needs_review / ignore), and the receipt emitter proves
// it. No vendor logic leaks past normalize().
//
// The receipt is the moat. It says: we saw it, we understood it, we placed it,
// and we can prove where it went — and, via the Canonical Form v1 checksum, that
// the object itself was not altered. That checksum is the same core Step 1's
// Record Receipts use, so the connector layer inherits tamper-evidence for free.

import { shortHash } from "./seed.js";
import { canonicalize, hashCanonical } from "./canonical.js";

/** A raw inbound event from a source, before PJ understands it. */
/**
 * @typedef {Object} Signal
 * @property {string} id
 * @property {string} source            - e.g. "gmail", "airbnb", "drive"
 * @property {string} signalType        - e.g. "message.received", "reservation.created"
 * @property {string|null} [sourceId]   - stable id in the source system
 * @property {string} occurredAt        - when it happened (ISO)
 * @property {string|null} [actor]       - who caused it
 * @property {Record<string, unknown>} payload
 */

/** A PJ-readable object: the normalized, governable thing the signal became. */
/**
 * @typedef {Object} PJObject
 * @property {string} id
 * @property {string} objectType        - e.g. "stay.message", "stay.reservation", "muni.document"
 * @property {string} title
 * @property {string|null} [summary]
 * @property {string[]} [relatedPeople]
 * @property {string[]} [relatedDates]
 * @property {string[]} [relatedFiles]
 * @property {string|null} [suggestedCaseSpace]
 * @property {number|null} [confidence]
 * @property {Record<string, unknown>} metadata
 */

/** The placement decision: where the object goes. Source-agnostic. */
/**
 * @typedef {Object} CaseSpaceAction
 * @property {"open"|"append"|"ignore"|"needs_review"} action
 * @property {string} [caseSpaceId]
 * @property {string} [caseSpaceType]
 * @property {string} reason
 */

/** The immutable proof that the signal was seen, understood, and placed. */
/**
 * @typedef {Object} Receipt
 * @property {string} id
 * @property {string} signalId
 * @property {string} objectId
 * @property {string} action
 * @property {string} [caseSpaceId]
 * @property {string|null} timestamp
 * @property {string} source
 * @property {boolean} preserved
 * @property {string} [checksum]
 */

export const CASE_ACTIONS = ["open", "append", "ignore", "needs_review"];

// Below this, the object isn't trusted enough to place automatically.
export const REVIEW_THRESHOLD = 0.6;

const RECEIPT_VERB = {
  open: "opened_casespace",
  append: "appended_to_casespace",
  needs_review: "flagged_for_review",
  ignore: "ignored",
};

function deepFreeze(v) {
  if (v && typeof v === "object") {
    for (const k of Object.keys(v)) deepFreeze(v[k]);
    Object.freeze(v);
  }
  return v;
}

/**
 * Build a canonical Signal from a connector's receive() output. Content-addressed
 * (idempotent): the same inbound event yields the same id regardless of fetch time.
 * @returns {Signal}
 */
export function toSignal(input = {}) {
  const { source, signalType, sourceId, occurredAt, actor, payload } = input;
  if (!source || typeof source !== "string") throw new Error("Signal: a source is required.");
  if (!signalType || typeof signalType !== "string") throw new Error("Signal: a signalType is required.");
  if (!occurredAt || typeof occurredAt !== "string") throw new Error("Signal: occurredAt (ISO) is required.");
  if (payload === null || typeof payload !== "object") throw new Error("Signal: an object payload is required.");
  const id = `sig_${shortHash(`${source}:${signalType}:${sourceId ?? ""}:${canonicalize(payload)}`)}`;
  return deepFreeze({
    id,
    source,
    signalType,
    sourceId: sourceId ?? null,
    occurredAt,
    actor: actor ?? null,
    payload,
  });
}

/**
 * Build a canonical PJObject from a normalizer's output. Fills defaults and a
 * deterministic id so the same normalized content is the same object.
 * @returns {PJObject}
 */
export function toPJObject(partial = {}) {
  const { objectType, title } = partial;
  if (!objectType || typeof objectType !== "string") throw new Error("PJObject: an objectType is required.");
  if (!title || typeof title !== "string") throw new Error("PJObject: a title is required.");
  const metadata = partial.metadata ?? {};
  const id = partial.id ?? `obj_${shortHash(`${objectType}:${title}:${canonicalize(metadata)}`)}`;
  return deepFreeze({
    id,
    objectType,
    title,
    summary: partial.summary ?? null,
    relatedPeople: partial.relatedPeople ?? [],
    relatedDates: partial.relatedDates ?? [],
    relatedFiles: partial.relatedFiles ?? [],
    suggestedCaseSpace: partial.suggestedCaseSpace ?? null,
    confidence: partial.confidence ?? null,
    metadata,
  });
}

/**
 * The source-agnostic resolver. Decides where a PJObject goes from the object
 * alone — never from where it came from. Order: an explicit ignore hint wins,
 * then low confidence routes to review, then a CaseSpace match appends, then a
 * suggestion with no match opens, else it needs review.
 * @param {PJObject} object
 * @param {{ existing?: {id:string,key?:string,type?:string}[], match?: (o:PJObject, cs:any)=>boolean }} [ctx]
 * @returns {CaseSpaceAction}
 */
export function resolveCaseSpace(object, ctx = {}) {
  if (object.metadata && object.metadata.disposition === "ignore") {
    return { action: "ignore", reason: "Normalizer marked this signal as ignorable noise." };
  }
  if (object.confidence != null && object.confidence < REVIEW_THRESHOLD) {
    return { action: "needs_review", reason: `Confidence ${object.confidence} below ${REVIEW_THRESHOLD} — hold for a human.` };
  }

  const sc = object.suggestedCaseSpace;
  if (sc) {
    const existing = ctx.existing ?? [];
    const match = ctx.match ?? ((o, cs) => cs.id === sc || cs.key === sc);
    const hit = existing.find((cs) => match(object, cs));
    if (hit) {
      return { action: "append", caseSpaceId: hit.id, reason: `Matched existing CaseSpace ${hit.id}.` };
    }
    return { action: "open", caseSpaceType: object.objectType.split(".")[0], reason: `No matching active CaseSpace for "${sc}".` };
  }

  return { action: "needs_review", reason: "No CaseSpace suggestion to resolve — hold for a human." };
}

/**
 * Emit the immutable receipt for a processed signal. The checksum is the
 * Canonical Form v1 hash of the placed object — same core as Step 1's receipts —
 * so the placement proof is also an integrity proof.
 * @returns {Promise<Receipt>}
 */
export async function emitReceipt({ signal, object, action }, opts = {}) {
  const verb = RECEIPT_VERB[action.action] ?? action.action;
  const checksum = await hashCanonical(object);
  const receipt = {
    id: `rcpt_${shortHash(`${signal.id}:${verb}:${object.id}`)}`,
    signalId: signal.id,
    objectId: object.id,
    action: verb,
    timestamp: opts.timestamp ?? signal.occurredAt ?? null,
    source: signal.source,
    preserved: true,
    checksum,
  };
  if (action.caseSpaceId) receipt.caseSpaceId = action.caseSpaceId;
  return deepFreeze(receipt);
}

/**
 * Define a connector from just its source-specific edges (receive, normalize).
 * resolve and receipt default to the core implementations, so connectors stay
 * thin and the core stays the single place placement + proof happen.
 * @returns the PJConnector: { source, receive, normalize, resolve, receipt, process }
 */
export function defineConnector({ source, receive, normalize, resolve, receipt }) {
  if (!source || typeof source !== "string") throw new Error("Connector: a source name is required.");
  if (typeof receive !== "function") throw new Error("Connector: receive() is required.");
  if (typeof normalize !== "function") throw new Error("Connector: normalize() is required.");
  const _resolve = resolve ?? resolveCaseSpace;
  const _receipt = receipt ?? emitReceipt;

  return {
    source,
    receive,
    normalize,
    resolve: _resolve,
    receipt: _receipt,
    /** Run the whole contract: receive → normalize → resolve → receipt. */
    async process(input, opts = {}) {
      const signal = await receive(input);
      const object = await normalize(signal);
      const action = await _resolve(object, opts);
      const receiptObj = await _receipt({ signal, object, action }, opts);
      return { signal, object, action, receipt: receiptObj };
    },
  };
}
