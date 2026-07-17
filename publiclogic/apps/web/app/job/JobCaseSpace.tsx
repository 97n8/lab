"use client";

import { useMemo, useState } from "react";
import {
  compileSeed, openRuntime, punch, computeHours, logDecision, recordNote,
  type Runtime,
} from "@publiclogic/golden-path";

// A scripted day so the demo shows real hours (no wall-clock seconds).
const SCHEDULE = [
  { type: "start", at: "2026-06-28T07:01:00Z", label: "Start Work" },
  { type: "lunch_out", at: "2026-06-28T12:02:00Z", label: "Lunch" },
  { type: "lunch_in", at: "2026-06-28T12:33:00Z", label: "Back from lunch" },
  { type: "end", at: "2026-06-28T16:16:00Z", label: "End Day" },
];
const MATERIALS = ["12/2 Romex", "Outlet + plate", "20A breaker"];
const PHOTOS = ["Before — panel", "During — rough-in", "After — finished"];
const CHANGE = "Install one additional outlet — garage wall (customer requested)";

export function JobCaseSpace() {
  const identity = useMemo(() => compileSeed({ type: "website", value: "sparkselectric.com" }), []);
  const [rt, setRt] = useState<Runtime>(() =>
    openRuntime(identity, { role: "owner", problem: "Panel upgrade + add-ons at Smith Residence", desired_outcome: "Pass inspection, bill it, get signed", owner: "Sam", lane: "BIZ" }, { timestamp: SCHEDULE[0].at })
  );
  const [step, setStep] = useState(0);
  const [materials, setMaterials] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [changeOrder, setChangeOrder] = useState(false);
  const [signed, setSigned] = useState(false);

  const hours = computeHours(rt.punches ?? []);
  const next = SCHEDULE[step];
  const dayDone = step >= SCHEDULE.length;
  const invoiceReady = dayDone && materials.length > 0 && changeOrder && signed;

  const doPunch = () => {
    setRt((r) => punch(r, { type: next.type, who: "Joe", at: next.at }));
    setStep((s) => s + 1);
  };
  const addMaterial = () => {
    const m = MATERIALS[materials.length % MATERIALS.length];
    if (materials.includes(m)) return;
    setRt((r) => recordNote(r, { event: `Material: ${m} — receipt attached`, by: "Joe" }, { timestamp: new Date().toISOString() }));
    setMaterials((a) => [...a, m]);
  };
  const addPhoto = () => {
    const p = PHOTOS[photos.length % PHOTOS.length];
    if (photos.includes(p)) return;
    setRt((r) => recordNote(r, { event: `Photo added: ${p}`, by: "Joe" }, { timestamp: new Date().toISOString() }));
    setPhotos((a) => [...a, p]);
  };
  const addChange = () => {
    setRt((r) => logDecision(r, { decision: `Change order: ${CHANGE}`, by: "Sam" }, { timestamp: new Date().toISOString() }));
    setChangeOrder(true);
  };
  const sign = () => {
    setRt((r) => logDecision(r, { decision: "Customer signed off on completed work", by: "Customer" }, { timestamp: new Date().toISOString() }));
    setSigned(true);
  };

  return (
    <div className="seed-wrap">
      {/* Owner's actual mental model: today's jobs */}
      <div className="panel">
        <div className="section-head"><h3>Today’s jobs</h3><span className="pill-soft">owner view</span></div>
        <div className="today-strip">
          <div className="today-job today-active">
            <strong>Smith Residence</strong>
            <span>{dayDone ? "Complete" : step > 0 ? "In progress" : "Scheduled today"} · Joe & Mike{rt.punches?.length ? ` · started 7:01` : ""}</span>
            <span className="today-flag">{invoiceReady ? "Ready to invoice" : signed ? "Awaiting invoice" : "Waiting: signature"}</span>
          </div>
          <div className="today-job">
            <strong>Jones</strong>
            <span>Scheduled tomorrow · Mike</span>
            <span className="today-flag today-warn">Materials missing</span>
          </div>
        </div>
      </div>

      <div className="panel job-head">
        <div className="obj-head"><h2>Smith Residence</h2></div>
        <p className="ident-known">
          <strong>Customer:</strong> A. Smith · <strong>Crew:</strong> Joe + Mike ·{" "}
          <strong>Status:</strong> {dayDone ? "work complete" : "open"}
        </p>
        <div className="rs-actions">
          {!dayDone && <button className="button primary" onClick={doPunch}>{next.label}</button>}
          {dayDone && <span className="pill-soft">Day logged · {hours} hrs</span>}
          <button className="button secondary" onClick={addChange} disabled={changeOrder}>Add change order</button>
          <button className="button secondary" onClick={addMaterial} disabled={materials.length >= MATERIALS.length}>Add material</button>
          <button className="button secondary" onClick={addPhoto} disabled={photos.length >= PHOTOS.length}>Add photo</button>
          <button className="button secondary" onClick={sign} disabled={signed}>Customer signs</button>
        </div>
      </div>

      <div className="job-grid">
        <JobCard title="Crew & hours" filled={!!rt.punches?.length}>
          {rt.punches?.length ? (
            <>
              <ul className="rs-obj-list">
                {(rt.punches ?? []).map((p, i) => (
                  <li key={i}><span>{p.type.replace(/_/g, " ")}</span><span className="prr-by">{fmt(p.at)}</span></li>
                ))}
              </ul>
              {dayDone && <p className="job-total">Joe — <strong>{hours} hours</strong> · no timesheet</p>}
            </>
          ) : <Empty>Tap “Start Work” on the job. That’s the whole timesheet.</Empty>}
        </JobCard>

        <JobCard title="Materials" filled={materials.length > 0}>
          {materials.length ? (
            <ul className="rs-obj-list">{materials.map((m) => <li key={m}><span>✔ {m}</span><span className="tag tag-green">receipt</span></li>)}</ul>
          ) : <Empty>Who bought the wire? Keep the receipt with the job.</Empty>}
        </JobCard>

        <JobCard title="Change orders" filled={changeOrder}>
          {changeOrder ? <p className="job-line">{CHANGE}</p> : <Empty>The thing everyone forgets to bill for.</Empty>}
        </JobCard>

        <JobCard title="Photos" filled={photos.length > 0}>
          {photos.length ? <div className="flow-chips">{photos.map((p) => <span key={p} className="chip">{p}</span>)}</div>
            : <Empty>Every photo belongs to the job, not the camera roll.</Empty>}
        </JobCard>

        <JobCard title="Signature" filled={signed}>
          {signed ? <p className="rs-ready">Signed by customer ✓</p> : <Empty>Paper signature, gone in a drawer — or here.</Empty>}
        </JobCard>

        <JobCard title="Invoice" filled={invoiceReady}>
          {invoiceReady
            ? <p className="rs-ready">Ready — hours, materials, change order, and signature are all on the job. Minutes, not memory.</p>
            : <Empty>Fills from hours + materials + change orders + signature.</Empty>}
        </JobCard>
      </div>

      <div className="panel">
        <div className="section-head"><h3>Job history</h3><span className="pill-soft">{rt.prr.length} entries captured</span></div>
        <ul className="prr-list">
          {[...rt.prr].reverse().slice(0, 7).map((e) => (
            <li key={e.seq} className="prr-entry">
              <span className="prr-seq">#{e.seq}</span>
              <span className={e.kind === "TIME" ? "tag tag-gold" : e.kind === "FORM" ? "tag tag-green" : "tag"}>{e.kind}</span>
              <div className="prr-body"><span className="prr-event">{e.event}</span><span className="prr-by">by {e.by}</span></div>
            </li>
          ))}
        </ul>
      </div>

      <p className="attach-rule">
        <strong>Six months later</strong> a customer asks “why did you charge me for another outlet?” Open the
        CaseSpace: the request, the photo, the timestamp, the hours, the invoice — two minutes, no digging. The
        owner thinks they’re buying job tracking. They’re buying never having to ask <em>“what happened on that job?”</em>
      </p>
    </div>
  );
}

function JobCard({ title, filled, children }: { title: string; filled: boolean; children: React.ReactNode }) {
  return (
    <div className={filled ? "panel job-card job-card-on" : "panel job-card"}>
      <div className="job-card-head"><h3>{title}</h3>{filled ? <span className="job-dot" /> : null}</div>
      {children}
    </div>
  );
}
function Empty({ children }: { children: React.ReactNode }) {
  return <p className="muted-cell job-empty">{children}</p>;
}
function fmt(at: string | null) {
  if (!at) return "—";
  const d = new Date(at);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });
}
