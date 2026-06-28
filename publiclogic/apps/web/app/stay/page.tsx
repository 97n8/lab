import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import dashboard from "../kpl/sample-dashboard.json";

export const metadata: Metadata = {
  title: "STAY · Operator Dashboard | PublicLogic",
  description:
    "Kendall Pond Lodge operator dashboard — bookings and turnovers as governed CaseSpaces.",
};

// NOTE: v0 lives under apps/web; this is the precursor to apps/stay. Data is the
// committed sample snapshot; live data comes from `npm run kpl:sync`.

type Booking = {
  case_id: string;
  guest_name: string | null;
  check_in_date: string;
  checkout_date: string;
  status: string;
};
type Turnover = {
  case_id: string;
  booking_case_id: string;
  turnover_date: string;
  next_checkin_date: string | null;
  priority: string;
  cleaner: string;
  status: string;
};

const c = dashboard.counts;
const href = (caseId: string) => `/stay/bookings/${encodeURIComponent(caseId)}`;

function priorityTag(p: string) {
  return `tag ${p === "SAME_DAY" ? "tag-red" : p === "HIGH" ? "tag-gold" : ""}`;
}
function statusTag(s: string) {
  if (["NEEDS_ASSIGNMENT", "BLOCKED", "SOURCE_MISSING_REVIEW"].includes(s)) return "tag tag-red";
  if (["ACTIVE", "CONFIRMED", "DONE"].includes(s)) return "tag tag-green";
  if (["HIGH", "SCHEDULED"].includes(s)) return "tag tag-gold";
  return "tag";
}

export default function StayDashboard() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section stay-section">
          <div className="stay-head">
            <div>
              <p className="eyebrow">STAY · Operator</p>
              <h1 className="page-title">Kendall Pond Lodge</h1>
              <p className="lede">At-a-glance operations — as of {dashboard.now_date}.</p>
            </div>
            <span className="pill-soft">Sample feed · live via <code>kpl:sync</code></span>
          </div>

          <div className="stat-grid stat-grid-6">
            <Stat n={c.active_bookings} label="Active bookings" />
            <Stat n={c.upcoming_checkins} label="Upcoming check-ins" />
            <Stat n={c.upcoming_checkouts} label="Upcoming checkouts" />
            <Stat n={c.turnovers_needed} label="Turnovers needed" />
            <Stat n={c.blocked_cases} label="Needs attention" accent />
            <Stat n={c.total_cases} label="Total cases" />
          </div>
        </section>

        <section className="section stay-section stay-layout">
          <div className="stay-main">
            <div className="panel">
              <div className="section-head">
                <h2>Turnovers needed</h2>
              </div>
              <div className="table-wrap table-flat">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Turnover date</th>
                      <th>Next check-in</th>
                      <th>Priority</th>
                      <th>Cleaner</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dashboard.turnovers_needed as Turnover[]).map((t) => (
                      <tr key={t.case_id}>
                        <td>
                          <Link className="row-link" href={href(t.booking_case_id)}>
                            {t.turnover_date}
                          </Link>
                        </td>
                        <td>{t.next_checkin_date ?? "—"}</td>
                        <td><span className={priorityTag(t.priority)}>{t.priority}</span></td>
                        <td className={t.cleaner === "unassigned" ? "muted-cell" : ""}>{t.cleaner}</td>
                        <td><span className={statusTag(t.status)}>{t.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="panel">
              <div className="section-head">
                <h2>Upcoming check-ins</h2>
              </div>
              <div className="table-wrap table-flat">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Guest</th>
                      <th>Check-in</th>
                      <th>Checkout</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dashboard.upcoming_checkins as Booking[]).map((b) => (
                      <tr key={b.case_id}>
                        <td>
                          <Link className="row-link" href={href(b.case_id)}>
                            {b.guest_name ?? "Airbnb Guest"}
                          </Link>
                        </td>
                        <td>{b.check_in_date}</td>
                        <td>{b.checkout_date}</td>
                        <td><span className={statusTag(b.status)}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <aside className="stay-aside">
            <div className="attention">
              <h3>Needs attention</h3>
              {(dashboard.blocked_cases as Turnover[]).map((b) => (
                <Link key={b.case_id} className="attention-item" href={href(b.booking_case_id || b.case_id)}>
                  <span className="attention-title">{b.status.replace(/_/g, " ")}</span>
                  <span className="attention-body">
                    {b.turnover_date
                      ? `Turnover ${b.turnover_date} — cleaner ${b.cleaner}.`
                      : "Review this case."}
                  </span>
                </Link>
              ))}
              {dashboard.blocked_cases.length === 0 && (
                <p className="muted-cell">Nothing needs attention. ✓</p>
              )}
            </div>
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Stat({ n, label, accent }: { n: number; label: string; accent?: boolean }) {
  return (
    <div className={accent && n > 0 ? "stat stat-accent" : "stat"}>
      <span className="stat-n">{n}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
