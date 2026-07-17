"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft, BedDouble, CalendarDays, Check, ChevronRight, CircleDollarSign,
  Copy, LayoutDashboard, RefreshCw, Sparkles, Terminal, Waves,
} from "lucide-react";
import type { Booking, Dashboard } from "../lib/dashboard";
import type { MonthlyRevenue, Reservation, Totals } from "../lib/transactions";

const NAV = [
  ["dashboard", "Dashboard", LayoutDashboard],
  ["reservations", "Reservations", BedDouble],
  ["calendar", "Calendar", CalendarDays],
  ["turnovers", "Turnovers", Sparkles],
  ["financials", "Financials", CircleDollarSign],
  ["sync", "Sync", RefreshCw],
] as const;

type View = (typeof NAV)[number][0];

const usd = (n: number, cents = false) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 });

const mmm = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

function priorityTag(p: string) {
  if (p === "SAME_DAY") return "tag tag-red";
  if (p === "HIGH") return "tag tag-gold";
  return "tag";
}
function statusTag(s: string) {
  if (["NEEDS_ASSIGNMENT", "BLOCKED", "SOURCE_MISSING_REVIEW"].includes(s)) return "tag tag-red";
  if (["ACTIVE", "CONFIRMED", "DONE"].includes(s)) return "tag tag-green";
  if (["HIGH", "SCHEDULED"].includes(s)) return "tag tag-gold";
  return "tag";
}

interface StayAppProps {
  dashboard: Dashboard;
  dashboardLive: boolean;
  reservations: Reservation[];
  totals: Totals;
  monthly: MonthlyRevenue[];
  transactionsLive: boolean;
}

export function StayApp({ dashboard, dashboardLive, reservations, totals, monthly, transactionsLive }: StayAppProps) {
  const [view, setView] = useState<View>("dashboard");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  const selected = useMemo(() => reservations.find((r) => r.code === selectedCode) ?? null, [reservations, selectedCode]);
  const maxGross = useMemo(() => Math.max(1, ...monthly.map((m) => m.gross)), [monthly]);
  const nextArrival = dashboard.upcoming_checkins[0] ?? null;

  const go = (v: View) => { setView(v); setSelectedCode(null); };

  const copyCommand = async () => {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText("npm run kpl:sync");
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
    window.setTimeout(() => setCopyStatus("idle"), 1800);
  };

  return (
    <div className="stay-shell">
      <aside className="stay-sidebar">
        <div className="stay-brand">
          <div className="stay-brand-mark"><Waves size={17} /></div>
          <div>
            <div className="stay-brand-name">Kendall Pond</div>
            <div className="stay-brand-sub">STAY OPERATIONS</div>
          </div>
        </div>
        <nav className="stay-nav" aria-label="Stay operations">
          {NAV.map(([key, label, Icon]) => (
            <button
              key={key}
              className={`nav-item ${view === key ? "active" : ""}`}
              aria-current={view === key ? "page" : undefined}
              onClick={() => go(key)}
            >
              <Icon size={16} strokeWidth={1.9} />
              {label}
            </button>
          ))}
        </nav>
        <div className="stay-sidebar-foot">
          {dashboardLive ? "Live kpl-casespace sync" : "Sample CaseSpace snapshot"} ·{" "}
          {transactionsLive ? "live transaction export" : "sample transaction export"}
        </div>
      </aside>

      <main className="stay-main">
        <div className="stay-content">
          {view === "dashboard" && (
            <DashboardView
              dashboard={dashboard} totals={totals} monthly={monthly} maxGross={maxGross}
              nextArrival={nextArrival} dashboardLive={dashboardLive}
              transactionsLive={transactionsLive} go={go}
            />
          )}
          {view === "reservations" && !selected && (
            <ReservationsView reservations={reservations} transactionsLive={transactionsLive} onSelect={setSelectedCode} />
          )}
          {view === "reservations" && selected && (
            <ReservationDetail r={selected} onBack={() => setSelectedCode(null)} />
          )}
          {view === "calendar" && <CalendarView dashboard={dashboard} dashboardLive={dashboardLive} />}
          {view === "turnovers" && <TurnoversView dashboard={dashboard} dashboardLive={dashboardLive} />}
          {view === "financials" && (
            <FinancialsView totals={totals} monthly={monthly} maxGross={maxGross} transactionsLive={transactionsLive} />
          )}
          {view === "sync" && <SyncView copyStatus={copyStatus} onCopy={copyCommand} />}
        </div>
      </main>
    </div>
  );
}

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <header className="stay-heading">
      <h1>{title}</h1>
      <p>{sub}</p>
    </header>
  );
}

function BarChart({ monthly, maxGross }: { monthly: MonthlyRevenue[]; maxGross: number }) {
  const summary = monthly.length > 0
    ? monthly.map((m) => `${m.month}: ${usd(m.gross)}`).join(", ")
    : "No revenue rows in this export.";
  return (
    <div className="bar-chart" role="img" aria-label={`Gross revenue by month. ${summary}`}>
      {monthly.map((m) => (
        <div key={m.month} className="bar-chart-col">
          <div className="bar-chart-bar" style={{ height: `${Math.max(4, (m.gross / maxGross) * 100)}%` }} title={`${m.month}: ${usd(m.gross)}`} />
          <span className="bar-chart-label">{m.month}</span>
        </div>
      ))}
    </div>
  );
}

function DashboardView({
  dashboard, totals, monthly, maxGross, nextArrival, dashboardLive, transactionsLive, go,
}: {
  dashboard: Dashboard; totals: Totals; monthly: MonthlyRevenue[]; maxGross: number;
  nextArrival: Booking | null; dashboardLive: boolean; transactionsLive: boolean; go: (v: View) => void;
}) {
  const kpis = [
    ["Gross earnings", usd(totals.gross), `${totals.count} reservations`],
    ["Net payout", usd(totals.net, true), "after Airbnb fee"],
    ["Booked nights", String(totals.nights), "from transaction export"],
    ["Avg. nightly", usd(totals.avgNightly), "gross / night"],
    ["Turnovers needed", String(dashboard.counts.turnovers_needed), "from CaseSpace sync"],
    ["Needs attention", String(dashboard.counts.blocked_cases), "unassigned / blocked"],
  ] as const;

  return (
    <>
      <Heading title="Operations" sub={`${dashboard.property} · financials from the transaction export, status from CaseSpace sync`} />
      {(!dashboardLive || !transactionsLive) && (
        <div className="note-banner">
          Showing sample {[
            !dashboardLive && "bookings and turnovers",
            !transactionsLive && "reservations and financials",
          ].filter(Boolean).join(" plus ")}. Open Sync for the two refresh paths.
        </div>
      )}
      <div className="kpi-grid">
        {kpis.map(([label, value, note], i) => (
          <div key={label} className="card card-pad">
            <div className="kpi-label">{label}</div>
            <div className="kpi-value">{value}</div>
            <div className={`kpi-note${i === 5 && dashboard.counts.blocked_cases > 0 ? " attn" : ""}`}>{note}</div>
          </div>
        ))}
      </div>
      <div className="grid-2">
        <div className="card card-pad">
          <div className="kpi-label">Gross revenue by month</div>
          <div style={{ height: 220, marginTop: "1rem" }}><BarChart monthly={monthly} maxGross={maxGross} /></div>
        </div>
        <div className="card card-pad">
          <div className="kpi-label">Next check-in</div>
          {nextArrival ? (
            <div style={{ marginTop: "0.9rem", borderLeft: "2px solid var(--gold)", paddingLeft: "1rem" }}>
              <p style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>{nextArrival.guest_name ?? "Airbnb Guest"}</p>
              <p style={{ margin: "0.3rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                {mmm(nextArrival.check_in_date)} – {mmm(nextArrival.checkout_date)}
              </p>
              <div style={{ marginTop: "0.6rem" }}><span className="tag tag-gold">Airbnb</span></div>
            </div>
          ) : (
            <p style={{ marginTop: "0.9rem", color: "var(--muted)", fontSize: "0.9rem" }}>No upcoming check-ins staged.</p>
          )}
          <button className="back-link" style={{ marginTop: "1.4rem" }} onClick={() => go("reservations")}>
            All reservations <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </>
  );
}

function ReservationsView({
  reservations, transactionsLive, onSelect,
}: { reservations: Reservation[]; transactionsLive: boolean; onSelect: (code: string) => void }) {
  return (
    <>
      <Heading title="Reservations" sub={`${reservations.length} stays from the Airbnb transaction history export.`} />
      {!transactionsLive && (
        <div className="note-banner">
          Sample transaction export shown. Drop a real one at <code>data/kpl/transactions.csv</code> (Airbnb host ›
          Earnings › Transaction History › Export CSV) to see live figures here.
        </div>
      )}
      <div className="card table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Guest</th><th>Confirmation</th><th>Dates</th><th>Nights</th><th>Gross</th><th /></tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.code}>
                <td style={{ fontWeight: 700 }}>
                  <button className="table-link" onClick={() => onSelect(r.code)}>{r.guest}</button>
                </td>
                <td className="muted-cell" style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.8rem" }}>{r.code}</td>
                <td>{mmm(r.start)} – {mmm(r.end)}</td>
                <td>{r.nights}</td>
                <td style={{ fontWeight: 700 }}>{usd(r.gross)}</td>
                <td><ChevronRight size={15} color="var(--muted)" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ReservationDetail({ r, onBack }: { r: Reservation; onBack: () => void }) {
  return (
    <>
      <button className="back-link" onClick={onBack}><ArrowLeft size={15} /> All reservations</button>
      <Heading title={r.guest} sub={`Airbnb confirmation ${r.code}`} />
      <div className="grid-2-even">
        <div className="card card-pad">
          <div className="kpi-label">Stay</div>
          <div className="stack" style={{ marginTop: "1rem", gridTemplateColumns: "repeat(3, 1fr)", display: "grid" }}>
            <div><p className="muted-cell" style={{ fontSize: "0.8rem", margin: 0 }}>Check-in</p><p style={{ fontWeight: 800, fontSize: "1.15rem", margin: "0.2rem 0 0" }}>{mmm(r.start)}</p></div>
            <div><p className="muted-cell" style={{ fontSize: "0.8rem", margin: 0 }}>Check-out</p><p style={{ fontWeight: 800, fontSize: "1.15rem", margin: "0.2rem 0 0" }}>{mmm(r.end)}</p></div>
            <div><p className="muted-cell" style={{ fontSize: "0.8rem", margin: 0 }}>Nights</p><p style={{ fontWeight: 800, fontSize: "1.15rem", margin: "0.2rem 0 0" }}>{r.nights}</p></div>
          </div>
          <p className="muted-cell" style={{ fontSize: "0.82rem", marginTop: "1rem" }}>Booked {mmm(r.booked)}.</p>
        </div>
        <div className="card card-pad">
          <div className="kpi-label">Reservation value</div>
          <p style={{ fontSize: "2rem", fontWeight: 800, margin: "0.6rem 0 0" }}>{usd(r.gross)}</p>
          <p className="muted-cell" style={{ fontSize: "0.85rem", margin: "0.2rem 0 0" }}>Gross earnings</p>
          <div style={{ marginTop: "1rem" }}>
            <div className="ledger-row"><span>Airbnb service fee</span><span style={{ color: "var(--rust)" }}>−{usd(r.fee, true)}</span></div>
            {r.clean > 0 && <div className="ledger-row"><span>Cleaning fee</span><span>{usd(r.clean, true)}</span></div>}
            {r.pet > 0 && <div className="ledger-row"><span>Pet fee</span><span>{usd(r.pet, true)}</span></div>}
            <div className="ledger-row"><span>Occupancy tax (remitted)</span><span>{usd(r.tax, true)}</span></div>
            <div className="ledger-row total"><span>Net payout</span><span>{usd(r.amount, true)}</span></div>
          </div>
        </div>
      </div>
    </>
  );
}

function CalendarView({ dashboard, dashboardLive }: { dashboard: Dashboard; dashboardLive: boolean }) {
  const [y, m] = dashboard.now_date.split("-").map(Number);
  const monthLabel = new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const daysInMonth = new Date(y, m, 0).getDate();
  const firstDow = new Date(y, m - 1, 1).getDay();
  const pad = (d: number) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const checkIns = new Map(dashboard.all_cases.filter((c): c is Booking => "check_in_date" in c).map((c) => [c.check_in_date, c]));
  const checkOuts = new Map(dashboard.all_cases.filter((c): c is Booking => "checkout_date" in c).map((c) => [c.checkout_date, c]));
  const turnoverDates = new Set(dashboard.turnovers_needed.map((t) => t.turnover_date));

  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <>
      <Heading title="Calendar" sub={`${monthLabel} · check-ins, checkouts, and turnovers from the CaseSpace sync.`} />
      {!dashboardLive && (
        <div className="note-banner">Sample CaseSpace snapshot. Open Sync to load the current booking calendar.</div>
      )}
      <div className="card card-pad">
        <div className="cal-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="cal-dow">{d}</div>)}
          {cells.map((day, i) => {
            if (day === null) return <div key={i} className="cal-cell empty" />;
            const iso = pad(day);
            const arriving = checkIns.get(iso);
            const departing = checkOuts.get(iso);
            const turning = turnoverDates.has(iso);
            const busy = Boolean(arriving || departing);
            return (
              <div key={i} className={`cal-cell${busy ? " busy" : ""}`}>
                <div className="cal-daynum">{day}</div>
                {arriving && <div className="cal-chip in">Check-in</div>}
                {departing && <div className="cal-chip out">Check-out</div>}
                {turning && <div className="cal-chip turn">Turnover</div>}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function TurnoversView({ dashboard, dashboardLive }: { dashboard: Dashboard; dashboardLive: boolean }) {
  return (
    <>
      <Heading title="Turnovers" sub="Cleaning and changeover tasks staged from the CaseSpace sync." />
      {!dashboardLive && (
        <div className="note-banner">Sample CaseSpace snapshot. Run <code>npm run kpl:sync</code> for live turnovers.</div>
      )}
      <div className="stack">
        {dashboard.turnovers_needed.map((t) => (
          <div key={t.case_id} className="card card-pad" style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: "var(--cream)", display: "grid", placeItems: "center", color: "var(--green)", flexShrink: 0 }}>
              <Sparkles size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "0.92rem" }}>{mmm(t.turnover_date)} turnover</p>
              <p className="muted-cell" style={{ margin: "0.15rem 0 0", fontSize: "0.8rem" }}>
                Next check-in: {t.next_checkin_date ? mmm(t.next_checkin_date) : "— season end"}
              </p>
            </div>
            <span className={priorityTag(t.priority)}>{t.priority.replace(/_/g, " ")}</span>
            <span className={t.cleaner === "unassigned" ? "muted-cell" : ""} style={{ fontSize: "0.85rem", minWidth: 90 }}>{t.cleaner}</span>
            <span className={statusTag(t.status)}>{t.status.replace(/_/g, " ")}</span>
          </div>
        ))}
        {dashboard.turnovers_needed.length === 0 && <p className="muted-cell">No turnovers pending.</p>}
      </div>
    </>
  );
}

function FinancialsView({
  totals, monthly, maxGross, transactionsLive,
}: { totals: Totals; monthly: MonthlyRevenue[]; maxGross: number; transactionsLive: boolean }) {
  return (
    <>
      <Heading title="Financials" sub="Computed from the Airbnb transaction history export — no property costs included." />
      {!transactionsLive && (
        <div className="note-banner">Sample transaction export shown. Open Sync to load the current Airbnb export.</div>
      )}
      <div className="grid-2">
        <div className="card card-pad">
          <div className="kpi-label">Payout ledger</div>
          <div style={{ marginTop: "0.75rem" }}>
            <div className="ledger-row"><span>Gross earnings</span><span style={{ fontWeight: 700 }}>{usd(totals.gross)}</span></div>
            <div className="ledger-row"><span>Airbnb service fee</span><span style={{ fontWeight: 700, color: "var(--rust)" }}>−{usd(totals.fee, true)}</span></div>
            <div className="ledger-row"><span>Cleaning fees collected</span><span>{usd(totals.clean, true)}</span></div>
            <div className="ledger-row"><span>Pet fees collected</span><span>{usd(totals.pet, true)}</span></div>
            <div className="ledger-row"><span>Occupancy tax (remitted)</span><span>{usd(totals.tax, true)}</span></div>
            <div className="ledger-row total"><span>Net payout</span><span>{usd(totals.net, true)}</span></div>
          </div>
        </div>
        <div className="card card-pad">
          <div className="kpi-label">Gross by month</div>
          <div style={{ height: 220, marginTop: "1rem" }}><BarChart monthly={monthly} maxGross={maxGross} /></div>
          <p className="muted-cell" style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
            {totals.count} reservations · {totals.nights} nights · {usd(totals.avgNightly)}/night gross
          </p>
        </div>
      </div>
    </>
  );
}

function SyncView({
  copyStatus, onCopy,
}: { copyStatus: "idle" | "copied" | "error"; onCopy: () => void }) {
  return (
    <>
      <Heading title="Sync" sub="This dashboard reads committed/local files — it does not fetch Airbnb itself." />
      <div className="grid-2">
        <div className="card card-pad">
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <div style={{ background: "var(--cream)", color: "var(--green)", borderRadius: 10, padding: "0.5rem" }}><Terminal size={18} /></div>
            <div>
              <div className="kpi-label">Refresh bookings &amp; turnovers</div>
              <p className="muted-cell" style={{ fontSize: "0.88rem", marginTop: "0.4rem" }}>
                Set <code>AIRBNB_KPL_ICAL_URL</code> in <code>publiclogic/.env</code> (never commit it), then sync from
                the repo root.
              </p>
            </div>
          </div>
          <button className="code-block" onClick={onCopy} style={{ marginTop: "1.25rem" }}>
            <span>{copyStatus === "error" ? "Copy failed — run: npm run kpl:sync" : "npm run kpl:sync"}</span>
            {copyStatus === "copied" ? <Check size={16} /> : <Copy size={16} />}
          </button>
          <div className="note-banner" style={{ marginTop: "1rem" }}>
            This writes <code>data/kpl/dashboard.json</code>, which the Dashboard, Calendar, and Turnovers views read
            automatically — no restart needed in dev.
          </div>
        </div>
        <div className="card card-pad">
          <div className="kpi-label">Refresh financials</div>
          <ol style={{ margin: "0.9rem 0 0", paddingLeft: "1.1rem", fontSize: "0.88rem", lineHeight: 1.7, color: "var(--ink)" }}>
            <li>Airbnb host dashboard → <strong>Earnings</strong> → <strong>Transaction History</strong>.</li>
            <li>Export the CSV for the date range you want.</li>
            <li>Save it as <code>data/kpl/transactions.csv</code> (repo root) — gitignored, same as the bookings data.</li>
          </ol>
          <p className="muted-cell" style={{ fontSize: "0.82rem", marginTop: "0.9rem" }}>
            This export carries guest names and dollar amounts the iCal feed never does, which is why Reservations
            and Financials are sourced from it instead.
          </p>
        </div>
      </div>
    </>
  );
}
