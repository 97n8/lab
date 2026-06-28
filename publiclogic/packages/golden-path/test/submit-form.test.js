// GP-002 into the verified spine — a FORM submission must earn a Record Receipt
// over its canonical bytes before it becomes a PRR event, and that receipt must
// verify (and fail on tamper).

import { test } from "node:test";
import assert from "node:assert/strict";
import { compileSeed, submitForm, openForm, verifyReceipt } from "../src/index.js";

const TS = "2026-06-28T12:00:00Z";
const ANSWERS = {
  role: "owner",
  problem: "Hot tub failed before a same-day turnover.",
  desired_outcome: "Repaired and cleaned before the next guest.",
  owner: "Nate",
  lane: "STAY",
};

function identity() {
  return compileSeed({ type: "airbnb", value: "airbnb.com/rooms/12345" }, { timestamp: TS });
}

test("a valid submission produces a Record Receipt over the FORM object", async () => {
  const r = await submitForm(identity(), ANSWERS, { timestamp: TS });
  assert.equal(r.valid, true);
  assert.ok(r.receipt, "receipt should exist");
  assert.equal(r.receipt.object_type, "FORM");
  assert.equal(r.receipt.object_id, r.form_entry.id);
  assert.match(r.receipt.object_hash, /^[0-9a-f]{64}$/);
});

test("the FORM object verifies against its own receipt", async () => {
  const r = await submitForm(identity(), ANSWERS, { timestamp: TS });
  assert.equal(await verifyReceipt(r.form_entry, r.receipt), true);
});

test("tampering with the FORM object after submit fails verification", async () => {
  const r = await submitForm(identity(), ANSWERS, { timestamp: TS });
  const altered = { ...r.form_entry, lane: "MUNI" };
  assert.equal(await verifyReceipt(altered, r.receipt), false);
});

test("the PRR FORM event is anchored to the receipt hash, not just the id", async () => {
  const r = await submitForm(identity(), ANSWERS, { timestamp: TS });
  assert.equal(r.prr[0].kind, "FORM");
  assert.equal(r.prr[0].ref, r.receipt.object_hash);
});

test("the CaseSpace intake is still built (order ends at intake object)", async () => {
  const r = await submitForm(identity(), ANSWERS, { timestamp: TS });
  const tabs = r.casespace.tabs_content;
  assert.equal(tabs.Intake.problem, ANSWERS.problem);
  assert.equal(r.casespace.status, "active");
});

test("an invalid submission yields no receipt and no PRR event", async () => {
  const r = await submitForm(identity(), { role: "owner" }, { timestamp: TS });
  assert.equal(r.valid, false);
  assert.equal(r.receipt, null);
  assert.equal(r.prr.length, 0);
  assert.ok(r.missing.includes("problem"));
});

test("submitForm matches openForm on everything except the verified additions", async () => {
  const base = openForm(identity(), ANSWERS, { timestamp: TS });
  const r = await submitForm(identity(), ANSWERS, { timestamp: TS });
  assert.deepEqual(r.form_entry, base.form_entry);
  assert.deepEqual(r.casespace, base.casespace);
});
