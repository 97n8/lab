import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";

export const metadata: Metadata = {
  title: "Proof",
  description: "PublicLogic closes work with a usable record, a clean handoff, and lessons the institution can carry into the next cycle.",
};

const RECORD = [
  "What happened and when",
  "What was decided and by whom",
  "Which evidence supports the work",
  "What remains open",
  "Who carries the next step",
  "What should change next time",
];

const EXAMPLES = [
  { href: "/muni", tag: "Municipal operations", h: "Town HR continuity", p: "See how one employee matter stays connected across people, decisions, documents, and handoffs." },
  { href: "/cemetery", tag: "Public records", h: "Cemetery record", p: "See how a permanent public record can stay understandable, complete, and ready to verify." },
  { href: "/job", tag: "Project delivery", h: "Small contractor job", p: "See how everyday project activity becomes a clean record for payroll, billing, and closeout." },
];

export default function ProofPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageIntro
          eyebrow="Proof"
          title="The work should leave something useful behind."
          lede="A project is not fully finished when the meeting ends or the packet goes out. It is finished when the next person can understand what happened, trust the record, and carry the work forward."
        />

        <section className="section split">
          <div>
            <p className="eyebrow">A usable closeout</p>
            <h2>Proof is not paperwork for its own sake.</h2>
            <p className="lede">
              It is the shared memory of the work: clear enough to answer questions later and useful enough to improve the next cycle.
            </p>
          </div>
          <ul className="proof-list">
            {RECORD.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section className="section">
          <div className="section-heading">
            <p className="eyebrow">Working examples</p>
            <h2>See what continuity looks like.</h2>
            <p>These are demonstration environments, not client records. Each shows the same idea in a different kind of work.</p>
          </div>
          <div className="example-grid">
            {EXAMPLES.map((example) => (
              <Link className="example-card" href={example.href} key={example.h}>
                <span>{example.tag}</span>
                <h3>{example.h}</h3>
                <p>{example.p}</p>
                <strong>Open the example →</strong>
              </Link>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="final-cta">
            <p className="eyebrow">Close the loop</p>
            <h2>Give the next person a better place to start.</h2>
            <p>Every PublicLogic engagement is designed to leave behind clearer ownership, a stronger record, and a practical next step.</p>
            <Link className="button primary" href="/contact">Talk with PublicLogic</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
