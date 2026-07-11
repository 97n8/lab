import { test } from "node:test";
import assert from "node:assert/strict";
import { syncCases } from "../src/cases.js";
import {
  sealCases,
  verifySeal,
  receiptForCase,
  verifyCaseReceipt,
} from "../src/index.js";

// Deterministic inputs — real cases from the real pipeline, then sealed.
const TS = "2026-07-11T00:00:00.000Z";
const NOW = "2026-07-11";

function sampleCases() {
  const events = [
    { uid: "abc-1", start: "2026-07-20", end: "2026-07-24", summary: "Reserved (Airbnb)", description: "" },
    { uid: "def-2", start: "2026-07-25", end: "2026-07-27", summary: "Reserved (Airbnb)", description: "" },
  ];
  return syncCases({ events, nowDate: NOW, existing: [], timestamp: TS }).cases;
}

test("a booking earns a Record Receipt, and verify re-derives it from the bytes", async () => {
  const booking = sampleCases().find((c) => c.case_type === "BOOKING");
  const receipt = await receiptForCase(booking, { at: TS });
  assert.equal(receipt.object, "RECEIPT");
  assert.match(receipt.object_hash, /^[0-9a-f]{64}$/);
  assert.equal(await verifyCaseReceipt(booking, receipt), true);
});

test("tampering a booking's bytes fails its receipt", async () => {
  const booking = sampleCases().find((c) => c.case_type === "BOOKING");
  const receipt = await receiptForCase(booking, { at: TS });
  const tampered = { ...booking, guest_name: "Someone Else" };
  assert.equal(await verifyCaseReceipt(tampered, receipt), false);
});

test("the full case set seals into a packet that verifies offline", async () => {
  const cases = sampleCases();
  const packet = await sealCases(cases, { at: TS });
  assert.equal(packet.object, "PACKET");
  assert.equal(packet.case_receipt.record_count, cases.length);
  assert.match(packet.case_receipt.merkle_root, /^[0-9a-f]{64}$/);
  const v = await verifySeal(packet);
  assert.equal(v.ok, true, JSON.stringify(v.failures));
});

test("altering a sealed record makes the packet fail — tamper-evident", async () => {
  const packet = await sealCases(sampleCases(), { at: TS });
  // A real tamper is a NEW packet with altered bytes (the original is frozen).
  const forged = structuredClone(packet);
  forged.items[0].record.guest_name = "Someone Else";
  const v = await verifySeal(forged);
  assert.equal(v.ok, false);
  assert.ok(v.failures.some((f) => /altered|hash/.test(f)), JSON.stringify(v.failures));
});

test("omitting a record from the set is caught (not just alteration)", async () => {
  const packet = await sealCases(sampleCases(), { at: TS });
  const forged = structuredClone(packet);
  forged.items.pop(); // silently drop the last sealed record
  const v = await verifySeal(forged);
  assert.equal(v.ok, false);
  assert.ok(v.failures.some((f) => /record_count|merkle/.test(f)), JSON.stringify(v.failures));
});

test("sealing the same set twice is deterministic (same Merkle root)", async () => {
  const cases = sampleCases();
  const a = await sealCases(cases, { at: TS });
  const b = await sealCases(cases, { at: TS });
  assert.equal(a.case_receipt.merkle_root, b.case_receipt.merkle_root);
});
