import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

const path = [
  { n: "01", title: "Establish the facts", body: "Location, ownership, proposed use, site conditions, known constraints, timing, and the decisions already made." },
  { n: "02", title: "Find the likely reviews", body: "Local approvals, boards, departments, state or federal touchpoints, and the licensed professionals the project may require." },
  { n: "03", title: "Sequence the path", body: "What can happen now, what depends on another decision, who owns each step, and where delay or rework is most likely." },
  { n: "04", title: "Prepare and carry the record", body: "Requirements, submissions, correspondence, decisions, conditions, and closeout evidence kept in one connected project story." },
];

export const metadata = {
  title: "Permit & Bridge",
  description: "A clearer path through project permitting, approvals, submissions, and closeout.",
};

export default function PermitBridgePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="permit-cover">
          <p className="eyebrow">Permit &amp; Bridge</p>
          <h1>Can you do this?</h1>
          <p>
            Before a project spends time and money in the wrong order, PublicLogic helps build a
            practical picture of what may apply, who needs to be involved, and what has to happen next.
          </p>
          <div className="actions">
            <Link className="button primary" href="/contact?work=Permit%20%26%20Bridge">Describe the project</Link>
            <a className="button secondary" href="mailto:hello@publiclogic.org?subject=Permit%20%26%20Bridge%20question">Email a question</a>
          </div>
        </section>

        <section className="section permit-audience">
          <div>
            <p className="eyebrow">A bridge between the question and the formal process</p>
            <h2>For owners, organizations, and public partners who need the whole path in view.</h2>
          </div>
          <div>
            <p>
              Permitting is not one form. It is a chain of facts, jurisdictions, professional
              judgments, public decisions, dependencies, and records. The hard part is often knowing
              where the chain begins and keeping it connected.
            </p>
            <p>
              We organize that chain so the right specialists and authorities can do their work
              with better information and fewer avoidable surprises.
            </p>
          </div>
        </section>

        <section className="permit-image-break">
          <figure>
            <Image
              src="/images/faneuil-hall.jpg"
              alt="Historic meeting room inside Faneuil Hall in Boston"
              fill
              sizes="100vw"
            />
            <figcaption>
              Public processes inherit long records. Faneuil Hall, Boston.{" "}
              <a href="https://www.loc.gov/item/ma0902/" target="_blank" rel="noreferrer">
                Historic American Buildings Survey, Library of Congress
              </a>
            </figcaption>
          </figure>
        </section>

        <section className="section permit-steps">
          {path.map((step) => (
            <article key={step.n}>
              <span>{step.n}</span>
              <h2>{step.title}</h2>
              <p>{step.body}</p>
            </article>
          ))}
        </section>

        <section className="section">
          <div className="deliverables-panel">
            <div>
              <p className="eyebrow">What the engagement can produce</p>
              <h2>A path built around the project—not a generic checklist.</h2>
            </div>
            <div className="deliverables-list">
              {["Project fact pattern", "Likely jurisdiction and review map", "Requirements and missing-information list", "Sequenced action plan with owners", "Submission and decision tracker", "Closeout and handoff record"].map((item) => (
                <p key={item}><span>✓</span>{item}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="scope-band">
          <p className="eyebrow">Clear scope</p>
          <h2>We coordinate the path. We do not impersonate the people with legal authority.</h2>
          <p>
            Permit &amp; Bridge is not legal advice, engineering, architecture, land surveying, or a
            guarantee of approval. PublicLogic helps identify and organize the likely path, prepare
            the work, and maintain the record. The authority remains with the applicable boards,
            agencies, and licensed professionals.
          </p>
        </section>

        <section className="section">
          <div className="final-cta">
            <p className="eyebrow">Start with what you know</p>
            <h2>Bring the address, the idea, and the questions.</h2>
            <p>We can begin before every project detail is settled. The first job is to make the unknowns visible.</p>
            <Link className="button primary" href="/contact?work=Permit%20%26%20Bridge">Describe the project</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
