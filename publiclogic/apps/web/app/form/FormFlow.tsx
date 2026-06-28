"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SEED_TYPES,
  compileSeed,
  deriveFormDefaults,
  submitForm,
  LOCKED_LANES,
} from "@publiclogic/golden-path";

type Answers = Record<string, string>;
type SubmitResult = Awaited<ReturnType<typeof submitForm>>;

export function FormFlow() {
  const [seedType, setSeedType] = useState("airbnb");
  const [seedValue, setSeedValue] = useState("airbnb.com/rooms/12345");
  const identity = useMemo(() => compileSeed({ type: seedType, value: seedValue }), [seedType, seedValue]);
  const sp = identity.source_profile as Record<string, unknown>;
  const spId = String(sp.id);

  const [answers, setAnswers] = useState<Answers>(() => deriveFormDefaults(identity));
  const [result, setResult] = useState<SubmitResult | null>(null);

  // When the identity changes, re-ground the prefilled fields (the "teeth").
  useEffect(() => {
    const d = deriveFormDefaults(identity);
    setAnswers((a) => ({ ...a, source: d.source, lane: d.lane }));
    setResult(null);
  }, [spId]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k: string, v: string) => setAnswers((a) => ({ ...a, [k]: v }));
  const submit = async () => setResult(await submitForm(identity, answers, { timestamp: new Date().toISOString() }));

  return (
    <div className="seed-wrap">
      {/* Identity bar — what the form is grounded in (GP-001) */}
      <div className="panel ident-bar">
        <p className="eyebrow">Opening against a real identity</p>
        <div className="ident-controls">
          <select className="seed-field ident-select" value={seedType} onChange={(e) => setSeedType(e.target.value)}>
            {SEED_TYPES.map((s) => (
              <option key={s.type} value={s.type}>{s.label}</option>
            ))}
          </select>
          <input
            className="seed-field"
            value={seedValue}
            placeholder="seed value"
            onChange={(e) => setSeedValue(e.target.value)}
            aria-label="Seed value"
          />
        </div>
        <p className="ident-known">
          <strong>It already knows:</strong> {String(sp.name)}
          {String(sp.website) ? ` · ${String(sp.website)}` : ""} ·{" "}
          {(sp.connected_tools as string[]).join(", ") || "no tools"} ·{" "}
          {identity.document_set.folders.length} document folders
        </p>
      </div>

      {/* The shortest possible intake */}
      <div className="panel">
        <p className="eyebrow">GP-002 · Universal FORM</p>
        <h2>Open the work.</h2>
        <div className="form-grid">
          <Field label="Your role">
            <input className="seed-field" value={answers.role} placeholder="owner, clerk, consultant…" onChange={(e) => set("role", e.target.value)} />
          </Field>
          <Field label="Lane" hint="grounded by the seed">
            <select className="seed-field" value={answers.lane} onChange={(e) => set("lane", e.target.value)}>
              <option value="">Choose a lane…</option>
              {LOCKED_LANES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="What’s going on?" wide required>
            <textarea className="seed-field" rows={2} value={answers.problem} onChange={(e) => set("problem", e.target.value)} />
          </Field>
          <Field label="What does done look like?" wide required>
            <textarea className="seed-field" rows={2} value={answers.desired_outcome} onChange={(e) => set("desired_outcome", e.target.value)} />
          </Field>
          <Field label="Source" hint="grounded by the seed">
            <input className="seed-field" value={answers.source} onChange={(e) => set("source", e.target.value)} />
          </Field>
          <Field label="Owner">
            <input className="seed-field" value={answers.owner} placeholder="who owns this" onChange={(e) => set("owner", e.target.value)} />
          </Field>
          <Field label="Deadline">
            <input className="seed-field" type="date" value={answers.deadline} onChange={(e) => set("deadline", e.target.value)} />
          </Field>
        </div>
        <div className="form-actions">
          <button className="button primary" onClick={submit}>Open CaseSpace</button>
          {result && !result.valid && (
            <span className="form-missing">Add: {result.missing.map((m) => m.replace(/_/g, " ")).join(", ")}</span>
          )}
        </div>
      </div>

      {/* The opened CaseSpace */}
      {result?.valid && <OpenedCaseSpace result={result} />}
    </div>
  );
}

function OpenedCaseSpace({ result }: { result: SubmitResult }) {
  const cs = result.casespace as Record<string, unknown>;
  const tc = cs.tabs_content as Record<string, Record<string, unknown>>;
  const overview = tc.Overview as Record<string, unknown>;
  const intake = tc.Intake as Record<string, unknown>;
  const known = intake.known as Record<string, unknown>;
  const docs = tc.Documents as unknown as string[];
  const next = (tc["Next Steps"] as unknown as Record<string, unknown>[])[0];

  return (
    <div className="panel obj-dark opened">
      <div className="obj-head">
        <h3>CaseSpace opened</h3>
        <code className="code-dark">{String(cs.id)}</code>
      </div>
      <div className="flow-chips">
        {(cs.tabs as string[]).map((t) => <span key={t} className="chip chip-dark">{t}</span>)}
      </div>

      <div className="opened-grid">
        <div className="opened-tab">
          <span className="opened-tab-name">Overview</span>
          <p>{String(overview.desired_outcome)}</p>
          <p className="opened-meta">Lane {String(overview.lane)} · Owner {String(overview.owner)} · {String(overview.status)}</p>
        </div>
        <div className="opened-tab">
          <span className="opened-tab-name">Intake</span>
          <p>{String(intake.problem)}</p>
          <p className="opened-meta">
            Role {String(intake.role) || "—"} · Source {String(intake.source) || "—"} · Due {String(intake.deadline ?? "—")}
          </p>
          <p className="opened-meta">Known: {String(known.name)}{known.website ? ` · ${String(known.website)}` : ""}</p>
        </div>
        <div className="opened-tab">
          <span className="opened-tab-name">Documents</span>
          <p className="opened-meta">{docs.join(" · ")}</p>
        </div>
        <div className="opened-tab">
          <span className="opened-tab-name">Next Steps</span>
          <p>{String(next.title)}</p>
        </div>
      </div>

      {/* The verified spine: the FORM is a canonical object that earned a
          Record Receipt before it became a PRR event. */}
      <ol className="spine">
        <li className="spine-step">
          <span className="spine-kind">Canonical object</span>
          <code className="code-dark">FORM {String(result.form_entry.id)}</code>
        </li>
        <li className="spine-step">
          <span className="spine-kind">Record Receipt</span>
          <code className="code-dark">{result.receipt ? hashShort(result.receipt.object_hash) : "—"}</code>
          <span className="spine-tag">{result.receipt?.canonical_form_version ?? ""}</span>
        </li>
        <li className="spine-step">
          <span className="spine-kind">PRR #{result.prr[0].seq}</span>
          <span className="spine-event">{result.prr[0].event}</span>
        </li>
      </ol>
      <p className="obj-note obj-note-dark">
        The receipt commits to the exact bytes of FORM {String(result.form_entry.id)} — the PRR
        event references that hash, and it attaches to {String(cs.source_profile_id)}.
      </p>
      <div className="cta-row">
        <a className="button secondary" href="/recordstream">Watch it record (GP-004) →</a>
      </div>
    </div>
  );
}

function hashShort(h: string) {
  return h.slice(0, 12) + "…" + h.slice(-6);
}

function Field({
  label, children, hint, required, wide,
}: { label: string; children: React.ReactNode; hint?: string; required?: boolean; wide?: boolean }) {
  return (
    <label className={wide ? "form-field form-field-wide" : "form-field"}>
      <span className="form-label">
        {label}{required ? <span className="form-req"> *</span> : null}
        {hint ? <span className="form-hint">{hint}</span> : null}
      </span>
      {children}
    </label>
  );
}
