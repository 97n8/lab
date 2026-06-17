import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

const faqs = [
  {
    q: "What's the difference between PublicLogic and PuddleJumper?",
    a: "PublicLogic is the company and the method — the fixed-fee project controls, documentation, and continuity partner. PuddleJumper is the workspace where work runs. Think of it as: PublicLogic is what you hire. PuddleJumper is where the work lives.",
  },
  {
    q: "What does 'AI assists, never decides' actually mean in practice?",
    a: "Governance Steward — the AI layer in PuddleJumper — can draft documents, summarize case history, flag missing evidence, and suggest next steps. Every consequential action (approvals, sign-offs, submissions, record closings) requires a human in the lane. The AI is the research assistant; the human is the decision-maker.",
  },
  {
    q: "What does Permit & Bridge actually do?",
    a: "It carries one project through the public process: from 'can I do this?' to ready to build. PublicLogic handles the paperwork, sequencing, coordination, and follow-up. It doesn't warrant the outcome — approval is the board's call. And it's not your attorney, engineer, or contractor. It's the project controls and the paper trail.",
  },
  {
    q: "What is a CaseSpace?",
    a: "A CaseSpace is a governed workspace for one piece of work. It holds the context, evidence, decisions, and next steps for a specific project or operation — a rental property, a grant engagement, a permit project. It's the place the work lives, so it can survive the person who started it.",
  },
  {
    q: "What does fixed-fee mean?",
    a: "Permit & Bridge Project Stewardship and most PublicLogic engagements are priced upfront, not billed by the hour. You know what you're paying before you start. For complex or multi-agency paths, we scope first and price before work begins.",
  },
  {
    q: "Can I use PuddleJumper without a PublicLogic engagement?",
    a: "PuddleJumper is access by invitation, currently in early operation with live CaseSpaces running. As the platform matures, access will expand. Contact us to start a conversation about what you're working on.",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section page-hero">
          <p className="eyebrow">Resources</p>
          <h1>What you need<br />to get started.</h1>
          <p className="lede">
            Briefs, readiness reviews, a preview of LogicCommons, and answers to the questions we hear most.
          </p>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="domain-grid" style={{ marginBottom: '3rem' }}>
            <div className="card">
              <p className="eyebrow" style={{ margin: '0 0 .75rem' }}>Briefs</p>
              <h3>Domain &amp; topic briefs</h3>
              <p>Short, direct documents on specific problems — how grant closeout works, what municipal continuity requires, when you need a ConCom filing. In preparation; first briefs releasing soon.</p>
              <a href="/contact" style={{ fontWeight: 900, color: 'var(--green)', textDecoration: 'none', fontSize: '.9rem' }}>Get notified →</a>
            </div>
            <div className="card">
              <p className="eyebrow" style={{ margin: '0 0 .75rem' }}>Readiness Review</p>
              <h3>Is the work ready to hand off?</h3>
              <p>A structured review of an active operation, project, or office against the cold-start test. We tell you where the gaps are and what it would take to close them. By conversation; reach out to schedule.</p>
              <a href="/contact" style={{ fontWeight: 900, color: 'var(--green)', textDecoration: 'none', fontSize: '.9rem' }}>Schedule a review →</a>
            </div>
            <div className="card">
              <p className="eyebrow" style={{ margin: '0 0 .75rem' }}>LogicCommons</p>
              <h3>The reusable pattern library</h3>
              <p>CORE primitives, BASE work modules, and domain skins — the building blocks that CaseSpaces are built from. A Commons preview is in preparation for release to platform partners.</p>
              <a href="/contact" style={{ fontWeight: 900, color: 'var(--green)', textDecoration: 'none', fontSize: '.9rem' }}>Learn more →</a>
            </div>
          </div>

          <p className="eyebrow" style={{ marginBottom: '2rem' }}>Frequently asked</p>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i}>
                <p className="faq-q">{faq.q}</p>
                <p className="faq-a">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
