import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { AUDIT_EVENT_FAMILIES, isKnownFamily } from "../src/index.js";

// The closed family list is a promise. These tests are the promise's teeth:
// they pin the exact set AND the exact order, so a silent add/reorder fails CI.

test("the closed family list is exactly the six sealable families, in CHECK order", () => {
  // Byte-for-byte the audit_events CHECK in puddlejumper migration 001. If the
  // DB constraint and this list ever disagree, the seal can commit a family the
  // runtime cannot enumerate (or vice versa) — the exact failure the Bookend
  // Rule exists to prevent.
  assert.deepEqual(AUDIT_EVENT_FAMILIES, [
    "process",
    "transition",
    "role",
    "auth",
    "divergence",
    "system",
  ]);
});

test("the list is frozen — canon cannot be mutated at runtime", () => {
  assert.ok(Object.isFrozen(AUDIT_EVENT_FAMILIES));
  assert.throws(() => {
    AUDIT_EVENT_FAMILIES.push("ai_assist");
  });
});

test("isKnownFamily accepts every sealable family", () => {
  for (const f of AUDIT_EVENT_FAMILIES) assert.equal(isKnownFamily(f), true);
});

test("isKnownFamily rejects a dormant subtype-prefix that is NOT a family", () => {
  // `ai_assist.*` subtypes are declared in core but never emitted, and
  // `ai_assist` is not a sealable family — the DB CHECK would reject it. This is
  // the adversarial mapping case the cross-repo check must catch: a subtype
  // whose implied family does not exist.
  assert.equal(isKnownFamily("ai_assist"), false);
});

test("isKnownFamily rejects garbage and near-misses (case-sensitive)", () => {
  assert.equal(isKnownFamily("Process"), false); // case matters
  assert.equal(isKnownFamily("processes"), false); // no fuzzy match
  assert.equal(isKnownFamily(""), false);
  assert.equal(isKnownFamily(undefined), false);
});

test("the published families.json artifact matches the export (no silent drift)", () => {
  // families.json is what puddlejumper pins and verifies. If it drifts from
  // AUDIT_EVENT_FAMILIES, `node scripts/emit-families.mjs --check` fails
  // (STALE_ARTIFACT); this test catches the same drift inside the suite.
  const p = fileURLToPath(new URL("../families.json", import.meta.url));
  const artifact = JSON.parse(readFileSync(p, "utf8"));
  assert.deepEqual(artifact.families, AUDIT_EVENT_FAMILIES);
  assert.equal(artifact.schema, "publiclogic.golden-path.families/1");
  assert.equal(artifact.provenance.export, "AUDIT_EVENT_FAMILIES");
  assert.match(artifact.provenance.source_blob, /^[0-9a-f]{40}$/); // a real blob sha
});
