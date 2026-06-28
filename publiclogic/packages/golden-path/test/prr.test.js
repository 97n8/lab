import { test } from "node:test";
import assert from "node:assert/strict";
import {
  compileSeed, openRuntime, appendPRR,
  requestEvidence, provideEvidence, logDecision, runCAL, runPRM,
} from "../src/index.js";

const TS = "2026-06-28T00:00:00.000Z";
const identity = compileSeed({ type: "airbnb", value: "airbnb.com/rooms/12345" }, { timestamp: TS });
const ANSWERS = { problem: "Hot tub broke.", desired_outcome: "Fixed before next guest.", owner: "Nate", lane: "STAY" };

function open() {
  return openRuntime(identity, ANSWERS, { timestamp: TS });
}

test("PRR is append-only: input stream is never mutated", () => {
  const s0 = [];
  const s1 = appendPRR(s0, { kind: "NOTE", event: "first" }, { timestamp: TS });
  assert.equal(s0.length, 0); // original untouched
  assert.equal(s1.length, 1);
  assert.throws(() => { s1[0].event = "tampered"; }); // entries are frozen
});

test("seq is monotonic and equals index + 1", () => {
  let s = [];
  for (const e of ["a", "b", "c"]) s = appendPRR(s, { kind: "NOTE", event: e }, { timestamp: TS });
  assert.deepEqual(s.map((r) => r.seq), [1, 2, 3]);
});

test("an opened runtime starts with the FORM entry at seq 1", () => {
  const rt = open();
  assert.equal(rt.prr.length, 1);
  assert.equal(rt.prr[0].kind, "FORM");
  assert.equal(rt.prr[0].seq, 1);
});

test("evidence request writes back to PRR", () => {
  const rt = requestEvidence(open(), { item: "Vendor invoice", owner: "Nate" }, { timestamp: TS });
  assert.equal(rt.evidence.length, 1);
  assert.equal(rt.evidence[0].status, "requested");
  const last = rt.prr[rt.prr.length - 1];
  assert.equal(last.kind, "EVIDENCE");
  assert.match(last.event, /Evidence requested: Vendor invoice/);
});

test("PRM surfaces missing proof, then clears once evidence is provided", () => {
  let rt = requestEvidence(open(), { item: "Before/after photos" }, { timestamp: TS });
  rt = runPRM(rt, { milestone: "closeout" }, { timestamp: TS });
  let prm = rt.checks[rt.checks.length - 1];
  assert.equal(prm.ready, false);
  assert.deepEqual(prm.missing, ["Before/after photos"]);

  rt = provideEvidence(rt, { evidenceId: rt.evidence[0].id }, { timestamp: TS });
  rt = runPRM(rt, { milestone: "closeout" }, { timestamp: TS });
  prm = rt.checks[rt.checks.length - 1];
  assert.equal(prm.ready, true);
  assert.deepEqual(prm.missing, []);
});

test("decision writes back to PRR", () => {
  const rt = logDecision(open(), { decision: "Approve emergency vendor", basis: "guest arriving tonight" }, { timestamp: TS });
  assert.equal(rt.decisions.length, 1);
  assert.equal(rt.prr[rt.prr.length - 1].kind, "DECISION");
});

test("CAL gate records cleared and blocked outcomes", () => {
  const cleared = runCAL(open(), { action: "advance", actor: "owner", allowed: true }, { timestamp: TS });
  assert.match(cleared.prr[cleared.prr.length - 1].event, /CAL cleared/);
  const blocked = runCAL(open(), { action: "advance", actor: "guest", allowed: false }, { timestamp: TS });
  assert.match(blocked.prr[blocked.prr.length - 1].event, /CAL blocked/);
});

test("Go/No-Go #3: evidence, decision, CAL, and PRM all write back to PRR", () => {
  let rt = open();
  rt = requestEvidence(rt, { item: "Receipt" }, { timestamp: TS });
  rt = logDecision(rt, { decision: "Waive cleaning fee" }, { timestamp: TS });
  rt = runCAL(rt, { action: "seal", actor: "owner", allowed: true }, { timestamp: TS });
  rt = runPRM(rt, { milestone: "closeout" }, { timestamp: TS });
  const kinds = new Set(rt.prr.map((e) => e.kind));
  for (const k of ["FORM", "EVIDENCE", "DECISION", "CAL", "PRM"]) assert.ok(kinds.has(k), `missing ${k}`);
  // append-only: seqs are still a clean 1..n run
  assert.deepEqual(rt.prr.map((e) => e.seq), rt.prr.map((_, i) => i + 1));
});
