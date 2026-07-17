"use client";

import { useMemo } from "react";
import { SealVerify } from "../../components/SealVerify";
import { buildCemeteryRuntime, type CemeteryRecord as Rec } from "./buildCemeteryRuntime";

const KIND_ICON: Record<string, string> = {
  request: "✉",
  decision: "◧",
  deed: "▤",
  fees: "$",
  schedule: "◷",
  permit: "▤",
  interment: "✦",
  map: "⬚",
};

function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function CemeteryRecord({ record, org }: { record: Rec; org: { name: string; domain: string } }) {
  const { runtime, caseRef } = useMemo(() => buildCemeteryRuntime(record, org), [record, org]);

  return (
    <div className="seed-wrap">
      <div className="panel cem-record">
        <div className="cem-tabs">
          {["Overview", "Plot", "People", "Fees", "Files", "Schedule", "Permits", "Record"].map((t, i) => (
            <span key={t} className={`muni-tab${i === 0 ? " active" : ""}`}>{t}</span>
          ))}
        </div>

        <div className="cem-head">
          <div>
            <h3>{record.subject}</h3>
            <p>{org.name} · Section {record.plot.section} · Plot {record.plot.plot}</p>
            <span className="muni-badge offboarding">{record.status}</span>
            <span className="muni-keydate">Deed {record.plot.deed}</span>
          </div>
          <div className="cem-retention">
            <span className="cem-retention-label">Retention</span>
            <span className="cem-retention-val">{record.retention}</span>
            <span className="cem-retention-note">The record is the service.</span>
          </div>
        </div>

        <div className="cem-body">
          {/* One timeline — the whole record from request to permanent retention */}
          <div className="cem-timeline-wrap">
            <h4>One timeline</h4>
            <ol className="cem-timeline">
              {record.timeline.map((e) => (
                <li key={e.date + e.label} className="cem-event">
                  <span className="cem-dot" aria-hidden>{KIND_ICON[e.kind] ?? "•"}</span>
                  <div className="cem-event-body">
                    <span className="cem-event-date">{fmtDate(e.date)}</span>
                    <span className="cem-event-label">{e.label}</span>
                    {e.file && <span className="cem-event-file">{e.file}</span>}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <aside className="cem-files">
            <h4>Files</h4>
            <ul className="muni-filelist">
              {record.files.map((f) => (
                <li key={f}><span className="muni-fileicon" aria-hidden>▤</span>{f}</li>
              ))}
            </ul>
            <p className="cem-owner">Owner: <strong>{record.owner}</strong></p>
          </aside>
        </div>
      </div>

      <p className="muni-spine-note">
        Cemetery records are <strong>permanent</strong>. Each request, deed, payment, permit, and
        interment becomes part of the same history. Close the record below to see how the town can
        preserve it and detect later changes.
      </p>
      <SealVerify
        records={runtime.prr}
        caseRef={caseRef}
        closedBy={record.owner}
        tamperIndex={6}
        unsealedLines={["Record open.", "Request, deed, fees, permit, and interment are being captured."]}
      />
    </div>
  );
}
