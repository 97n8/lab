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
import { createReviewItem } from "./review.js";

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

/** The placement decision: where the object goes, with the evidence behind it. */
/**
 * @typedef {Object} CaseSpaceAction
 * @property {"open"|"append"|"ignore"|"needs_review"} action
 * @property {string} [caseSpaceId]
 * @property {string} [caseSpaceType]
 * @property {number} confidence       - 0..1, derived from match evidence
 * @property {string} reason
 * @property {string[]} matchEvidence   - the evidence that supported the decision
 * @property {string[]} [missingEvidence] - the evidence a confident match would have needed
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

export const RECEIPT_VERB = {
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

const round2 = (n) => Math.round(n * 100) / 100;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

// Does one evidence value match another? Arrays match on any overlap.
function dimMatches(a, b) {
  if (a === undefined || b === undefined) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    const aa = [].concat(a);
    const bb = [].concat(b);
    return aa.some((x) => bb.includes(x));
  }
  return a === b;
}

// Which of the object's declared evidence dimensions match a candidate CaseSpace's keys.
function matchedDims(object, cs) {
  const have = (object.metadata && object.metadata.evidence) || {};
  const keys = (cs && cs.keys) || {};
  return Object.keys(have).filter((dim) => dimMatches(have[dim], keys[dim]));
}

/**
 * The source-agnostic resolver. Decides where a PJObject goes from the object
 * alone — never from where it came from — and reports the evidence behind it.
 *
 * Doctrine: PJ does not pretend scattered information is connected unless it has
 * evidence. Order: an explicit ignore hint wins; a normalizer that wasn't
 * confident is held; a CaseSpace-key (or strong evidence) match appends; a
 * suggestion with no match opens; nothing to connect to is held for a human.
 *
 * @param {PJObject} object
 * @param {{ existing?: {id:string,key?:string,type?:string,keys?:Record<string,unknown>}[], match?: (o:PJObject, cs:any)=>boolean }} [ctx]
 * @returns {CaseSpaceAction}
 */
export function resolveCaseSpace(object, ctx = {}) {
  const expects = (object.metadata && object.metadata.expects) || [];
  const sourceTag = `source:${(object.metadata && object.metadata.source) || object.objectType.split(".")[0]}`;

  if (object.metadata && object.metadata.disposition === "ignore") {
    return { action: "ignore", confidence: 0.99, reason: "Normalizer marked this signal as ignorable noise.", matchEvidence: [], missingEvidence: [] };
  }
  if (object.confidence != null && object.confidence < REVIEW_THRESHOLD) {
    return {
      action: "needs_review",
      confidence: round2(object.confidence),
      reason: `Normalizer confidence ${object.confidence} below ${REVIEW_THRESHOLD} — hold for a human.`,
      matchEvidence: [sourceTag],
      missingEvidence: expects,
    };
  }

  const sc = object.suggestedCaseSpace;
  const existing = ctx.existing ?? [];
  const keyMatch = ctx.match ?? ((o, cs) => cs.id === sc || cs.key === sc);

  // Best candidate: prefer a direct CaseSpace-key match, else the most evidence.
  let best = null;
  let bestMatched = [];
  if (sc) {
    const keyed = existing.find((cs) => keyMatch(object, cs));
    if (keyed) {
      best = keyed;
      bestMatched = ["casespace_key", ...matchedDims(object, keyed)];
    }
  }
  if (!best) {
    for (const cs of existing) {
      const m = matchedDims(object, cs);
      if (m.length > bestMatched.length) {
        best = cs;
        bestMatched = m;
      }
    }
  }

  const matchedExpected = expects.filter((d) => bestMatched.includes(d));
  const missingEvidence = expects.filter((d) => !bestMatched.includes(d));
  const ratio = expects.length ? matchedExpected.length / expects.length : 0;
  const matchEvidence = bestMatched.length ? bestMatched : [sourceTag];

  const hasKey = bestMatched.includes("casespace_key");
  let confidence;
  if (hasKey) confidence = round2(clamp(0.8 + 0.19 * ratio, 0, 0.99));
  else if (best) confidence = round2(clamp(0.5 + 0.4 * ratio, 0, 0.99));
  else if (sc) confidence = 0.7; // a suggestion, but nothing to match → open new
  else confidence = 0.4; // nothing to connect to → hold

  if (best && (hasKey || confidence >= REVIEW_THRESHOLD)) {
    return { action: "append", caseSpaceId: best.id, confidence, reason: `Matched existing CaseSpace ${best.id} on ${bestMatched.join(", ")}.`, matchEvidence, missingEvidence };
  }
  if (sc) {
    return { action: "open", caseSpaceType: object.objectType.split(".")[0], confidence, reason: `No matching active CaseSpace for "${sc}".`, matchEvidence, missingEvidence };
  }
  return { action: "needs_review", confidence, reason: "No thread hint, key, people, or date match found — hold for a human.", matchEvidence, missingEvidence };
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
    // The receipt carries the evidence behind the decision — self-describing
    // proof of why it was placed (or why it was held).
    matchEvidence: action.matchEvidence ?? [],
    missingEvidence: action.missingEvidence ?? [],
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
      const result = { signal, object, action, receipt: receiptObj };
      // Held signals are preserved as a reviewable item — never dropped, never guessed.
      if (action.action === "needs_review") {
        const review = createReviewItem({ signal, object, decision: action, receipt: receiptObj }, opts);
        result.review = review;
        if (opts.review && typeof opts.review.flag === "function") opts.review.flag(review);
      }
      return result;
    },
  };
}
