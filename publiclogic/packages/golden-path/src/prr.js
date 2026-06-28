// GP-004 — PRR (the recordstream). Append-only. Every meaningful action writes
// back here: FORM opens it, then Evidence, Decisions, CAL, and PRM all append.
// Proof is the product, and the proof lives in this stream.
import { shortHash } from "./seed.js";
import { openForm } from "./form.js";

export const PRR_KINDS = ["FORM", "EVIDENCE", "DECISION", "CAL", "PRM", "NOTE", "SEAL"];

/**
 * Append one entry to the recordstream. Never mutates the input; assigns a
 * monotonic seq; freezes the entry. This is the only way to write to PRR.
 */
export function appendPRR(stream = [], entry, opts = {}) {
  if (!entry || !entry.kind || !entry.event) throw new Error("A PRR entry needs a kind and an event.");
  if (!PRR_KINDS.includes(entry.kind)) throw new Error(`Unknown PRR kind: ${entry.kind}`);
  const record = Object.freeze({
    seq: stream.length + 1,
    at: opts.timestamp ?? entry.at ?? null,
    kind: entry.kind,
    event: entry.event,
    by: entry.by || "operator",
    ref: entry.ref || null,
  });
  return [...stream, record];
}

function id(prefix, ...parts) {
  return `${prefix}-${shortHash(parts.join(":"))}`;
}

/** Open a runtime around a compiled identity + form answers (GP-001 → GP-002 → PRR). */
export function openRuntime(identity, answers = {}, opts = {}) {
  const form = openForm(identity, answers, opts);
  return {
    casespace: form.casespace,
    form_entry: form.form_entry,
    prr: form.prr, // seq 1: "FORM submitted — CaseSpace opened" (when valid)
    evidence: [],
    decisions: [],
    checks: [],
  };
}

// ---- Write-backs: each action appends exactly one PRR entry ----

export function requestEvidence(rt, { item, owner = "Unassigned", by = "operator" }, opts = {}) {
  const ev = { object: "EVIDENCE", id: id("EV", rt.prr.length, item), item, owner, status: "requested", created_at: opts.timestamp ?? null };
  const prr = appendPRR(rt.prr, { kind: "EVIDENCE", event: `Evidence requested: ${item}`, by, ref: ev.id }, opts);
  return { ...rt, evidence: [...rt.evidence, ev], prr };
}

export function provideEvidence(rt, { evidenceId, by = "operator" }, opts = {}) {
  let item = "";
  const evidence = rt.evidence.map((e) => {
    if (e.id !== evidenceId) return e;
    item = e.item;
    return { ...e, status: "provided" };
  });
  const prr = appendPRR(rt.prr, { kind: "EVIDENCE", event: `Evidence provided: ${item}`, by, ref: evidenceId }, opts);
  return { ...rt, evidence, prr };
}

export function logDecision(rt, { decision, basis = "", by = "operator" }, opts = {}) {
  const d = { object: "DECISION", id: id("DC", rt.prr.length, decision), decision, basis, by, created_at: opts.timestamp ?? null };
  const prr = appendPRR(rt.prr, { kind: "DECISION", event: `Decision: ${decision}`, by, ref: d.id }, opts);
  return { ...rt, decisions: [...rt.decisions, d], prr };
}

export function runCAL(rt, { action, actor, allowed, reason = "" }, opts = {}) {
  const c = { object: "CAL", id: id("CAL", rt.prr.length, action), action, actor, allowed, reason, created_at: opts.timestamp ?? null };
  const event = allowed ? `CAL cleared: ${actor} → ${action}` : `CAL blocked: ${actor} → ${action}`;
  const prr = appendPRR(rt.prr, { kind: "CAL", event, by: actor, ref: c.id }, opts);
  return { ...rt, checks: [...rt.checks, c], prr };
}

/** PRM surfaces missing proof: any evidence not yet provided blocks readiness. */
export function runPRM(rt, { milestone = "closeout", by = "operator" } = {}, opts = {}) {
  const missing = rt.evidence.filter((e) => e.status !== "provided").map((e) => e.item);
  const ready = missing.length === 0;
  const c = { object: "PRM", id: id("PRM", rt.prr.length, milestone), milestone, ready, missing, created_at: opts.timestamp ?? null };
  const event = ready ? `PRM ready: ${milestone}` : `PRM not ready: ${milestone} (missing ${missing.length})`;
  const prr = appendPRR(rt.prr, { kind: "PRM", event, by, ref: c.id }, opts);
  return { ...rt, checks: [...rt.checks, c], prr };
}
