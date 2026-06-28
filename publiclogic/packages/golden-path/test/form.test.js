import { test } from "node:test";
import assert from "node:assert/strict";
import { compileSeed, openForm, deriveFormDefaults } from "../src/index.js";

const TS = "2026-06-28T00:00:00.000Z";
const identity = compileSeed({ type: "airbnb", value: "airbnb.com/rooms/12345" }, { timestamp: TS });

test("the form is pre-grounded by the identity (it already knows)", () => {
  const d = deriveFormDefaults(identity);
  assert.equal(d.source, "airbnb.com/rooms/12345"); // from the Source Profile
  assert.equal(d.lane, "STAY"); // from the GP-001 lane guess
});

test("a complete intake opens a valid CaseSpace + first PRR entry", () => {
  const r = openForm(
    identity,
    { role: "owner", problem: "Hot tub broke before a turnover.", desired_outcome: "Fixed and cleaned before next guest.", owner: "Nate", lane: "STAY", deadline: "2026-07-01" },
    { timestamp: TS }
  );
  assert.equal(r.valid, true);
  assert.deepEqual(r.missing, []);
  assert.equal(r.casespace.status, "active");
  assert.equal(r.casespace.form_entry_id, r.form_entry.id);
  assert.equal(r.prr.length, 1);
  assert.equal(r.prr[0].event, "FORM submitted — CaseSpace opened");
});

test("missing required answers block a valid open", () => {
  // airbnb identity grounds the lane (STAY) from the guess, so only the
  // genuinely-new answers are missing.
  const r = openForm(identity, { role: "owner" }, { timestamp: TS });
  assert.equal(r.valid, false);
  assert.ok(r.missing.includes("problem"));
  assert.ok(r.missing.includes("desired_outcome"));
  assert.ok(!r.missing.includes("lane")); // grounded by the lane guess
  assert.equal(r.prr.length, 0); // nothing recorded until it's valid
});

test("lane is required when there is no lane guess to ground it", () => {
  const blank = compileSeed({ type: "scratch", value: "" }, { timestamp: TS }); // lane_guess null
  const r = openForm(blank, { problem: "p", desired_outcome: "d" }, { timestamp: TS });
  assert.equal(r.valid, false);
  assert.ok(r.missing.includes("lane"));
});

test("the form entry and CaseSpace attach to the Source Profile", () => {
  const r = openForm(identity, { problem: "x", desired_outcome: "y", lane: "STAY" }, { timestamp: TS });
  assert.equal(r.form_entry.source_profile_id, identity.source_profile.id);
  assert.equal(r.casespace.source_profile_id, identity.source_profile.id);
});

test("confirmed lane overrides the GP-001 lane guess", () => {
  // identity guessed STAY; operator confirms PROJECT
  const r = openForm(identity, { problem: "x", desired_outcome: "y", lane: "PROJECT" }, { timestamp: TS });
  assert.equal(r.form_entry.lane, "PROJECT");
  assert.equal(r.casespace.lane, "PROJECT");
});

test("intake carries the answers and the known facts from the seed", () => {
  const r = openForm(identity, { role: "owner", problem: "p", desired_outcome: "d", lane: "STAY" }, { timestamp: TS });
  assert.equal(r.casespace.tabs_content.Intake.problem, "p");
  assert.equal(r.casespace.tabs_content.Intake.known.name, "Airbnb Listing 12345");
  assert.equal(r.casespace.tabs_content.Overview.desired_outcome, "d");
});

test("open is deterministic — same identity + answers, same form id", () => {
  const args = [identity, { problem: "p", desired_outcome: "d", lane: "STAY" }, { timestamp: TS }];
  assert.equal(openForm(...args).form_entry.id, openForm(...args).form_entry.id);
});
