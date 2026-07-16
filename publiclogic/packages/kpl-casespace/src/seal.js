// The seal — where STAY stops being a dashboard and becomes a proof.
//
// kpl-casespace normalizes the Airbnb feed into Booking/Turnover cases. This
// module commits those cases to the verified spine: each case earns a Record
// Receipt over its exact canonical bytes, and the whole ordered set seals into
// a Packet whose closing CaseReceipt (a Merkle root) catches both alteration
// AND omission. Verification is offline — no KPL server, no PublicLogic server.
//
// A booking record is mutable (a re-sync can update it), so a receipt attests
// existence-at-time: "this record existed in exactly these bytes at this seal."
// Re-sealing after a change produces a new packet; the old one still verifies
// against the bytes it sealed. Receipts attest existence/provenance/placement —
// never truth or legal sufficiency.
import { makeReceipt, verifyReceipt, buildPacket, verifyPacket } from "@publiclogic/golden-path";

export const STAY_LISTING = "Kendall Pond Lodge";

/** Deterministic order: content-derived case IDs sorted ascending. A stable
 *  order is what lets the same case set re-seal to the same Merkle root. */
export function orderCases(cases) {
  return [...cases].sort((a, b) => (a.case_id < b.case_id ? -1 : a.case_id > b.case_id ? 1 : 0));
}

/** A standalone Record Receipt for one case — the "verify this booking" primitive. */
export async function receiptForCase(caseObj, meta = {}) {
  return makeReceipt(caseObj, {
    object_type: caseObj.case_type,
    object_id: caseObj.case_id,
    at: meta.at ?? null,
  });
}

/** Verify one case against its standalone receipt (re-derives the bytes). */
export async function verifyCaseReceipt(caseObj, receipt) {
  return verifyReceipt(caseObj, receipt);
}

/** Reference to the STAY CaseSpace being sealed — deterministic, no wall clock. */
export function stayCaseRef(listing = STAY_LISTING) {
  return { id: "KPL", lane: "STAY", listing };
}

/**
 * Seal the full case set into an offline-verifiable Packet.
 * @param {Array} cases   Booking + Turnover cases from syncCases()
 * @param {{at?:string, listing?:string}} opts  `at` is the sync timestamp (deterministic)
 * @returns a deep-frozen Packet with per-record receipts + a closing CaseReceipt.
 */
export function sealCases(cases, opts = {}) {
  const ordered = orderCases(cases);
  return buildPacket(stayCaseRef(opts.listing), ordered, {
    closed_at: opts.at ?? null,
    sealed_from: "AIRBNB_ICAL",
  });
}

/** Verify a sealed STAY packet offline. Returns { ok, failures[] }. */
export function verifySeal(packet) {
  return verifyPacket(packet);
}
