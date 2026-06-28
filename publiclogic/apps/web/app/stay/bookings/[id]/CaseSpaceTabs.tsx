"use client";

import { useState } from "react";

type Case = Record<string, unknown>;
const TABS = ["Overview", "Intake", "Documents", "Decisions", "Next Steps"] as const;
type Tab = (typeof TABS)[number];

const CHECKLIST_LABELS: Record<string, string> = {
  beds_reset: "Beds reset",
  bathrooms_reset: "Bathrooms reset",
  kitchen_reset: "Kitchen reset",
  trash_removed: "Trash removed",
  towels_stocked: "Towels stocked",
  hot_tub_checked: "Hot tub checked",
  damage_photo_check: "Damage / photo check",
  welcome_items_placed: "Welcome items placed",
};

export function CaseSpaceTabs({ booking, turnover }: { booking: Case; turnover: Case | null }) {
  const [tab, setTab] = useState<Tab>("Overview");
  return (
    <section className="section detail-body">
      <nav className="tabs" aria-label="CaseSpace sections">
        {TABS.map((t) => (
          <button
            key={t}
            className={t === tab ? "tab tab-active" : "tab"}
            onClick={() => setTab(t)}
            aria-current={t === tab}
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === "Overview" && <Overview booking={booking} turnover={turnover} />}
      {tab === "Intake" && <Intake booking={booking} />}
      {tab === "Documents" && <Documents />}
      {tab === "Decisions" && <Decisions booking={booking} turnover={turnover} />}
      {tab === "Next Steps" && <NextSteps booking={booking} turnover={turnover} />}
    </section>
  );
}

function Overview({ booking, turnover }: { booking: Case; turnover: Case | null }) {
  return (
    <div className="detail-grid">
      <div className="panel">
        <h3>Desired outcome</h3>
        <p>A clean handoff: the guest arrives to a turned-over, stocked property, and the stay closes with proof.</p>
        <div className="fact-list">
          <Fact k="Guest" v={String(booking.guest_name ?? "Airbnb Guest")} />
          <Fact k="Dates" v={`${booking.check_in_date} → ${booking.checkout_date}`} />
          <Fact k="Source" v={String(booking.platform)} />
          <Fact k="Status" v={String(booking.status)} />
        </div>
      </div>

      <div className="panel panel-dark">
        <h3>Linked turnover</h3>
        {turnover ? (
          <>
            <p className="dark-line">
              <strong>{String(turnover.turnover_date)}</strong> · next check-in{" "}
              {String(turnover.next_checkin_date ?? "—")}
            </p>
            <Row k="Priority" v={String(turnover.priority)} />
            <Row k="Cleaner" v={String(turnover.cleaner)} />
            <Row k="Status" v={String(turnover.status)} />
          </>
        ) : (
          <p className="dark-line">No turnover (owner block).</p>
        )}
      </div>

      <div className="panel">
        <h3>What is missing</h3>
        <ul className="miss-list">
          {String(booking.guest_name ?? "") === "Airbnb Guest" && (
            <li className="miss">Guest name not exposed by Airbnb iCal — using “Airbnb Guest”.</li>
          )}
          {turnover && String(turnover.cleaner) === "unassigned" && (
            <li className="miss miss-alert">Cleaner not assigned for the turnover.</li>
          )}
          <li className="miss">Welcome / access details to confirm before check-in.</li>
        </ul>
      </div>
    </div>
  );
}

function Intake({ booking }: { booking: Case }) {
  return (
    <div className="detail-grid">
      <div className="panel">
        <h3>Known facts</h3>
        <div className="fact-list">
          <Fact k="Primary guest" v={String(booking.guest_name ?? "Airbnb Guest")} />
          <Fact k="Check-in" v={String(booking.check_in_date)} />
          <Fact k="Checkout" v={String(booking.checkout_date)} />
          <Fact k="Platform" v={String(booking.platform)} />
          <Fact k="Source UID" v={String(booking.source_uid)} />
        </div>
      </div>
      <div className="panel">
        <h3>Raw signal</h3>
        <p className="mono">{String(booking.raw_summary) || "—"}</p>
        <p className="mono small">{String(booking.raw_description) || "No description in feed."}</p>
      </div>
    </div>
  );
}

function Documents() {
  return (
    <div className="panel doc-empty">
      <h3>Documents</h3>
      <p>No documents captured yet. Receipts, IDs, and signed agreements attach here as the stay progresses.</p>
      <span className="pill-soft">Capture via PJ — drop files into the case</span>
    </div>
  );
}

function Decisions({ booking, turnover }: { booking: Case; turnover: Case | null }) {
  const events = [
    { icon: "•", title: "Booking confirmed", body: `Received from ${booking.platform} and logged as a CaseSpace.`, when: String(booking.created_at).slice(0, 10) },
    { icon: "•", title: "CaseSpace opened", body: `Provenance captured (Entry Surface). ID ${booking.case_id}.`, when: String(booking.created_at).slice(0, 10) },
    ...(turnover
      ? [{ icon: "•", title: "Turnover opened", body: `Turnover ${turnover.turnover_date} derived from checkout.`, when: String(turnover.created_at).slice(0, 10) }]
      : []),
  ];
  return (
    <div className="panel">
      <h3>Decision log</h3>
      <ol className="timeline">
        {events.map((e, i) => (
          <li key={i} className="tl-item">
            <span className="tl-dot" />
            <div>
              <div className="tl-head">
                <strong>{e.title}</strong>
                <span className="tl-when">{e.when}</span>
              </div>
              <p>{e.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function NextSteps({ booking, turnover }: { booking: Case; turnover: Case | null }) {
  const checklist = (turnover?.checklist as Record<string, boolean>) ?? {};
  const keys = Object.keys(CHECKLIST_LABELS);
  const [state, setState] = useState<Record<string, boolean>>(checklist);
  const done = keys.filter((k) => state[k]).length;

  const actions = [
    { title: "Send check-in instructions", due: String(booking.check_in_date) },
    ...(turnover
      ? [{ title: `Assign cleaner for turnover`, due: String(turnover.turnover_date), alert: String(turnover.cleaner) === "unassigned" }]
      : []),
  ];

  return (
    <div className="detail-grid detail-grid-2">
      <div className="panel">
        <div className="section-head">
          <h3>Turnover checklist</h3>
          <span className="pill-soft">{done}/{keys.length} done</span>
        </div>
        <div className="progress">
          <div className="progress-bar" style={{ width: `${(done / keys.length) * 100}%` }} />
        </div>
        <ul className="check-list">
          {keys.map((k) => (
            <li key={k}>
              <label className="check">
                <input
                  type="checkbox"
                  checked={!!state[k]}
                  onChange={(e) => setState((s) => ({ ...s, [k]: e.target.checked }))}
                />
                <span className={state[k] ? "check-label check-done" : "check-label"}>
                  {CHECKLIST_LABELS[k]}
                </span>
              </label>
            </li>
          ))}
        </ul>
        {!turnover && <p className="muted-cell">No turnover for this case (owner block).</p>}
      </div>

      <div className="panel">
        <h3>Action items</h3>
        <ul className="action-list">
          {actions.map((a, i) => (
            <li key={i} className="action">
              <span className="action-title">{a.title}</span>
              <span className={(a as { alert?: boolean }).alert ? "tag tag-red" : "tag"}>
                Due {a.due}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="fact">
      <span className="fact-k">{k}</span>
      <span className="fact-v">{v}</span>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="dark-row">
      <span>{k}</span>
      <strong>{v}</strong>
    </div>
  );
}
