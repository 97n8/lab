import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

const work = [
  {
    n: "01",
    kind: "Municipal leadership",
    title: "First-90-days operating framework",
    need: "A new leader needed to understand active work, immediate obligations, decision points, and what could not be allowed to drop.",
    built: "A listening and inventory structure, baseline findings, responsibility map, priority sequence, and board-ready 90-day roadmap.",
    lasts: "A shared starting point that can be reviewed, updated, and handed to the next responsible person.",
  },
  {
    n: "02",
    kind: "Funding & implementation",
    title: "Multi-partner readiness package",
    need: "A public-benefit initiative had a credible opportunity but no single view of partner roles, project facts, funding fit, deadlines, or implementation risk.",
    built: "A project fact base, funding scan, partner matrix, readiness gaps, milestone plan, and implementation record.",
    lasts: "One working picture from early opportunity through reporting and closeout.",
  },
  {
    n: "03",
    kind: "Permitting & approvals",
    title: "Project review path",
    need: "A project team could not tell which reviews might apply, what information was missing, or which step had to happen before another.",
    built: "A fact pattern, likely jurisdiction map, requirements checklist, review sequence, owner map, and submission tracker.",
    lasts: "A defensible path and a record that can move with the project instead of living in scattered correspondence.",
  },
  {
    n: "04",
    kind: "Program continuity",
    title: "Operating and evidence system",
    need: "Important work depended on institutional memory, separate files, and a few people who knew how everything fit together.",
    built: "An operating guide, decision record, evidence register, recurring calendar, role guidance, and transition package.",
    lasts: "A cold-start handoff: what is live, what comes next, what was decided, and where the proof lives.",
  },
];

export const metadata = {
  title: "Selected Work",
  description: "Representative PublicLogic work across municipal leadership, funding, permitting, and continuity.",
};

export default function WorkPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="page-cover">
          <p className="eyebrow">Selected work</p>
          <h1>The work should leave the institution stronger.</h1>
          <p>Representative, anonymized examples. No borrowed logos, inflated claims, or project details that do not belong to us.</p>
        </section>

        <section className="section case-list">
          {work.map((item) => (
            <article key={item.n}>
              <div className="case-index"><span>{item.n}</span><p>{item.kind}</p></div>
              <h2>{item.title}</h2>
              <div className="case-columns">
                <div><h3>The need</h3><p>{item.need}</p></div>
                <div><h3>What we built</h3><p>{item.built}</p></div>
                <div><h3>What carries forward</h3><p>{item.lasts}</p></div>
              </div>
            </article>
          ))}
        </section>

        <section className="evidence-band">
          <p className="eyebrow">Our standard</p>
          <blockquote>“A system should not require heroics to function.”</blockquote>
          <p>The result is not a deck about what should happen. It is a usable structure for what happens next.</p>
          <Link className="button secondary" href="/proof">Open working demonstrations</Link>
        </section>

        <section className="section">
          <div className="final-cta">
            <p className="eyebrow">Bring the unfinished picture</p>
            <h2>Start where the work is messy.</h2>
            <p>We will help identify the smallest useful structure that can make the next decision, handoff, or impact cycle better.</p>
            <Link className="button primary" href="/contact">Start a conversation</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
