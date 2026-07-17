import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";

export const metadata: Metadata = {
  title: "PuddleJumper",
  description: "PuddleJumper is the PublicLogic runtime that helps important work keep its path, context, decisions, evidence, and handoff.",
};

const PRINCIPLES = [
  {
    h: "Keep the tools that already work",
    p: "PuddleJumper is not trying to replace every inbox, calendar, document, or business system. It helps connect what those tools produce.",
  },
  {
    h: "Keep people in the decision",
    p: "The runtime can organize and surface what matters, but authority and judgment stay with the people responsible for the work.",
  },
  {
    h: "Keep the record with the institution",
    p: "The path, evidence, decisions, and closeout remain understandable and transferable when people or systems change.",
  },
];

const PROVEN = [
  {
    h: "Responsibility stays visible",
    p: "Work remains tied to the right institution, role, and owner instead of floating between people and systems.",
  },
  {
    h: "Approval comes before action",
    p: "Important outside actions can wait for an authorized person instead of moving silently or automatically.",
  },
  {
    h: "History is added, not rewritten",
    p: "Changes build a record of what happened, when it happened, and how the work reached its current state.",
  },
  {
    h: "The working view comes from the record",
    p: "CaseSpaces reflect real runtime information, so the calm view people use is connected to the evidence underneath.",
  },
];

export default function PJPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageIntro
          eyebrow="PuddleJumper"
          title="The quiet structure underneath the work."
          lede="PuddleJumper is the PublicLogic runtime. It helps an institution keep the path, context, decisions, evidence, and handoff connected while people continue using the tools they know."
        />

        <section className="section">
          <div className="grid grid-3">
            {PRINCIPLES.map((item) => (
              <article className="card plain-card" key={item.h}>
                <h3>{item.h}</h3>
                <p>{item.p}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="stewardship-panel">
            <div>
              <p className="eyebrow">What people see</p>
              <h2>A plain path through complicated work.</h2>
            </div>
            <div className="pj-flow">
              <span>A request comes in</span>
              <span>The work gets a home</span>
              <span>People move it together</span>
              <span>The record carries forward</span>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <p className="eyebrow">Working now</p>
            <h2>This is built, not imagined.</h2>
            <p>
              PuddleJumper already supports the core disciplines that make institutional work
              transferable and trustworthy.
            </p>
          </div>
          <div className="grid grid-2">
            {PROVEN.map((item) => (
              <article className="service-card" key={item.h}>
                <h3>{item.h}</h3>
                <p>{item.p}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="ownership-grid">
            <div>
              <p className="eyebrow">Technology in its place</p>
              <h2>The runtime supports stewardship. It does not replace it.</h2>
            </div>
            <div>
              <p>
                PublicLogic starts with the institution, the people, and the work. PuddleJumper
                helps the resulting system stay clear and dependable. It is the structure under
                the practice—not the reason the practice exists.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="final-cta">
            <p className="eyebrow">See the working idea</p>
            <h2>Open a live municipal example.</h2>
            <p>Explore a demonstration CaseSpace and see how the thread stays connected from the first fact through the final handoff.</p>
            <div className="actions centered-actions">
              <Link className="button primary" href="/muni">Open the example</Link>
              <Link className="button secondary" href="/casespaces">Learn about CaseSpaces</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
