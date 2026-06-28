"use client";

import { useMemo, useState } from "react";
import {
  compileSeed, openRuntime,
  requestEvidence, provideEvidence, logDecision, runCAL, runPRM,
  buildPacket, verifyPacket,
  type Runtime, type Packet, type Verdict,
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

  // Seal state: null = unsealed; otherwise a sealed packet + its current verdict.
  const [packet, setPacket] = useState<Packet | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [tampered, setTampered] = useState(false);

  const outstanding = rt.evidence.find((e) => e.status === "requested");
  const lastPrm = [...rt.checks].reverse().find((c) => c.object === "PRM");
  const cs = rt.casespace as Record<string, unknown>;

  // Once sealed, new events would invalidate the seal — so we lock the stream.
  const sealed = packet !== null;
  const act = (fn: () => Runtime) => { if (!sealed) setRt(fn()); };

  async function seal() {
    const caseRef = { id: cs.id, lane: cs.lane, owner: cs.owner };
    const p = await buildPacket(caseRef, rt.prr, { closed_at: nowIso(), closed_by: String(cs.owner ?? "owner") });
    setPacket(p);
    setVerdict(await verifyPacket(p));
    setTampered(false);
  }

  // Tamper OUTSIDE the database: edit a sealed record's bytes, re-verify.
  async function tamper() {
    if (!packet) return;
    const target = Math.min(3, packet.items.length - 1); // record #004 if present
    const next: Packet = {
      ...packet,
      items: packet.items.map((it, i) =>
        i === target ? { ...it, record: { ...it.record, event: it.record.event + " (edited)" } } : it,
      ),
    };
    setPacket(next);
    setVerdict(await verifyPacket(next));
    setTampered(true);
  }

  function reset() {
    setPacket(null);
    setVerdict(null);
    setTampered(false);
  }

  const failedItem = packet && verdict && !verdict.ok
    ? packet.items.find((it) => verdict.failures.some((f) => f.includes(`seq ${it.seq}`)))
    : undefined;
  const shortRoot = (h?: string) => (h ? h.slice(0, 16) + "…" + h.slice(-8) : "—");

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
          <button className="button secondary" disabled={sealed} onClick={() => { act(() => requestEvidence(rt, { item: EVIDENCE_ITEMS[evIdx % EVIDENCE_ITEMS.length], owner: "Nate" }, { timestamp: nowIso() })); setEvIdx((i) => i + 1); }}>
            Request evidence
          </button>
          <button className="button secondary" disabled={sealed || !outstanding} onClick={() => outstanding && act(() => provideEvidence(rt, { evidenceId: outstanding.id, by: "vendor" }, { timestamp: nowIso() }))}>
            Provide latest evidence
          </button>
          <button className="button secondary" disabled={sealed} onClick={() => { act(() => logDecision(rt, { decision: DECISIONS[dcIdx % DECISIONS.length], by: "Nate" }, { timestamp: nowIso() })); setDcIdx((i) => i + 1); }}>
            Log decision
          </button>
          <button className="button secondary" disabled={sealed} onClick={() => act(() => runCAL(rt, { action: "advance", actor: "owner", allowed: true }, { timestamp: nowIso() }))}>
            CAL · owner advances
          </button>
          <button className="button secondary" disabled={sealed} onClick={() => act(() => runCAL(rt, { action: "advance", actor: "guest", allowed: false, reason: "guests can’t advance the case" }, { timestamp: nowIso() }))}>
            CAL · guest tries
          </button>
          <button className="button primary" disabled={sealed} onClick={() => act(() => runPRM(rt, { milestone: "closeout" }, { timestamp: nowIso() }))}>
            PRM check
          </button>
        </div>
      </div>

      {/* The seal — proof made visible. Unsealed → Sealed → Verification Failed. */}
      <div className={`panel seal-panel${sealed ? (verdict?.ok ? " seal-ok" : " seal-fail") : ""}`}>
        <div className="section-head">
          <h3>Seal &amp; verify</h3>
          <span className="pill-soft">
            {!sealed ? "Unsealed" : verdict?.ok ? "Sealed · verified" : "Verification failed"}
          </span>
        </div>

        {!sealed && (
          <div className="seal-body">
            <p className="seal-line"><strong>{rt.prr.length} events captured.</strong> The recordstream is open and still accumulating. Seal it to commit a CaseReceipt and an offline-verifiable packet.</p>
            <button className="button primary" onClick={seal}>Seal recordstream</button>
          </div>
        )}

        {sealed && (
          <div className="seal-body">
            <dl className="seal-grid">
              <div><dt>Events sealed</dt><dd>{packet!.case_receipt.record_count}</dd></div>
              <div><dt>CaseReceipt</dt><dd>{packet!.case_receipt.object === "CASE_RECEIPT" ? "committed" : "—"}</dd></div>
              <div><dt>Merkle root</dt><dd><code>{shortRoot(packet!.case_receipt.merkle_root)}</code></dd></div>
              <div><dt>Canonical form</dt><dd><code>{packet!.canonical_form_version}</code></dd></div>
            </dl>

            {verdict?.ok ? (
              <p className="seal-verdict ok">
                <strong>Offline packet verified.</strong> Every record matches its sealed receipt and the Merkle root is intact — no PublicLogic server in the loop.
              </p>
            ) : (
              <div className="seal-verdict fail">
                <p><strong>Verification failed.</strong> {tampered ? "A record was edited after sealing." : "The packet does not match its CaseReceipt."}</p>
                {failedItem && (
                  <p className="seal-failed-item">
                    Record #{String(failedItem.seq).padStart(3, "0")} no longer matches its sealed receipt —{" "}
                    <span className="seal-failed-event">“{String(failedItem.record.event)}”</span>
                  </p>
                )}
                <ul className="seal-failures">{verdict?.failures.map((f) => <li key={f}>{f}</li>)}</ul>
              </div>
            )}

            <div className="rs-actions">
              {!tampered && verdict?.ok && (
                <button className="button secondary" onClick={tamper}>Tamper with record #004</button>
              )}
              <button className="button secondary" onClick={reset}>Reset</button>
            </div>
          </div>
        )}
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
