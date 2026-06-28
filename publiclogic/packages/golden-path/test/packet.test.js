// Packet Builder prototype — proves the seal exposes both alteration and
// omission, offline, with placeholder data. If this holds with messy ordered
// records, the verifiable-record plan's spine is de-risked.

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPacket, verifyPacket, merkleRoot } from "../src/packet.js";

// Placeholder closed-CaseSpace stream (shape mirrors a PRR: ordered, frozen-ish).
// Each test takes a fresh clone — buildPacket holds references to the records,
// so cloning keeps tampering in one test from leaking into the next.
const CASE_REF = { id: "cs_demo_1", lane: "BIZ", owner: "kim" };
const META = { closed_at: "2026-06-28T16:05:00Z", closed_by: "kim" };
const records = () => [
  { seq: 1, kind: "FORM", event: "FORM submitted — CaseSpace opened", by: "kim", at: "2026-06-28T09:00:00Z" },
  { seq: 2, kind: "EVIDENCE", event: "before photo attached", by: "kim", at: "2026-06-28T09:30:00Z" },
  { seq: 3, kind: "TIME", event: "Start Work", by: "kim", at: "2026-06-28T09:31:00Z" },
  { seq: 4, kind: "DECISION", event: "change order approved", by: "client", at: "2026-06-28T11:00:00Z" },
  { seq: 5, kind: "TIME", event: "End Day", by: "kim", at: "2026-06-28T16:00:00Z" },
];

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

test("ALTERATION: editing a record after sealing fails verification", async () => {
  const packet = await buildPacket(CASE_REF, records(), META);
  // Tamper: change the change-order from approved to a different actor.
  packet.items[3].record.by = "kim";
  const verdict = await verifyPacket(packet);
  assert.equal(verdict.ok, false);
  assert.ok(verdict.failures.some((f) => /seq 4 altered/.test(f)));
});

test("ALTERATION is caught even if the attacker fixes the inner receipt hash", async () => {
  const packet = await buildPacket(CASE_REF, records(), META);
  // Smarter tamper: change the record AND recompute its receipt hash so the
  // per-record check passes — the Merkle root (committed in the CaseReceipt)
  // still exposes it.
  const { hashCanonical } = await import("../src/canonical.js");
  packet.items[3].record.by = "kim";
  packet.items[3].receipt.object_hash = await hashCanonical(packet.items[3].record);
  const verdict = await verifyPacket(packet);
  assert.equal(verdict.ok, false);
  assert.ok(verdict.failures.some((f) => /merkle_root mismatch/.test(f)));
});

test("OMISSION: dropping a record is exposed by count + root", async () => {
  const packet = await buildPacket(CASE_REF, records(), META);
  packet.items.splice(3, 1); // silently remove the change-order approval
  const verdict = await verifyPacket(packet);
  assert.equal(verdict.ok, false);
  assert.ok(verdict.failures.some((f) => /omission|merkle_root mismatch/.test(f)));
});

test("OMISSION hidden by also editing the count is still caught by the root", async () => {
  const packet = await buildPacket(CASE_REF, records(), META);
  packet.items.splice(3, 1);
  // Re-seq and fix the count to hide the gap; root + caseReceipt self-hash catch it.
  packet.items.forEach((it, i) => (it.seq = i + 1));
  packet.case_receipt.record_count = packet.items.length;
  const verdict = await verifyPacket(packet);
  assert.equal(verdict.ok, false);
  assert.ok(verdict.failures.some((f) => /merkle_root mismatch/.test(f)));
});

test("REORDER: swapping two records is exposed", async () => {
  const packet = await buildPacket(CASE_REF, records(), META);
  const tmp = packet.items[1];
  packet.items[1] = packet.items[2];
  packet.items[2] = tmp;
  const verdict = await verifyPacket(packet);
  assert.equal(verdict.ok, false);
});

test("CASE RECEIPT TAMPER: editing closing metadata fails the self-hash", async () => {
  const packet = await buildPacket(CASE_REF, records(), META);
  packet.case_receipt.closed_by = "someone_else";
  const verdict = await verifyPacket(packet);
  assert.equal(verdict.ok, false);
  assert.ok(verdict.failures.some((f) => /case_receipt metadata altered/.test(f)));
});

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
