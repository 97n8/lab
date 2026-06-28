import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";

export const metadata: Metadata = {
  title: "Work | PublicLogic",
  description:
    "We govern what your tools already produce: institutional readiness, governed records, and sealed handoffs for public work and complex projects.",
};

const lanes = [
  {
    title: "Institutional Readiness",
    body: "Map how work actually moves, then turn scattered practice into clear lanes, owners, and routines that survive turnover.",
  },
  {
    title: "Governed Automation",
    body: "Automate the repetitive parts without losing the paper trail. Every step keeps its evidence, owner, and review point.",
  },
  {
    title: "Continuity Systems",
    body: "Build the memory layer so decisions, documents, and context outlast any single person or election cycle.",
  },
  {
    title: "Records & Retention",
    body: "Move completed and stale material through retention on purpose, so the system stays clean and defensible.",
  },
];

const steps = [
  { n: "01", title: "Map", body: "Sit with the real workflow and find where memory leaks." },
  { n: "02", title: "Lane", body: "Define owners, intake, evidence, and review for each lane." },
  { n: "03", title: "Build", body: "Stand up CaseSpaces, PJ routing, and the VAULT spine." },
  { n: "04", title: "Hand off", body: "Leave a system the next person can run without you." },
];

export default function WorkPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="The work"
          title="Work that holds up."
          lede="We don’t replace your tools — we govern what they produce. Institutional readiness, governed records, and sealed handoffs, proven on the work that keeps slipping."
        />

        <section className="section">
          <div className="grid grid-2">
            {lanes.map((lane) => (
              <article key={lane.title} className="card">
                <h3>{lane.title}</h3>
                <p>{lane.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <p className="eyebrow">How an engagement runs</p>
          <div className="steps">
            {steps.map((step) => (
              <div key={step.n} className="step">
                <span className="step-num">{step.n}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="panel cta-panel">
            <p className="eyebrow">Proof is the product</p>
            <h2>Pick the work that keeps slipping.</h2>
            <p className="lede">
              We start narrow, prove the system on real work, and grow it only when the pattern holds.
              You get a clean path, a live record, and a sealed handoff — everything else is packaging.
            </p>
            <div className="actions">
              <Link className="button primary" href="/contact">
                Get in touch
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
