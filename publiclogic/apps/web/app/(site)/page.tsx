import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section hero">
          <p className="eyebrow">Continuity • Data • Stewardship</p>
          <h1>Systems That Stick.</h1>
          <p className="lede">
            PublicLogic builds institutional stewardship systems for public work, complex projects,
            and operations that need memory, evidence, and reliable follow-through.
          </p>
          <div className="actions">
            <Link className="button primary" href="/work">
              Start with the work
            </Link>
            <Link className="button secondary" href="/pj">
              Open PJ
            </Link>
          </div>
        </section>

        <section className="section">
          <p className="eyebrow">What we build</p>
          <div className="grid">
            <article className="card">
              <h3>Institutional Readiness</h3>
              <p>Turn scattered practice into clear routines, lanes, owners, and durable records.</p>
            </article>
            <article className="card">
              <h3>CaseSpaces</h3>
              <p>Give every project a governed place for context, evidence, decisions, and next steps.</p>
            </article>
            <article className="card">
              <h3>PuddleJumper</h3>
              <p>Move from intake to action without losing the thread or overbuilding too soon.</p>
            </article>
          </div>
        </section>

        <section className="section split">
          <div>
            <p className="eyebrow">Operating structure</p>
            <h2>Built for real public work.</h2>
            <p className="lede">
              The site is the front door to a deeper operating system: PJ, CaseSpaces, VAULT, and the
              shared governance patterns that keep them honest.
            </p>
            <p className="muted-note">
              Capture first. Route later. The system holds, not people.
            </p>
          </div>
          <ul className="list">
            <li>
              <strong>FORM</strong>
              <span>Capture and interaction layer</span>
            </li>
            <li>
              <strong>CaseSpace</strong>
              <span>Working memory and project context</span>
            </li>
            <li>
              <strong>PJ</strong>
              <span>Guided next action and routing</span>
            </li>
            <li>
              <strong>VAULT</strong>
              <span>Evidence, continuity, and audit spine</span>
            </li>
          </ul>
        </section>

        <section className="section">
          <div className="panel cta-panel">
            <p className="eyebrow">Ready when you are</p>
            <h2>Build the durable layer.</h2>
            <p className="lede">
              Start with the work that matters, capture the evidence as you go, and leave behind a
              system the next person can actually use.
            </p>
            <div className="actions">
              <Link className="button primary" href="/contact">
                Get in touch
              </Link>
              <Link className="button secondary" href="/casespaces">
                Explore CaseSpaces
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
