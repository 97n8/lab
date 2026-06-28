// Canonical Form v1 — adversarial test harness.
//
// The grader's bet: "If the canonical form survives real-world messy inputs,
// the rest of the verifiable-record plan is highly likely to succeed." So this
// suite is deliberately hostile — key reordering, Unicode composed/decomposed,
// CRLF vs LF, number edge cases, nesting, and tamper detection. Two honest
// verifiers must derive the same bytes; an altered object must fail its receipt.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  canonicalize,
  hashCanonical,
  makeReceipt,
  verifyReceipt,
  CANONICAL_FORM_VERSION,
} from "../src/canonical.js";

// ---- Determinism: key order must not matter ---------------------------------

test("object key order does not change the canonical bytes", () => {
  const a = { problem: "leak", lane: "STAY", owner: "kim" };
  const b = { owner: "kim", lane: "STAY", problem: "leak" };
  assert.equal(canonicalize(a), canonicalize(b));
});

test("keys are sorted lexically by code point, not insertion order", () => {
  const out = canonicalize({ b: 1, a: 2, c: 3 });
  assert.equal(out, '{"a":2,"b":1,"c":3}');
});

test("code-point sort puts ASCII before higher planes (z before é before 😀)", () => {
  // 'z' U+007A < 'é' U+00E9 < '😀' U+1F600
  const out = canonicalize({ "😀": 1, "é": 2, z: 3 });
  assert.equal(out, '{"z":3,"é":2,"😀":1}');
});

// ---- Unicode normalization --------------------------------------------------

test("NFC composed and decomposed forms hash identically (values)", async () => {
  const composed = { name: "café" }; // é = U+00E9
  const decomposed = { name: "café" }; // e + combining acute
  assert.notEqual(composed.name, decomposed.name); // genuinely different in memory
  assert.equal(canonicalize(composed), canonicalize(decomposed));
  assert.equal(await hashCanonical(composed), await hashCanonical(decomposed));
});

test("NFC normalization also applies to keys", () => {
  const composed = canonicalize({ "café": 1 });
  const decomposed = canonicalize({ "café": 1 });
  assert.equal(composed, decomposed);
});

test("keys that collide only after NFC are rejected as ambiguous", () => {
  assert.throws(
    () => canonicalize({ "café": 1, "café": 2 }),
    /collide after NFC/,
  );
});

// ---- Line endings -----------------------------------------------------------

test("CRLF, CR, and LF in a string all canonicalize to LF", () => {
  const lf = canonicalize({ note: "line1\nline2" });
  const crlf = canonicalize({ note: "line1\r\nline2" });
  const cr = canonicalize({ note: "line1\rline2" });
  assert.equal(lf, crlf);
  assert.equal(lf, cr);
});

// ---- Numbers ----------------------------------------------------------------

test("1, 1.0, and 1.00 all canonicalize to the same bytes", () => {
  assert.equal(canonicalize(1), "1");
  assert.equal(canonicalize(1.0), "1");
  assert.equal(canonicalize(1.00), "1");
});

test("negative zero normalizes to 0", () => {
  assert.equal(canonicalize(-0), "0");
  assert.equal(canonicalize(0), "0");
});

test("ordinary decimals and negatives serialize plainly", () => {
  assert.equal(canonicalize(3.14), "3.14");
  assert.equal(canonicalize(-42), "-42");
});

test("NaN and Infinity are rejected", () => {
  assert.throws(() => canonicalize(NaN), /non-finite/);
  assert.throws(() => canonicalize(Infinity), /non-finite/);
  assert.throws(() => canonicalize(-Infinity), /non-finite/);
});

test("numbers that need an exponent are rejected (must be string-typed)", () => {
  assert.throws(() => canonicalize(1e21), /exponent/);
  assert.throws(() => canonicalize(1e-7), /exponent/);
});

test("money should be string-typed and survives exactly", () => {
  const a = canonicalize({ amount: "1499.00", currency: "USD" });
  assert.equal(a, '{"amount":"1499.00","currency":"USD"}');
});

// ---- Arrays preserve order --------------------------------------------------

test("array order is semantic and preserved", () => {
  assert.notEqual(canonicalize([1, 2, 3]), canonicalize([3, 2, 1]));
  assert.equal(canonicalize(["a", "b"]), '["a","b"]');
});

test("arrays of objects normalize each element's keys but keep element order", () => {
  const out = canonicalize([{ b: 1, a: 2 }, { d: 3, c: 4 }]);
  assert.equal(out, '[{"a":2,"b":1},{"c":4,"d":3}]');
});

// ---- undefined / null -------------------------------------------------------

test("undefined object values are dropped; null is kept", () => {
  assert.equal(canonicalize({ a: undefined, b: null }), '{"b":null}');
});

test("an object with a key set to undefined equals the object without it", () => {
  assert.equal(canonicalize({ a: 1, b: undefined }), canonicalize({ a: 1 }));
});

// ---- Unsupported types ------------------------------------------------------

test("functions and symbols are rejected, not silently coerced", () => {
  assert.throws(() => canonicalize({ f: () => 1 }), /unsupported type/);
  assert.throws(() => canonicalize(Symbol("x")), /unsupported type/);
});

// ---- No insignificant whitespace, escaping ----------------------------------

test("no insignificant whitespace appears in output", () => {
  const out = canonicalize({ a: 1, b: [1, 2], c: { d: 3 } });
  assert.equal(out, '{"a":1,"b":[1,2],"c":{"d":3}}');
  assert.ok(!/\s/.test(out));
});

test("quotes and backslashes inside strings are escaped deterministically", () => {
  assert.equal(canonicalize('a"b\\c'), '"a\\"b\\\\c"');
});

// ---- Nested determinism: two honest verifiers, messy input ------------------

test("a deeply nested messy object hashes the same regardless of key order", async () => {
  const fromToolA = {
    casespace: { lane: "MUNI", id: "cs_7", owner: { name: "José\r\n", role: "clerk" } },
    events: [
      { kind: "FORM", at: "2026-06-28T10:00:00Z", seq: 1 },
      { kind: "EVIDENCE", at: "2026-06-28T10:05:00Z", seq: 2 },
    ],
    amount: "0.00",
  };
  const fromToolB = {
    amount: "0.00",
    events: [
      { seq: 1, at: "2026-06-28T10:00:00Z", kind: "FORM" },
      { at: "2026-06-28T10:05:00Z", seq: 2, kind: "EVIDENCE" },
    ],
    casespace: { owner: { role: "clerk", name: "José\n" }, id: "cs_7", lane: "MUNI" },
  };
  assert.equal(await hashCanonical(fromToolA), await hashCanonical(fromToolB));
});

// ---- Hashing & receipts -----------------------------------------------------

test("hash is a 64-char hex SHA-256 digest", async () => {
  const h = await hashCanonical({ ok: true });
  assert.match(h, /^[0-9a-f]{64}$/);
});

test("the empty object has the canonical-form SHA-256 of '{}'", async () => {
  // sha256("{}") — stable anchor that a third party can reproduce.
  assert.equal(
    await hashCanonical({}),
    "44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a",
  );
});

test("a receipt verifies against its original object", async () => {
  const obj = { problem: "leak under sink", lane: "STAY", amount: "120.00" };
  const receipt = await makeReceipt(obj, { by: "runtime" });
  assert.equal(receipt.canonical_form_version, CANONICAL_FORM_VERSION);
  assert.match(receipt.object_hash, /^[0-9a-f]{64}$/);
  assert.equal(receipt.by, "runtime");
  assert.equal(await verifyReceipt(obj, receipt), true);
});

test("tampering with any field fails verification", async () => {
  const obj = { problem: "leak under sink", lane: "STAY", amount: "120.00" };
  const receipt = await makeReceipt(obj);
  const tampered = { ...obj, amount: "1200.00" };
  assert.equal(await verifyReceipt(tampered, receipt), false);
});

test("reordering keys does NOT fail verification (canonical form absorbs it)", async () => {
  const obj = { problem: "leak", lane: "STAY", amount: "120.00" };
  const receipt = await makeReceipt(obj);
  const reordered = { amount: "120.00", lane: "STAY", problem: "leak" };
  assert.equal(await verifyReceipt(reordered, receipt), true);
});

test("a receipt with a mismatched canonical-form version is rejected", async () => {
  const obj = { a: 1 };
  const receipt = await makeReceipt(obj);
  assert.equal(await verifyReceipt(obj, { ...receipt, canonical_form_version: "v0" }), false);
  assert.equal(await verifyReceipt(obj, null), false);
});
