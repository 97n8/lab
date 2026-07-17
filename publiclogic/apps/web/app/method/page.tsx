import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

const steps = [
  { n: "01", title: "Map reality", question: "What is actually happening?", body: "We inventory the live work, people, obligations, records, tools, deadlines, and friction—not the process everyone wishes existed." },
  { n: "02", title: "Build structure", question: "What must become clear?", body: "We shape roles, decision paths, evidence, milestones, and handoffs into a structure people can use without translating consultant language." },
  { n: "03", title: "Work it together", question: "Can people carry it?", body: "We put the structure into the real environment, learn where it resists, train through the work, and adjust with the people responsible." },
  { n: "04", title: "Carry it forward", question: "Will it survive change?", body: "We close the cycle with proof, practical guidance, known next steps, and a stronger starting point for the next person and the next cycle." },
];

export const metadata = {
  title: "Method",
  description: "How PublicLogic turns scattered work into structure people can understand, use, and carry forward.",
};

export default function MethodPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="page-cover method-cover">
          <p className="eyebrow">The PublicLogic method</p>
          <h1>Could the next person pick this up cold?</h1>
          <p>That question keeps the work honest. A system is not complete because a document exists. It is complete when people can understand it, run it, and improve it.</p>
        </section>

        <section className="section method-detail">
          {steps.map((step) => (
            <article key={step.n}>
              <span>{step.n}</span>
              <div><p>{step.question}</p><h2>{step.title}</h2></div>
              <p>{step.body}</p>
            </article>
          ))}
        </section>

        <section className="section impact-cycle">
          <div>
            <p className="eyebrow">The impact cycle</p>
            <h2>Do the work. Learn from it. Leave a better way to begin again.</h2>
          </div>
          <div className="cycle-graphic" aria-label="Impact cycle">
            {["Understand", "Act", "Prove", "Learn", "Improve"].map((item) => <span key={item}>{item}</span>)}
          </div>
        </section>

        <section className="section method-principles">
          <div><h3>Structure is care.</h3><p>Clear roles and records reduce avoidable strain on the people carrying public work.</p></div>
          <div><h3>Adoption is part of the design.</h3><p>Allie’s organizational psychology practice is built into how systems are shaped, learned, and sustained.</p></div>
          <div><h3>Judgment stays human.</h3><p>Tools can organize evidence and sequence. Responsible people still make the decisions.</p></div>
          <div><h3>Ownership stays with you.</h3><p>The institution keeps the structure, understanding, and record—not a permanent dependency.</p></div>
        </section>

        <section className="section">
          <div className="final-cta">
            <p className="eyebrow">Begin with reality</p>
            <h2>What would fail if one person disappeared tomorrow?</h2>
            <Link className="button primary" href="/contact">Start there</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
