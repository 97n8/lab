import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";
import dashboard from "./sample-dashboard.json";

export const metadata: Metadata = {
  title: "KPL CaseSpace | PublicLogic",
  description:
    "Kendall Pond Lodge STAY cockpit — Airbnb iCal reservations as Booking and Turnover CaseSpaces.",
};

type Booking = {
  case_id: string;
  guest_name: string | null;
  check_in_date: string;
  checkout_date: string;
  status: string;
};

type Turnover = {
  case_id: string;
  turnover_date: string;
  next_checkin_date: string | null;
  priority: string;
  cleaner: string;
  status: string;
};

const c = dashboard.counts;

function priorityClass(p: string) {
  if (p === "SAME_DAY") return "tag tag-red";
  if (p === "HIGH") return "tag tag-gold";
  return "tag";
}

function statusClass(s: string) {
  if (s === "NEEDS_ASSIGNMENT" || s === "BLOCKED" || s === "SOURCE_MISSING_REVIEW") return "tag tag-red";
  if (s === "ACTIVE") return "tag tag-green";
  return "tag";
}

export default function KplPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="STAY · CaseSpace"
          title="Kendall Pond Lodge."
          lede="A lightweight STAY cockpit. The official Airbnb iCal export feeds in; every reservation becomes a Booking case, every checkout an automatic Turnover case."
        />

        <section className="section">
          <div className="note-banner">
            Sample feed shown (synthetic fixture, as of {dashboard.now_date}). Live data comes from
            running <code>npm run kpl:sync</code> with <code>AIRBNB_KPL_ICAL_URL</code> set locally —
            the private export URL is never deployed or logged.
          </div>

          <div className="stat-grid">
            <Stat n={c.active_bookings} label="Active bookings" />
            <Stat n={c.upcoming_checkins} label="Upcoming check-ins" />
            <Stat n={c.upcoming_checkouts} label="Upcoming checkouts" />
            <Stat n={c.turnovers_needed} label="Turnovers needed" />
            <Stat n={c.blocked_cases} label="Needs attention" accent />
            <Stat n={c.total_cases} label="Total cases" />
          </div>
        </section>

        <section className="section">
          <p className="eyebrow">Turnovers needed</p>
          <div className="table-wrap">
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
                    <td>{t.turnover_date}</td>
                    <td>{t.next_checkin_date ?? "—"}</td>
                    <td><span className={priorityClass(t.priority)}>{t.priority}</span></td>
                    <td>{t.cleaner}</td>
                    <td><span className={statusClass(t.status)}>{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section">
          <p className="eyebrow">Upcoming check-ins</p>
          <div className="table-wrap">
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
                    <td>{b.guest_name ?? "—"}</td>
                    <td>{b.check_in_date}</td>
                    <td>{b.checkout_date}</td>
                    <td><span className={statusClass(b.status)}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
