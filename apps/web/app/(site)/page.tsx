import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section hero">
          <p className="eyebrow">Systems that stick.</p>
          <h1>Bring the work together.</h1>
          <p className="lede">
            You arrive with a project, a question, or an operation that&apos;s held together by one person&apos;s memory.
            PublicLogic gives it a place — governed, documented, and ready for the next person.
          </p>
          <div className="actions">
            <a className="button primary" href="/permit-bridge">Check my project</a>
            <a className="button secondary" href="https://pj.publiclogic.org">Enter PuddleJumper</a>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>One method. Every domain.</p>
          <div className="method-steps">
            <div className="step">
              <div className="step-num">01 · Capture</div>
              <h3>Gather what exists.</h3>
              <p>Name the relationships that must hold — work, record, approval, handoff, ownership. Don&apos;t build a system. Build a governed lane.</p>
            </div>
            <div className="step">
              <div className="step-num">02 · Organize</div>
              <h3>One lane. Clear owners.</h3>
              <p>Visible next steps, explicit context. The kind of structure someone else could actually run from — not a compliance checklist.</p>
            </div>
            <div className="step">
              <div className="step-num">03 · Run</div>
              <h3>Work from the system.</h3>
              <p>Steps and evidence explicit enough to survive turnover. The work moves because the lane moves it, not because one person remembered.</p>
            </div>
            <div className="step">
              <div className="step-num">04 · Preserve</div>
              <h3>Knowledge stays.</h3>
              <p>Proof and handoff record intact through pressure and time. The test: could the next person pick this up cold and know what to do?</p>
            </div>
          </div>
        </section>

        <section className="section split" style={{ alignItems: 'start' }}>
          <div>
            <p className="eyebrow">The products</p>
            <h2>One runtime. Four domains.</h2>
            <p className="lede">
              STAY, Muni, Ops, and Grant all run in PuddleJumper — the same governed workspace wearing different faces depending on the work.
            </p>
            <div className="actions" style={{ marginTop: '2rem' }}>
              <a className="button secondary" href="/products">See the full stack</a>
            </div>
          </div>
          <ul className="list">
            <li><strong>STAY</strong><span>Short-term rental operations</span></li>
            <li><strong>Muni</strong><span>Municipal continuity and permits</span></li>
            <li><strong>Ops</strong><span>Business operating structure</span></li>
            <li><strong>Grant</strong><span>Grant lifecycle and compliance</span></li>
            <li><strong>Permit &amp; Bridge</strong><span>Through the public process, start to finish</span></li>
          </ul>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="cta-block">
            <p className="eyebrow" style={{ color: 'var(--gold)' }}>Permit &amp; Bridge</p>
            <h2>Can you do this?</h2>
            <p className="lede">
              You have a project. You don&apos;t know what it needs, who has to sign off, or in what order.
              Permit &amp; Bridge answers that question and carries you through — from "can I?" to ready to build.
            </p>
            <div className="actions">
              <a className="button on-dark" href="/permit-bridge">Check my project</a>
              <a className="button on-dark-outline" href="/permit-bridge#stewardship">See Project Stewardship</a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
