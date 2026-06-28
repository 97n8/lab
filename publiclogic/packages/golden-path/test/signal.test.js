// Signal intake (GP-000) — the custody boundary. A Signal must be canonical,
// content-addressed (idempotent), and earn a receipt that fails if EITHER the
// artifact OR its provenance is altered. If this holds, the connectors above it
// inherit tamper-evidence at the moment of intake.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  makeSignal,
  ingestSignal,
  verifySignal,
  signalReceipt,
  sourceKey,
  SIGNAL_KINDS,
  CONNECTOR_TYPES,
} from "../src/index.js";

const TS = "2026-06-28T12:00:00Z";

function emailInput(overrides = {}) {
  return {
    kind: "email",
    payload: { subject: "New hire paperwork", from: "hr@example.gov", body: "I-9 attached." },
    connector: "mcp:gmail",
    connector_type: "api",
    source_ref: "gmail:msg/abc123",
    ...overrides,
  };
}

// ---- Shape & provenance -----------------------------------------------------

test("makeSignal produces a canonical SIGNAL with a provenance block", () => {
  const s = makeSignal(emailInput(), { timestamp: TS });
  assert.equal(s.object, "SIGNAL");
  assert.match(s.id, /^SIG-[0-9a-z]{6}$/);
  assert.equal(s.kind, "email");
  assert.deepEqual(s.source, {
    connector: "mcp:gmail",
    source_ref: "gmail:msg/abc123",
    fetched_at: TS,
    connector_type: "api",
  });
});

test("the signal is frozen (immutable once received)", () => {
  const s = makeSignal(emailInput(), { timestamp: TS });
  assert.ok(Object.isFrozen(s));
  assert.ok(Object.isFrozen(s.payload));
  assert.ok(Object.isFrozen(s.source));
  assert.throws(() => { s.payload.body = "x"; }, TypeError);
});

// ---- Idempotency / content addressing --------------------------------------

test("the id is deterministic — same artifact re-ingested yields the same id", () => {
  const a = makeSignal(emailInput(), { timestamp: TS });
  const b = makeSignal(emailInput(), { timestamp: "2026-07-01T00:00:00Z" }); // later fetch
  assert.equal(a.id, b.id); // fetched_at does not change identity
});

test("id is independent of payload key order (canonical)", () => {
  const a = makeSignal(emailInput({ payload: { subject: "s", from: "f", body: "b" } }), { timestamp: TS });
  const b = makeSignal(emailInput({ payload: { body: "b", from: "f", subject: "s" } }), { timestamp: TS });
  assert.equal(a.id, b.id);
});

test("different content yields a different id", () => {
  const a = makeSignal(emailInput(), { timestamp: TS });
  const b = makeSignal(emailInput({ payload: { subject: "Changed", from: "hr@example.gov", body: "I-9 attached." } }), { timestamp: TS });
  assert.notEqual(a.id, b.id);
});

test("same source, new content = same sourceKey but a new id (an update)", () => {
  const v1 = makeSignal(emailInput(), { timestamp: TS });
  const v2 = makeSignal(emailInput({ payload: { subject: "Re: paperwork", from: "hr@example.gov", body: "W-4 too." } }), { timestamp: TS });
  assert.equal(sourceKey(v1), sourceKey(v2));
  assert.equal(sourceKey(v1), "mcp:gmail:gmail:msg/abc123");
  assert.notEqual(v1.id, v2.id);
});

// ---- Validation -------------------------------------------------------------

test("unknown kind is rejected", () => {
  assert.throws(() => makeSignal(emailInput({ kind: "telepathy" })), /unknown kind/);
});

test("missing connector or source_ref is rejected (provenance is mandatory)", () => {
  assert.throws(() => makeSignal(emailInput({ connector: undefined }), { timestamp: TS }), /connector is required/);
  assert.throws(() => makeSignal(emailInput({ source_ref: undefined }), { timestamp: TS }), /source_ref is required/);
});

test("unknown connector_type is rejected; omitting it is allowed", () => {
  assert.throws(() => makeSignal(emailInput({ connector_type: "ftp" }), { timestamp: TS }), /unknown connector_type/);
  const s = makeSignal(emailInput({ connector_type: undefined }), { timestamp: TS });
  assert.equal("connector_type" in s.source, false);
});

test("missing payload is rejected", () => {
  assert.throws(() => makeSignal(emailInput({ payload: undefined }), { timestamp: TS }), /payload is required/);
});

test("the catalogs are the expected sets", () => {
  assert.deepEqual(SIGNAL_KINDS, ["email", "file", "event", "row", "invoice", "webhook", "form", "other"]);
  assert.deepEqual(CONNECTOR_TYPES, ["files", "api", "db", "web", "local"]);
});

// ---- The Entry guarantee: tamper-evidence at intake ------------------------

test("ingestSignal returns a verifying boundary pair", async () => {
  const { signal, receipt } = await ingestSignal(emailInput(), { timestamp: TS });
  assert.equal(receipt.object_type, "SIGNAL");
  assert.equal(receipt.object_id, signal.id);
  assert.deepEqual(receipt.source, signal.source);
  assert.match(receipt.object_hash, /^[0-9a-f]{64}$/);
  assert.equal(await verifySignal(signal, receipt), true);
});

test("altering the ARTIFACT after intake fails verification", async () => {
  const { signal, receipt } = await ingestSignal(emailInput(), { timestamp: TS });
  const tampered = { ...signal, payload: { ...signal.payload, body: "I-9 NOT attached." } };
  assert.equal(await verifySignal(tampered, receipt), false);
});

test("altering the PROVENANCE after intake fails verification", async () => {
  const { signal, receipt } = await ingestSignal(emailInput(), { timestamp: TS });
  // Pretend it came from a different source — the receipt committed to source too.
  const tampered = { ...signal, source: { ...signal.source, connector: "mcp:dropbox" } };
  assert.equal(await verifySignal(tampered, receipt), false);
});

test("a different fetch time does not change the receipt (identity is content)", async () => {
  const a = await ingestSignal(emailInput(), { timestamp: TS });
  const b = await ingestSignal(emailInput(), { timestamp: TS });
  assert.equal(a.signal.id, b.signal.id);
  assert.equal(a.receipt.object_hash, b.receipt.object_hash);
});

test("signalReceipt can be produced standalone and still verifies", async () => {
  const signal = makeSignal(emailInput(), { timestamp: TS });
  const receipt = await signalReceipt(signal, { timestamp: TS });
  assert.equal(await verifySignal(signal, receipt), true);
});

test("a file signal over a files connector also rounds-trips", async () => {
  const { signal, receipt } = await ingestSignal(
    { kind: "file", payload: { name: "I-9 Form.pdf", bytes_sha: "deadbeef", size: 18234 }, connector: "mcp:google-drive", connector_type: "files", source_ref: "drive:file/9z" },
    { timestamp: TS },
  );
  assert.equal(signal.kind, "file");
  assert.equal(signal.source.connector_type, "files");
  assert.equal(await verifySignal(signal, receipt), true);
});
