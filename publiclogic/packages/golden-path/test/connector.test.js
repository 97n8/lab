// PJ connector interface (Step 2) — proves the contract end to end on three
// source fixtures, and that the core (resolver + receipt) is source-agnostic.
//
// Acceptance: every fixture signal → a normalized PJObject → a CaseSpaceAction →
// a Receipt carrying source/timestamp/signalId/objectId/action/preserved=true.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  toSignal,
  toPJObject,
  resolveCaseSpace,
  emitReceipt,
  defineConnector,
  CASE_ACTIONS,
} from "../src/index.js";
import { SAMPLE_CONNECTORS, SAMPLE_INPUTS } from "../src/connectors/samples.js";

// A CaseSpace the reservation + its document both belong to.
const EXISTING = [{ id: "stay:Kendall Pond Lodge:2026-07-03", type: "stay" }];

// ---- End-to-end over all three fixtures ------------------------------------

test("every fixture runs receive → normalize → resolve → receipt", async () => {
  for (const key of Object.keys(SAMPLE_INPUTS)) {
    const { connector, input } = SAMPLE_INPUTS[key];
    const c = SAMPLE_CONNECTORS[connector];
    const { signal, object, action, receipt } = await c.process(input, { existing: EXISTING });

    // a Signal
    assert.match(signal.id, /^sig_[0-9a-z]{6}$/, `${key} signal id`);
    assert.equal(signal.source, connector === "drive" ? "drive" : connector);

    // a PJObject
    assert.match(object.id, /^obj_[0-9a-z]{6}$/, `${key} object id`);
    assert.ok(object.objectType.includes("."), `${key} objectType namespaced`);
    assert.ok(object.title, `${key} has a title`);

    // a CaseSpaceAction
    assert.ok(CASE_ACTIONS.includes(action.action), `${key} action valid`);
    assert.ok(action.reason, `${key} action has a reason`);

    // a Receipt — the moat
    assert.match(receipt.id, /^rcpt_[0-9a-z]{6}$/, `${key} receipt id`);
    assert.equal(receipt.signalId, signal.id);
    assert.equal(receipt.objectId, object.id);
    assert.equal(receipt.source, signal.source);
    assert.equal(receipt.preserved, true);
    assert.ok(receipt.timestamp, `${key} receipt timestamped`);
    assert.match(receipt.checksum, /^[0-9a-f]{64}$/, `${key} receipt checksum`);
    assert.ok(receipt.action.length > 0);
  }
});

// ---- The resolver makes the three different placement calls -----------------

test("airbnb reservation OPENS a new CaseSpace when none exists", async () => {
  const { connector, input } = SAMPLE_INPUTS.airbnb;
  const { action, receipt } = await SAMPLE_CONNECTORS[connector].process(input, { existing: [] });
  assert.equal(action.action, "open");
  assert.equal(action.caseSpaceType, "stay");
  assert.equal(receipt.action, "opened_casespace");
});

test("airbnb reservation APPENDS when its CaseSpace already exists", async () => {
  const { connector, input } = SAMPLE_INPUTS.airbnb;
  const { action, receipt } = await SAMPLE_CONNECTORS[connector].process(input, { existing: EXISTING });
  assert.equal(action.action, "append");
  assert.equal(action.caseSpaceId, "stay:Kendall Pond Lodge:2026-07-03");
  assert.equal(receipt.action, "appended_to_casespace");
  assert.equal(receipt.caseSpaceId, "stay:Kendall Pond Lodge:2026-07-03");
});

test("the uploaded document APPENDS to the matching reservation CaseSpace", async () => {
  const { connector, input } = SAMPLE_INPUTS.drive;
  const { action } = await SAMPLE_CONNECTORS[connector].process(input, { existing: EXISTING });
  assert.equal(action.action, "append");
  assert.equal(action.caseSpaceId, "stay:Kendall Pond Lodge:2026-07-03");
});

test("the gmail message OPENS (its threadHint matches nothing)", async () => {
  const { connector, input } = SAMPLE_INPUTS.gmail;
  // give it a hint so it has something to resolve, but no matching CaseSpace
  const withHint = { ...input, threadHint: "stay:unknown:2026-07-03" };
  const { action } = await SAMPLE_CONNECTORS[connector].process(withHint, { existing: EXISTING });
  assert.equal(action.action, "open");
});

// ---- Resolver edge calls: needs_review and ignore --------------------------

test("a low-confidence object NEEDS REVIEW", () => {
  const obj = toPJObject({ objectType: "stay.message", title: "??", suggestedCaseSpace: "x", confidence: 0.3, metadata: {} });
  assert.equal(resolveCaseSpace(obj, { existing: [] }).action, "needs_review");
});

test("an object with no CaseSpace suggestion NEEDS REVIEW", () => {
  const obj = toPJObject({ objectType: "stay.note", title: "loose note", confidence: 0.9, metadata: {} });
  assert.equal(resolveCaseSpace(obj).action, "needs_review");
});

test("a normalizer ignore-hint is honored", () => {
  const obj = toPJObject({ objectType: "stay.message", title: "auto-reply", confidence: 0.99, suggestedCaseSpace: "x", metadata: { disposition: "ignore" } });
  assert.equal(resolveCaseSpace(obj, { existing: [{ id: "x" }] }).action, "ignore");
});

// ---- The core is source-agnostic -------------------------------------------

test("identical PJObjects resolve identically regardless of source", () => {
  const a = toPJObject({ objectType: "stay.thing", title: "T", suggestedCaseSpace: "cs1", confidence: 0.9, metadata: { source: "gmail" } });
  const b = toPJObject({ objectType: "stay.thing", title: "T", suggestedCaseSpace: "cs1", confidence: 0.9, metadata: { source: "airbnb" } });
  const ra = resolveCaseSpace(a, { existing: [{ id: "cs1" }] });
  const rb = resolveCaseSpace(b, { existing: [{ id: "cs1" }] });
  assert.deepEqual({ ...ra }, { ...rb }); // same decision; the source didn't matter
});

test("a custom connector with only receive+normalize inherits core resolve+receipt", async () => {
  const custom = defineConnector({
    source: "inspection",
    async receive(i) {
      return toSignal({ source: "inspection", signalType: "inspection.completed", sourceId: i.id, occurredAt: i.at, payload: { result: i.result } });
    },
    async normalize(s) {
      return toPJObject({ objectType: "muni.inspection", title: `Inspection ${s.sourceId}`, suggestedCaseSpace: "permit:42", confidence: 0.88, metadata: {} });
    },
  });
  const { action, receipt } = await custom.process({ id: "INS-1", at: "2026-06-28T10:00:00Z", result: "pass" }, { existing: [{ id: "permit:42" }] });
  assert.equal(action.action, "append");
  assert.equal(receipt.source, "inspection");
  assert.equal(receipt.preserved, true);
});

// ---- Determinism / idempotency ---------------------------------------------

test("the same inbound event is content-addressed to the same signal + object", async () => {
  const { connector, input } = SAMPLE_INPUTS.airbnb;
  const a = await SAMPLE_CONNECTORS[connector].process(input, { existing: EXISTING });
  const b = await SAMPLE_CONNECTORS[connector].process(input, { existing: EXISTING });
  assert.equal(a.signal.id, b.signal.id);
  assert.equal(a.object.id, b.object.id);
  assert.equal(a.receipt.checksum, b.receipt.checksum);
});

test("the receipt checksum changes if the placed object changes", async () => {
  const signal = toSignal({ source: "x", signalType: "t", occurredAt: "2026-06-28T00:00:00Z", payload: { a: 1 } });
  const o1 = toPJObject({ objectType: "x.y", title: "one", metadata: {} });
  const o2 = toPJObject({ objectType: "x.y", title: "two", metadata: {} });
  const r1 = await emitReceipt({ signal, object: o1, action: { action: "open", reason: "" } });
  const r2 = await emitReceipt({ signal, object: o2, action: { action: "open", reason: "" } });
  assert.notEqual(r1.checksum, r2.checksum);
});

// ---- Validation -------------------------------------------------------------

test("toSignal and toPJObject reject missing required fields", () => {
  assert.throws(() => toSignal({ signalType: "t", occurredAt: "x", payload: {} }), /source is required/);
  assert.throws(() => toSignal({ source: "s", occurredAt: "x", payload: {} }), /signalType is required/);
  assert.throws(() => toSignal({ source: "s", signalType: "t", payload: {} }), /occurredAt/);
  assert.throws(() => toPJObject({ title: "t" }), /objectType is required/);
  assert.throws(() => toPJObject({ objectType: "a.b" }), /title is required/);
});

test("defineConnector requires source, receive, and normalize", () => {
  assert.throws(() => defineConnector({ receive() {}, normalize() {} }), /source name is required/);
  assert.throws(() => defineConnector({ source: "s", normalize() {} }), /receive\(\) is required/);
  assert.throws(() => defineConnector({ source: "s", receive() {} }), /normalize\(\) is required/);
});
