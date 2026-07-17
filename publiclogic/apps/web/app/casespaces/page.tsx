import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";

export const metadata: Metadata = {
  title: "CaseSpaces",
  description: "A CaseSpace gives one important piece of work a clear home for its people, sources, decisions, deadlines, evidence, and next steps.",
};

const CONTENTS = [
  { h: "Purpose", p: "What the work is trying to accomplish and what a good finish looks like." },
  { h: "People", p: "Who owns, contributes, reviews, approves, and carries the next step." },
  { h: "Sources", p: "The files, messages, records, and facts the work depends on." },
  { h: "Movement", p: "The tasks, deadlines, dependencies, and open questions that shape the path." },
  { h: "Decisions", p: "What was decided, by whom, and why it made sense at the time." },
  { h: "Closeout", p: "What happened, what remains, and what the next person needs to know." },
];

export default function CaseSpacesPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageIntro
          eyebrow="CaseSpaces"
          title="Give the work one clear place to live."
          lede="A CaseSpace is a working home for one matter, project, grant, permit, property, program, or institutional process. It keeps the people, context, decisions, and next steps together without forcing every tool to change."
        />

        <section className="section">
          <div className="grid grid-3">
            {CONTENTS.map((item) => (
              <article className="card plain-card" key={item.h}>
                <h3>{item.h}</h3>
                <p>{item.p}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="home-statement inset-statement">
            <div>
              <p className="eyebrow">Why it matters</p>
              <h2>People can join the work without reconstructing it.</h2>
              <p>
                A new staff member, partner, reviewer, or leader can see what is happening,
                understand what came before, and pick up the next step without starting over.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="final-cta">
            <p className="eyebrow">CaseSpace Build</p>
            <h2>Start with one process that needs a better home.</h2>
            <Link className="button primary" href="/contact">Build a CaseSpace</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
