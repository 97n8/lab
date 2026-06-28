"use client";

import { useMemo, useState } from "react";
import { SealVerify } from "../../components/SealVerify";
import { buildMuniRuntime, type MuniCase } from "./buildMuniRuntime";

const TABS = ["Overview", "People", "Tasks", "Files", "Forms", "Decisions", "Deadlines", "Next Steps"];

function initials(name: string) {
  return name.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}
function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

export function MuniCaseSpace({ cases, org }: { cases: MuniCase[]; org: { name: string; domain: string } }) {
  const [active, setActive] = useState(0);
  const c = cases[active];
  const { runtime, caseRef } = useMemo(() => buildMuniRuntime(c, org), [c, org]);

  const done = c.tasks.filter((t) => t.done).length;
  const total = c.tasks.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="seed-wrap">
      <div className="muni-switch">
        {cases.map((cc, i) => (
          <button
            key={cc.id}
            className={`muni-switch-btn${i === active ? " active" : ""}`}
            onClick={() => setActive(i)}
          >
            <span className="muni-switch-kind">{cc.kind === "onboarding" ? "Onboarding" : "Offboarding"}</span>
            <span className="muni-switch-name">{cc.person.name}</span>
          </button>
        ))}
      </div>

      <div className="panel muni-case">
        {/* Tab rail — the CaseSpace shape, same as STAY */}
        <div className="muni-tabs">
          {TABS.map((t, i) => (
            <span key={t} className={`muni-tab${i === 0 ? " active" : ""}`}>{t}</span>
          ))}
        </div>

        {/* Header — who, role, status, the next step */}
        <div className="muni-head">
          <div className="muni-person">
            <span className="muni-avatar">{initials(c.person.name)}</span>
            <div>
              <h3>{c.person.name}</h3>
              <p>{c.person.role}</p>
              <span className={`muni-badge ${c.kind}`}>{c.status}</span>
              <span className="muni-keydate">{c.key_date.label}: {fmtDate(c.key_date.value)}</span>
            </div>
          </div>
          <div className="muni-next">
            <span className="muni-next-label">Next Step</span>
            <span className="muni-next-step">{c.next_step.label} →</span>
            <span className="muni-next-due">Due {fmtDate(c.next_step.due)}</span>
          </div>
        </div>

        {/* Three columns: Tasks · Files · Deadlines */}
        <div className="muni-grid">
          <div className="muni-col">
            <h4>Tasks</h4>
            <ul className="muni-tasklist">
              {c.tasks.map((t) => (
                <li key={t.key} className={t.done ? "done" : ""}>
                  <span className="muni-check" aria-hidden>{t.done ? "☑" : "☐"}</span>
                  {t.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="muni-col">
            <h4>Files</h4>
            <ul className="muni-filelist">
              {c.files.map((f) => (
                <li key={f}><span className="muni-fileicon" aria-hidden>▤</span>{f}</li>
              ))}
            </ul>
          </div>
          <div className="muni-col">
            <h4>Deadlines</h4>
            <ul className="muni-deadlines">
              {c.deadlines.map((d) => (
                <li key={d.date + d.label}><span className="muni-date">{fmtDate(d.date)}</span>{d.label}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="muni-foot">
          <span>Owner: <strong>{c.owner}</strong></span>
          <div className="muni-progress">
            <span>{done} of {total} complete</span>
            <div className="muni-bar"><div className="muni-bar-fill" style={{ width: `${pct}%` }} /></div>
          </div>
        </div>
      </div>

      {/* Same governance underneath: the CaseSpace above is presentation; this is
          the verified spine — the PRR for this case, sealed and verified offline. */}
      <p className="muni-spine-note">
        Everything above is driven by the <strong>same runtime as STAY</strong>: a <code>.gov</code> seed grounded the
        MUNI lane, the FORM opened the CaseSpace, and each completed task, attached file, and approval wrote one
        append-only PRR record. Seal it to prove the record survives the person.
      </p>
      <SealVerify
        records={runtime.prr}
        caseRef={caseRef}
        closedBy={c.owner}
        tamperIndex={4}
        unsealedLines={["Onboarding record open.", "Tasks, files, and approvals are still accumulating."]}
      />
    </div>
  );
}
