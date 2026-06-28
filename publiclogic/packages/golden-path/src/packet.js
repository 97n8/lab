// Packet Builder prototype (GP-012/013) — turns a closed CaseSpace into a
// sealed, independently-verifiable packet. This is the "proof is the product"
// payload: canonical objects + a Record Receipt per object + a closing
// CaseReceipt that commits to the *whole ordered set* via a Merkle root.
//
// Two failures it must expose, offline, with no PublicLogic server:
//   1. Alteration  — any record changed -> its Record Receipt fails.
//   2. Omission    — any record dropped/reordered -> the Merkle root fails.
//
// Pure and deterministic. Signatures/anchors are out of scope for the
// prototype; the integrity spine (canonical form -> receipt -> Merkle root)
// is what we are de-risking first.

import { canonicalize, sha256Hex, hashCanonical, CANONICAL_FORM_VERSION } from "./canonical.js";

const RECORD_RECEIPT = "RECORD_RECEIPT";
const CASE_RECEIPT = "CASE_RECEIPT";
const PACKET = "PACKET";

// Merkle leaf is domain-separated from internal nodes so a leaf hash can never
// be reinterpreted as an interior node (second-preimage hardening).
async function leafHash(objectHash) {
  return sha256Hex("L:" + objectHash);
}
async function nodeHash(left, right) {
  return sha256Hex("N:" + left + ":" + right);
}

/** Merkle root over an ordered list of object hashes. Odd nodes are promoted. */
export async function merkleRoot(objectHashes) {
  if (objectHashes.length === 0) return sha256Hex("EMPTY");
  let level = await Promise.all(objectHashes.map(leafHash));
  while (level.length > 1) {
    const next = [];
    for (let i = 0; i < level.length; i += 2) {
      if (i + 1 < level.length) next.push(await nodeHash(level[i], level[i + 1]));
      else next.push(level[i]); // promote the unpaired node unchanged
    }
    level = next;
  }
  return level[0];
}

/**
 * Build a packet from an ordered record stream (e.g. a PRR).
 * @param {object} caseRef   reference to the CaseSpace being sealed (id/lane/owner)
 * @param {Array}  records   ordered canonical objects (the PRR entries)
 * @param {object} meta      closing metadata (closed_at, closed_by, ...) — must be deterministic
 */
export async function buildPacket(caseRef, records, meta = {}) {
  const items = await Promise.all(
    records.map(async (record, i) => ({
      seq: i + 1,
      record,
      receipt: {
        object: RECORD_RECEIPT,
        canonical_form_version: CANONICAL_FORM_VERSION,
        seq: i + 1,
        object_hash: await hashCanonical(record),
      },
    })),
  );

  const root = await merkleRoot(items.map((it) => it.receipt.object_hash));

  const caseReceipt = {
    object: CASE_RECEIPT,
    canonical_form_version: CANONICAL_FORM_VERSION,
    casespace: caseRef,
    record_count: items.length,
    merkle_root: root,
    ...meta,
  };
  // The CaseReceipt commits to itself too, so its own metadata can't be edited.
  caseReceipt.receipt_hash = await hashCanonical({ ...caseReceipt, receipt_hash: undefined });

  return {
    object: PACKET,
    canonical_form_version: CANONICAL_FORM_VERSION,
    case_receipt: caseReceipt,
    items,
  };
}

/**
 * Verify a packet offline. Re-derives every Record Receipt, the Merkle root,
 * and the CaseReceipt self-hash. Returns a structured verdict, never throws on
 * a bad packet (only on a malformed one).
 */
export async function verifyPacket(packet) {
  const failures = [];
  if (!packet || packet.object !== PACKET) return { ok: false, failures: ["not a packet"] };
  if (packet.canonical_form_version !== CANONICAL_FORM_VERSION) {
    return { ok: false, failures: ["unknown canonical-form version"] };
  }

  const cr = packet.case_receipt;
  const items = packet.items ?? [];

  // 1. Set completeness: count and sequence integrity.
  if (cr.record_count !== items.length) {
    failures.push(`record_count ${cr.record_count} != ${items.length} items (omission/insertion)`);
  }
  items.forEach((it, i) => {
    if (it.seq !== i + 1) failures.push(`item ${i} has seq ${it.seq}, expected ${i + 1} (reordered)`);
  });

  // 2. Per-record integrity: each object still hashes to its receipt.
  for (const it of items) {
    const derived = await hashCanonical(it.record);
    if (derived !== it.receipt.object_hash) {
      failures.push(`record seq ${it.seq} altered (hash mismatch)`);
    }
  }

  // 3. Set commitment: the Merkle root over the receipts must match the CaseReceipt.
  const root = await merkleRoot(items.map((it) => it.receipt.object_hash));
  if (root !== cr.merkle_root) failures.push("merkle_root mismatch (set altered/omitted)");

  // 4. CaseReceipt self-integrity: its own metadata can't have been edited.
  const selfHash = await hashCanonical({ ...cr, receipt_hash: undefined });
  if (selfHash !== cr.receipt_hash) failures.push("case_receipt metadata altered");

  return { ok: failures.length === 0, failures, merkle_root: root };
}

export { canonicalize };
