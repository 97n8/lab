"use client";

import { useMemo, useState } from "react";
import {
  compileSeed, openRuntime,
  requestEvidence, provideEvidence, logDecision, runCAL, runPRM,
  type Runtime,
} from "@publiclogic/golden-path";

const EVIDENCE_ITEMS = ["Vendor invoice", "Before/after photos", "Cleaner sign-off", "Damage receipt"];
const DECISIONS = ["Approve emergency vendor", "Waive one night’s cleaning fee", "Hold checkout until repair confirmed"];
const ANSWERS = {
  role: "owner",
  problem: "Hot tub failed the morning before a same-day turnover.",
  desired_outcome: "Repaired and the property cleaned before the next guest.",
  owner: "Nate",
  lane: "STAY",
};

function kindTone(e: { kind: string; event: string }) {
  if (e.event.includes("blocked") || e.event.includes("not ready")) return "tag tag-red";
  if (e.kind === "FORM" || e.event.includes("cleared") || e.event.includes("provided") || e.event.includes("PRM ready"))
    return "tag tag-green";
  if (e.kind === "EVIDENCE") return "tag tag-gold";
  return "tag";
}

export function RecordStream() {
  const identity = useMemo(() => compileSeed({ type: "airbnb", value: "airbnb.com/rooms/12345" }), []);
  const [rt, setRt] = useState<Runtime>(() => openRuntime(identity, ANSWERS, { timestamp: nowIso() }));
  const [evIdx, setEvIdx] = useState(0);
  const [dcIdx, setDcIdx] = useState(0);

  const outstanding = rt.evidence.find((e) => e.status === "requested");
  const lastPrm = [...rt.checks].reverse().find((c) => c.object === "PRM");
  const cs = rt.casespace as Record<string, unknown>;

  const act = (fn: () => Runtime) => setRt(fn());

  return (
    <div className="seed-wrap">
      <div className="panel rs-head">
        <div className="obj-head">
          <h2>CaseSpace · live recordstream</h2>
          <code>{String(cs.id)}</code>
        </div>
        <p className="ident-known">
          <strong>{String((cs.tabs_content as Record<string, Record<string, unknown>>).Intake.problem)}</strong>{" "}
          · Lane {String(cs.lane)} · Owner {String(cs.owner)} · {String(cs.status)}
        </p>
        <div className="rs-actions">
          <button className="button secondary" onClick={() => { act(() => requestEvidence(rt, { item: EVIDENCE_ITEMS[evIdx % EVIDENCE_ITEMS.length], owner: "Nate" }, { timestamp: nowIso() })); setEvIdx((i) => i + 1); }}>
            Request evidence
          </button>
          <button className="button secondary" disabled={!outstanding} onClick={() => outstanding && act(() => provideEvidence(rt, { evidenceId: outstanding.id, by: "vendor" }, { timestamp: nowIso() }))}>
            Provide latest evidence
          </button>
          <button className="button secondary" onClick={() => { act(() => logDecision(rt, { decision: DECISIONS[dcIdx % DECISIONS.length], by: "Nate" }, { timestamp: nowIso() })); setDcIdx((i) => i + 1); }}>
            Log decision
          </button>
          <button className="button secondary" onClick={() => act(() => runCAL(rt, { action: "advance", actor: "owner", allowed: true }, { timestamp: nowIso() }))}>
            CAL · owner advances
          </button>
          <button className="button secondary" onClick={() => act(() => runCAL(rt, { action: "advance", actor: "guest", allowed: false, reason: "guests can’t advance the case" }, { timestamp: nowIso() }))}>
            CAL · guest tries
          </button>
          <button className="button primary" onClick={() => act(() => runPRM(rt, { milestone: "closeout" }, { timestamp: nowIso() }))}>
            PRM check
          </button>
        </div>
      </div>

      <div className="rs-grid">
        {/* The append-only stream */}
        <div className="panel">
          <div className="section-head"><h3>PRR — append-only</h3><span className="pill-soft">{rt.prr.length} entries</span></div>
          <ol className="prr-list">
            {[...rt.prr].reverse().map((e) => (
              <li key={e.seq} className="prr-entry">
                <span className="prr-seq">#{e.seq}</span>
                <span className={kindTone(e)}>{e.kind}</span>
                <div className="prr-body">
                  <span className="prr-event">{e.event}</span>
                  <span className="prr-by">by {e.by}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* The objects that wrote to it */}
        <aside className="rs-aside">
          <div className="panel">
            <h3>Evidence</h3>
            {rt.evidence.length === 0 && <p className="muted-cell">None requested yet.</p>}
            <ul className="rs-obj-list">
              {rt.evidence.map((e) => (
                <li key={e.id}>
                  <span>{e.item}</span>
                  <span className={e.status === "provided" ? "tag tag-green" : "tag tag-red"}>{e.status}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel">
            <h3>Readiness (PRM)</h3>
            {!lastPrm && <p className="muted-cell">Run a PRM check.</p>}
            {lastPrm && (lastPrm.ready
              ? <p className="rs-ready">Ready to seal ✓</p>
              : <div><p className="rs-blocked">Not ready — missing proof:</p><ul className="rs-missing">{(lastPrm.missing ?? []).map((m) => <li key={m}>{m}</li>)}</ul></div>
            )}
          </div>

          <div className="panel">
            <h3>Decisions</h3>
            {rt.decisions.length === 0 && <p className="muted-cell">None logged yet.</p>}
            <ul className="rs-obj-list">
              {rt.decisions.map((d) => <li key={d.id}><span>{d.decision}</span></li>)}
            </ul>
          </div>
        </aside>
      </div>

      <p className="attach-rule">
        <strong>Append-only:</strong> nothing in PRR is edited or deleted. Evidence, decisions, CAL, and
        PRM each write a new entry. The stream is the proof — and proof is the product.
      </p>
    </div>
  );
}

function nowIso() {
  return new Date().toISOString();
}
