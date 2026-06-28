import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

const QUESTIONS = [
  "What came in?",
  "Who owns it?",
  "What proof exists?",
  "What is missing?",
  "Who can decide?",
  "What was decided?",
  "What changed?",
  "What is next?",
  "What closes the record?",
  "What packet proves it?",
];

const PIPELINE = [
  "Seed", "Form", "CaseSpace", "Recordstream", "Evidence",
  "Gate", "Check", "Digest", "Packet", "Seal",
];

const TOOLS = [
  "Gmail", "Drive", "Sheets", "Airtable", "Notion", "Asana", "Monday",
  "Salesforce", "DocuSign", "iCal", "Airbnb", "CivicPlus", "Polimorphic", "GitHub",
];

const LANES = [
  { tag: "STAY", text: "Your property has a live operating record, not scattered texts." },
  { tag: "MUNI", text: "Your public process has a lawful, traceable file." },
  { tag: "PROJECT", text: "Your project has funder-ready proof, not a messy folder." },
  { tag: "BIZ", text: "Your client work has a path, record, and closeout packet." },
  { tag: "Single / Duo", text: "Upload a seed. Get a housed asset set, document set, and forms with teeth." },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section hero">
          <p className="eyebrow">A governed work runtime</p>
          <h1>Proof is the product.</h1>
          <p className="lede">
            A clean path, a live record, and a sealed handoff for messy work. PuddleJumper governs
            what your tools already produce — it doesn’t replace them.
          </p>
          <div className="actions">
            <Link className="button primary" href="/work">Start with the work</Link>
            <Link className="button secondary" href="/stay">See STAY live</Link>
          </div>
        </section>

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

        <section className="section">
          <p className="eyebrow">The missing layer</p>
          <h2>The governed explanation layer.</h2>
          <p className="lede">
            The pieces are everywhere. What’s missing is the layer that answers — for any unit of work:
          </p>
          <div className="q-grid">
            {QUESTIONS.map((q) => (
              <div key={q} className="q"><span className="q-dot" aria-hidden="true" />{q}</div>
            ))}
          </div>
        </section>

        <section className="section split">
          <div>
            <p className="eyebrow">The wedge</p>
            <h2>Your tools can stay messy. The record cannot.</h2>
            <p className="lede">
              You don’t need to replace Gmail, Drive, Airbnb, CivicPlus, or the spreadsheet. You need
              to govern what those tools are already producing.
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

        <section className="section">
          <p className="eyebrow">The moat is the discipline</p>
          <h2>Ten steps. Every time.</h2>
          <p className="lede">The moat isn’t the UI — it’s the discipline that runs underneath every case.</p>
          <div className="flow-chips">
            {PIPELINE.map((step, i) => (
              <span key={step} className="chip">
                {step}
                {i < PIPELINE.length - 1 ? <span className="chip-arrow" aria-hidden="true">→</span> : null}
              </span>
            ))}
          </div>
          <div className="grid">
            <article className="card"><h3>1 · A source</h3><p>Something PJ can pull from.</p></article>
            <article className="card"><h3>2 · A governed object</h3><p>Something PJ can track.</p></article>
            <article className="card"><h3>3 · An output</h3><p>Something PJ can seal, send, publish, or archive.</p></article>
          </div>
          <p className="muted-note">Once that exists, every customer request becomes one of those three things.</p>
        </section>

        <section className="section">
          <p className="eyebrow">One runtime, every lane</p>
          <h2>The same promise, in their words.</h2>
          <ul className="list">
            {LANES.map((l) => (
              <li key={l.tag}>
                <strong>{l.tag}</strong>
                <span>{l.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="section">
          <div className="panel cta-panel">
            <p className="eyebrow">Proof is the product</p>
            <h2>Everything else is packaging.</h2>
            <p className="lede">A clean path, a live record, and a sealed handoff — for whatever your work actually is.</p>
            <div className="actions">
              <Link className="button primary" href="/contact">Get in touch</Link>
              <Link className="button secondary" href="/stay">See STAY live</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
