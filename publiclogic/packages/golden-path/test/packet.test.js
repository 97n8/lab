// Packet Builder prototype — proves the seal exposes both alteration and
// omission, offline, with placeholder data. If this holds with messy ordered
// records, the verifiable-record plan's spine is de-risked.
//
// A sealed packet is deep-frozen, so a "tamper" can't edit it in place — it must
// produce a NEW packet, which verification then re-derives from bytes and
// rejects. That's the point: the packet catches alteration, not the editor.

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPacket, verifyPacket, merkleRoot } from "../src/packet.js";
import { hashCanonical } from "../src/canonical.js";

const CASE_REF = { id: "cs_demo_1", lane: "BIZ", owner: "kim" };
const META = { closed_at: "2026-06-28T16:05:00Z", closed_by: "kim" };
const records = () => [
  { seq: 1, kind: "FORM", event: "FORM submitted — CaseSpace opened", by: "kim", at: "2026-06-28T09:00:00Z" },
  { seq: 2, kind: "EVIDENCE", event: "before photo attached", by: "kim", at: "2026-06-28T09:30:00Z" },
  { seq: 3, kind: "TIME", event: "Start Work", by: "kim", at: "2026-06-28T09:31:00Z" },
  { seq: 4, kind: "DECISION", event: "change order approved", by: "client", at: "2026-06-28T11:00:00Z" },
  { seq: 5, kind: "TIME", event: "End Day", by: "kim", at: "2026-06-28T16:00:00Z" },
];

// An attacker can't edit the sealed packet in place; they hand over a new one.
function tamperRecord(packet, idx, patch) {
  return {
    ...packet,
    items: packet.items.map((it, i) => (i === idx ? { ...it, record: { ...it.record, ...patch } } : it)),
  };
}

test("a freshly built packet verifies clean", async () => {
  const packet = await buildPacket(CASE_REF, records(), META);
  const verdict = await verifyPacket(packet);
  assert.equal(verdict.ok, true, JSON.stringify(verdict.failures));
  assert.equal(packet.case_receipt.record_count, 5);
  assert.match(packet.case_receipt.merkle_root, /^[0-9a-f]{64}$/);
});

test("the build is deterministic — same inputs, same root", async () => {
  const a = await buildPacket(CASE_REF, records(), META);
  const b = await buildPacket(CASE_REF, records(), META);
  assert.equal(a.case_receipt.merkle_root, b.case_receipt.merkle_root);
  assert.equal(a.case_receipt.receipt_hash, b.case_receipt.receipt_hash);
});

// ---- Immutability / independence of the seal --------------------------------

test("a sealed packet is deep-frozen — in-place edits throw", async () => {
  const packet = await buildPacket(CASE_REF, records(), META);
  assert.ok(Object.isFrozen(packet));
  assert.ok(Object.isFrozen(packet.items));
  assert.ok(Object.isFrozen(packet.items[3].record));
  assert.ok(Object.isFrozen(packet.case_receipt));
  assert.throws(() => { packet.items[3].record.by = "kim"; }, TypeError);
});

test("editing the caller's records AFTER sealing does not change the packet", async () => {
  const src = records();
  const packet = await buildPacket(CASE_REF, src, META);
  const sealedHash = packet.items[3].receipt.object_hash;
  src[3].by = "kim"; // mutate the original after the seal
  assert.equal(packet.items[3].record.by, "client"); // packet kept its snapshot
  assert.equal(packet.items[3].receipt.object_hash, sealedHash);
  assert.equal((await verifyPacket(packet)).ok, true);
});

// ---- Alteration -------------------------------------------------------------

test("ALTERATION: editing a record after sealing fails verification", async () => {
  const packet = await buildPacket(CASE_REF, records(), META);
  const tampered = tamperRecord(packet, 3, { by: "kim" });
  const verdict = await verifyPacket(tampered);
  assert.equal(verdict.ok, false);
  assert.ok(verdict.failures.some((f) => /seq 4 altered \(hash mismatch\)/.test(f)));
});

test("the packet — not the editor — catches it: re-derived hash != sealed receipt", async () => {
  const packet = await buildPacket(CASE_REF, records(), META);
  const tampered = tamperRecord(packet, 3, { by: "kim" });
  const sealed = packet.items[3].receipt.object_hash;
  const recomputed = await hashCanonical(tampered.items[3].record);
  assert.notEqual(recomputed, sealed); // the proof is a hash mismatch, not a UI diff
  assert.equal((await verifyPacket(tampered)).ok, false);
});

test("ALTERATION is caught even if the attacker fixes the inner receipt hash", async () => {
  const packet = await buildPacket(CASE_REF, records(), META);
  // Smarter tamper: change the record AND recompute its receipt hash so the
  // per-record check passes — the Merkle root (committed in the CaseReceipt)
  // still exposes it.
  const newRecord = { ...packet.items[3].record, by: "kim" };
  const tampered = {
    ...packet,
    items: packet.items.map((it, i) =>
      i === 3 ? { ...it, record: newRecord, receipt: { ...it.receipt } } : it,
    ),
  };
  tampered.items[3].receipt.object_hash = await hashCanonical(newRecord);
  const verdict = await verifyPacket(tampered);
  assert.equal(verdict.ok, false);
  assert.ok(verdict.failures.some((f) => /merkle_root mismatch/.test(f)));
});

// ---- Omission ---------------------------------------------------------------

test("OMISSION: dropping a record is exposed by count + root", async () => {
  const packet = await buildPacket(CASE_REF, records(), META);
  const tampered = { ...packet, items: packet.items.filter((_, i) => i !== 3) };
  const verdict = await verifyPacket(tampered);
  assert.equal(verdict.ok, false);
  assert.ok(verdict.failures.some((f) => /omission|merkle_root mismatch/.test(f)));
});

test("OMISSION hidden by also editing the count is still caught by the root", async () => {
  const packet = await buildPacket(CASE_REF, records(), META);
  const kept = packet.items.filter((_, i) => i !== 3).map((it, i) => ({ ...it, seq: i + 1 }));
  const tampered = {
    ...packet,
    items: kept,
    case_receipt: { ...packet.case_receipt, record_count: kept.length },
  };
  const verdict = await verifyPacket(tampered);
  assert.equal(verdict.ok, false);
  assert.ok(verdict.failures.some((f) => /merkle_root mismatch/.test(f)));
});

test("REORDER: swapping two records is exposed", async () => {
  const packet = await buildPacket(CASE_REF, records(), META);
  const items = [...packet.items];
  [items[1], items[2]] = [items[2], items[1]];
  const verdict = await verifyPacket({ ...packet, items });
  assert.equal(verdict.ok, false);
});

test("CASE RECEIPT TAMPER: editing closing metadata fails the self-hash", async () => {
  const packet = await buildPacket(CASE_REF, records(), META);
  const tampered = { ...packet, case_receipt: { ...packet.case_receipt, closed_by: "someone_else" } };
  const verdict = await verifyPacket(tampered);
  assert.equal(verdict.ok, false);
  assert.ok(verdict.failures.some((f) => /case_receipt metadata altered/.test(f)));
});

// ---- Edges ------------------------------------------------------------------

test("an empty CaseSpace still seals and verifies", async () => {
  const packet = await buildPacket(CASE_REF, [], META);
  const verdict = await verifyPacket(packet);
  assert.equal(verdict.ok, true);
  assert.equal(packet.case_receipt.record_count, 0);
});

test("merkleRoot is order-sensitive and stable", async () => {
  const a = await merkleRoot(["aa", "bb", "cc"]);
  const b = await merkleRoot(["cc", "bb", "aa"]);
  const c = await merkleRoot(["aa", "bb", "cc"]);
  assert.notEqual(a, b);
  assert.equal(a, c);
});

test("a non-packet is rejected, not crashed on", async () => {
  assert.equal((await verifyPacket(null)).ok, false);
  assert.equal((await verifyPacket({ object: "NOPE" })).ok, false);
});
