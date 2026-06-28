import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

const MOAT = ["Traceable intake", "Living case record", "Decisions & artifacts captured", "Immutable closeout"];
const MOAT_WINS = [
  { h: "Fewer re-entries", p: "The same fact isn’t typed into five tools." },
  { h: "Faster closeout", p: "No Friday-night reconstruction to close a job." },
  { h: "Cleaner audits", p: "The proof is already assembled and ordered." },
  { h: "Less institutional amnesia", p: "The record stays when the person leaves." },
];

const HOW = [
  { n: "1", h: "Intake", p: "form, email, calendar" },
  { n: "2", h: "CaseSpace", p: "one record opens" },
  { n: "3", h: "Events", p: "time, notes, files, approvals" },
  { n: "4", h: "Close", p: "freeze, export, archive" },
  { n: "5", h: "Continuity", p: "survives turnover" },
];

const PILOTS = [
  {
    tag: "Small Contractor",
    href: "/job",
    sub: "Electrician with 2 employees",
    text: "Hours, materials, photos, and decisions in one job record — payroll-ready and invoice-ready without Friday-night reconstruction.",
    stat: "$10K/yr + 4 hrs/mo saved",
    note: "representative industry benchmark",
  },
  {
    tag: "Town HR",
    href: "/muni",
    sub: "Intake → onboarding → offboarding",
    text: "One governed employee case from accepted offer to exit, coordinated across HR, payroll, IT, and supervisor.",
    stat: "~35% time savings",
    note: "representative public-sector benchmark",
  },
  {
    tag: "Cemetery Records",
    href: "/cemetery",
    sub: "Unexpected proof",
    text: "Burial request, deed, fees, scheduling, and permit on one timeline — where the record itself is the service.",
    stat: "Permanent retention",
    note: "the record should stay, provably",
  },
];

const TOOLS = [
  "Gmail", "Drive", "Sheets", "QuickBooks", "Calendar", "DocuSign",
  "iCal", "Airbnb", "SharePoint", "CivicPlus", "GitHub",
];

const PIPELINE = [
  "Seed", "Form", "CaseSpace", "Recordstream", "Evidence",
  "Gate", "Check", "Digest", "Packet", "Seal",
];

const WHY = [
  "Simple enough for a tiny shop.",
  "Rigorous enough for town hall.",
  "Turns everyday work into a trustworthy record.",
];

const PROOF = [
  "Time-stamped every step",
  "Provenance for every change",
  "Immutable closeout",
  "Exportable anytime",
  "Built for audits, retention, and trust",
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section hero">
          <p className="eyebrow">The governance-aware continuity layer for real work</p>
          <h1>Don’t replace your stack. Give it a spine.</h1>
          <p className="lede">
            One time-stamped record from intake to exit — fast enough for everyday work, defensible
            enough for audits, turnover, and retention. PuddleJumper governs what your tools already
            produce; it doesn’t replace them.
          </p>
          <div className="actions">
            <Link className="button primary" href="/muni">See it live</Link>
            <Link className="button secondary" href="/work">Start with the work</Link>
          </div>
        </section>

        {/* The Moat */}
        <section className="section">
          <p className="eyebrow">The moat</p>
          <h2>Traceable in. Immutable out.</h2>
          <div className="flow-chips moat-flow">
            {MOAT.map((step, i) => (
              <span key={step} className="chip">
                {step}
                {i < MOAT.length - 1 ? <span className="chip-arrow" aria-hidden="true">→</span> : null}
              </span>
            ))}
          </div>
          <div className="grid grid-2">
            {MOAT_WINS.map((w) => (
              <article key={w.h} className="card"><h3>{w.h}</h3><p>{w.p}</p></article>
            ))}
          </div>
        </section>

        {/* Not workflow tools — dropped balls */}
        <section className="section">
          <p className="eyebrow">The real competition</p>
          <h2>Not workflow tools — dropped balls.</h2>
          <p className="lede">
            PuddleJumper isn’t competing with workflow tools. It’s competing with dropped balls,
            missing proof, orphaned decisions, and institutional memory loss. That is the market.
          </p>
          <div className="grid grid-2">
            <article className="card"><h3>Dropped balls</h3><p>Work that quietly stops moving because no one owns the next step.</p></article>
            <article className="card"><h3>Missing proof</h3><p>It happened, but nothing shows it happened — or who decided what.</p></article>
            <article className="card"><h3>Orphaned decisions</h3><p>Choices made in a thread, lost the moment the thread scrolls away.</p></article>
            <article className="card"><h3>Memory loss</h3><p>The person who knew leaves, and the institution forgets.</p></article>
          </div>
        </section>

        {/* How PJ Works */}
        <section className="section">
          <p className="eyebrow">How PJ works</p>
          <h2>Five steps. Every case.</h2>
          <div className="how-grid">
            {HOW.map((s) => (
              <div key={s.n} className="how-step">
                <span className="how-num">{s.n}</span>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
          <p className="how-line">
            Every intake becomes a case. Every change becomes an event. Every close becomes an
            <strong> immutable packet.</strong>
          </p>
          <details className="how-details">
            <summary>Underneath: ten steps, every time</summary>
            <div className="flow-chips">
              {PIPELINE.map((step, i) => (
                <span key={step} className="chip">
                  {step}
                  {i < PIPELINE.length - 1 ? <span className="chip-arrow" aria-hidden="true">→</span> : null}
                </span>
              ))}
            </div>
          </details>
        </section>

        {/* Three live pilots */}
        <section className="section">
          <p className="eyebrow">Clickable proof</p>
          <h2>Three pilots. Three live demos.</h2>
          <p className="lede">
            The same runtime, in three very different kinds of work — each one a working demo you can
            seal and verify in your browser.
          </p>
          <div className="pilot-grid">
            {PILOTS.map((p) => (
              <Link key={p.tag} href={p.href} className="pilot-card">
                <span className="pilot-tag">{p.tag}</span>
                <span className="pilot-sub">{p.sub}</span>
                <p>{p.text}</p>
                <span className="pilot-stat">{p.stat}</span>
                <span className="pilot-note">{p.note}</span>
                <span className="pilot-cta">See it live →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* The wedge */}
        <section className="section split">
          <div>
            <p className="eyebrow">The wedge</p>
            <h2>Your tools can stay messy. The record cannot.</h2>
            <p className="lede">
              You don’t need to replace Gmail, Drive, QuickBooks, the HRIS, or the spreadsheet. You
              need to govern what those tools are already producing.
            </p>
            <p className="muted-note">Most software wants to become the system of record. We don’t.</p>
          </div>
          <div className="panel">
            <p className="eyebrow">Keep your tools</p>
            <div className="flow-chips">
              {TOOLS.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Why it wins */}
        <section className="section">
          <p className="eyebrow">Why it wins</p>
          <h2>Small enough to use. Rigorous enough to trust.</h2>
          <ul className="why-grid">
            {WHY.map((w) => (
              <li key={w}><span className="why-check" aria-hidden="true">✓</span>{w}</li>
            ))}
          </ul>
        </section>

        {/* CTA + proof strip */}
        <section className="section">
          <div className="panel cta-panel">
            <p className="eyebrow">Proof is the product</p>
            <h2>Everything else is packaging.</h2>
            <p className="lede">A clean path, a live record, and a sealed handoff — for whatever your work actually is.</p>
            <div className="actions">
              <Link className="button primary" href="/contact">Get in touch</Link>
              <Link className="button secondary" href="/cemetery">See the permanent record</Link>
            </div>
          </div>
          <ul className="proof-strip">
            {PROOF.map((p) => (
              <li key={p}><span className="proof-dot" aria-hidden="true" />{p}</li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
