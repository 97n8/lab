import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

const lanes = [
  {
    n: "01",
    title: "Governance & program support",
    intro: "For public work that needs clearer ownership, decision paths, operating rhythm, and a record people can trust.",
    work: ["Program and process mapping", "Roles and responsibility design", "Decision and approval paths", "90-day operating frameworks", "Meeting and governance tools"],
    leave: ["Operating map", "Role matrix", "Decision log", "Action register", "Practical operating guide"],
  },
  {
    n: "02",
    title: "Grants & funding",
    intro: "For organizations moving from a good idea to a fundable, manageable project with partners, deadlines, and obligations.",
    work: ["Opportunity and fit review", "Readiness and gap assessment", "Partner and responsibility mapping", "Application coordination", "Post-award implementation setup"],
    leave: ["Funding strategy", "Grant calendar", "Readiness packet", "Partner matrix", "Implementation and reporting plan"],
  },
  {
    n: "03",
    title: "Permit & Bridge",
    intro: "For projects that need to understand likely approvals, sequence the work, and carry a defensible record from question to closeout.",
    work: ["Project intake and fact pattern", "Jurisdiction and requirement scan", "Review and dependency mapping", "Submission coordination", "Closeout and handoff"],
    leave: ["Permit path", "Requirement checklist", "Submission package", "Review tracker", "Closeout record"],
  },
  {
    n: "04",
    title: "Documentation & continuity",
    intro: "For work that cannot afford to vanish when a leader, employee, consultant, or partner changes.",
    work: ["Current-state inventory", "Record and evidence design", "Standard operating guidance", "Training and adoption", "Transition and closeout support"],
    leave: ["Program documentation", "Evidence register", "Training tools", "Continuity plan", "Handoff record"],
  },
  {
    n: "05",
    title: "Community & partner administration",
    intro: "For initiatives where public benefit depends on many organizations working from one shared picture.",
    work: ["Partner landscape and engagement", "Shared outcome and obligation mapping", "Community process design", "Milestone coordination", "Learning and improvement cycles"],
    leave: ["Partner map", "Engagement plan", "Shared commitments", "Milestone record", "Cycle review"],
  },
];

export const metadata = {
  title: "Services",
  description: "Governance, grants, permitting, documentation, and continuity support for public organizations and complex projects.",
};

export default function ServicesPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="page-cover">
          <p className="eyebrow">Services</p>
          <h1>Structure for work that has to survive the work.</h1>
          <p>PublicLogic enters where responsibility is shared, requirements are scattered, and the institution needs something stronger than another report.</p>
        </section>

        <section className="section service-detail-list">
          {lanes.map((lane) => (
            <article key={lane.n} id={lane.n === "03" ? "permit-bridge" : undefined}>
              <div className="service-number">{lane.n}</div>
              <div className="service-summary">
                <h2>{lane.title}</h2>
                <p>{lane.intro}</p>
              </div>
              <div>
                <h3>What we do</h3>
                <ul>{lane.work.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div>
                <h3>What stays with you</h3>
                <ul>{lane.leave.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </article>
          ))}
        </section>

        <section className="section">
          <div className="boundary-callout">
            <div>
              <p className="eyebrow">The boundary matters</p>
              <h2>We organize the path. Licensed professionals keep their authority.</h2>
            </div>
            <p>
              PublicLogic does not replace legal counsel, engineering, architecture, environmental
              review, or the judgment of a public authority. We help the responsible people see the
              whole path, prepare the work, and keep the record connected.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="final-cta">
            <p className="eyebrow">A practical first step</p>
            <h2>Start with a Systems Scan.</h2>
            <p>We map what is active, who carries it, where it breaks, and what would make the next cycle stronger.</p>
            <div className="actions">
              <Link className="button primary" href="/contact">Describe the work</Link>
              <Link className="button secondary" href="/method">See the method</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
