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
            <a className="button primary" href="/work">Start with the work</a>
            <a className="button secondary" href="/pj">Open PJ</a>
          </div>
        </section>

        <section className="section grid">
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
        </section>

        <section className="section split">
          <div>
            <p className="eyebrow">Operating structure</p>
            <h2>Built for real public work.</h2>
            <p className="lede">
              This site structure is ready for PublicLogic’s public presence and the deeper product
              system behind it: PJ, CaseSpaces, VAULT, and shared governance patterns.
            </p>
          </div>
          <ul className="list">
            <li><strong>FORM</strong><span>Capture and interaction layer</span></li>
            <li><strong>CaseSpace</strong><span>Working memory and project context</span></li>
            <li><strong>PJ</strong><span>Guided next action and routing</span></li>
            <li><strong>VAULT</strong><span>Evidence, continuity, and audit spine</span></li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
