import { test } from "node:test";
import assert from "node:assert/strict";
import { compileSeed, openRuntime, punch, computeHours } from "../src/index.js";

const TS = "2026-06-28T00:00:00.000Z";
const identity = compileSeed({ type: "website", value: "sparkselectric.com" }, { timestamp: TS });
const rt0 = openRuntime(identity, { problem: "Panel upgrade at Smith Residence", desired_outcome: "Pass inspection", owner: "Sam", lane: "BIZ" }, { timestamp: TS });

test("punches write TIME entries to the recordstream — no timesheet", () => {
  let rt = punch(rt0, { type: "start", who: "Joe", at: "2026-06-28T07:01:00Z" });
  rt = punch(rt, { type: "end", who: "Joe", at: "2026-06-28T16:16:00Z" });
  assert.equal(rt.punches.length, 2);
  const time = rt.prr.filter((e) => e.kind === "TIME");
  assert.equal(time.length, 2);
  assert.match(time[0].event, /Started work — Joe/);
});

test("hours fall out of the punches (lunch deducted)", () => {
  const punches = [
    { type: "start", at: "2026-06-28T07:01:00Z" },
    { type: "lunch_out", at: "2026-06-28T12:02:00Z" },
    { type: "lunch_in", at: "2026-06-28T12:33:00Z" },
    { type: "end", at: "2026-06-28T16:16:00Z" },
  ];
  // 16:16 - 07:01 = 9h15m; minus 31m lunch = 8h44m = 8.73h
  assert.equal(computeHours(punches), 8.73);
});

test("start-to-end with no lunch", () => {
  assert.equal(computeHours([
    { type: "start", at: "2026-06-28T08:00:00Z" },
    { type: "end", at: "2026-06-28T12:00:00Z" },
  ]), 4);
});

test("incomplete punches return 0 hours", () => {
  assert.equal(computeHours([{ type: "start", at: "2026-06-28T08:00:00Z" }]), 0);
});
