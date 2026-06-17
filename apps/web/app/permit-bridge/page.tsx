import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PermitChecker } from "../../components/FenceChecker";

export default function PermitBridgePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section page-hero">
          <p className="eyebrow">Permit &amp; Bridge</p>
          <h1>Can you do this?</h1>
          <p className="lede">
            You have a project. You don&apos;t know what permits it needs, who has to approve it, or in what order.
            Permit &amp; Bridge answers that question — and carries you through everything that comes after.
          </p>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="prose">
            <p>The public process isn&apos;t mysterious. It&apos;s just scattered — across departments, bylaws, state agencies, and timelines that don&apos;t talk to each other. Most people get stuck before they start because they can&apos;t get a straight answer to a simple question.</p>
            <p>Permit &amp; Bridge asks your specifics, searches the rules for you, and returns the one answer true for your project — not a list of links, not a guide to read. Then, if you want to move forward, it carries the work: documents, sequencing, coordination, submissions, follow-up, closeout.</p>
            <p>What PublicLogic carries is the <em>process</em>. Approval is the board&apos;s call. We&apos;re not your attorney, your engineer, or your contractor — we&apos;re the project controls and the paper trail, from first question to last record.</p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }} id="check">
          <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>Check my project</p>
          <PermitChecker />
          <div className="note" style={{ marginTop: '1.5rem', maxWidth: '720px' }}>
            <strong>The honest gap:</strong> The 351 Massachusetts town bylaws aren&apos;t automated in v1. Where local rules apply, the engine tells you exactly that and points you to your Building Department — rather than give you a guess. That gap is intentional, not an oversight.
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }} id="stewardship">
          <p className="eyebrow" style={{ marginBottom: '1rem' }}>Project Stewardship</p>
          <div className="split" style={{ alignItems: 'start', gap: '3rem' }}>
            <div>
              <h2>Start free.<br />Carry it through.</h2>
              <p className="lede">
                The check is free and always will be. If you want PublicLogic to carry the work — paperwork, sequencing, coordination, record, follow-up — that&apos;s Project Stewardship.
              </p>
            </div>
            <div className="ladder">
              <div className="rung">
                <div>
                  <div className="rung-name">Quick Path Review</div>
                  <div className="rung-desc">We review your project, confirm the permit path, and give you a clear checklist of what to file, in order, and with whom. You carry it from there.</div>
                </div>
                <div className="rung-price">$250–500</div>
              </div>
              <div className="rung">
                <div>
                  <div className="rung-name">Permit Readiness Package</div>
                  <div className="rung-desc">We prepare the application package — drawings scope, documents, forms — and hand it to you submission-ready. Includes a pre-submission review call.</div>
                </div>
                <div className="rung-price">$750–2,500</div>
              </div>
              <div className="rung">
                <div>
                  <div className="rung-name">Full Stewardship</div>
                  <div className="rung-desc">We carry the project: intake through closeout. Submissions, follow-up, board coordination, revision responses, final record. You stay informed; we do the work.</div>
                </div>
                <div className="rung-price">$2,500–10,000+</div>
              </div>
              <div className="rung">
                <div>
                  <div className="rung-name">Complex Path</div>
                  <div className="rung-desc">Conservation, ZBA variance, historic district, multi-agency coordination. Scoped by project — call first. This is where judgment is the product.</div>
                </div>
                <div className="rung-price">Custom</div>
              </div>
              <div style={{ paddingTop: '.5rem' }}>
                <a className="button primary" href="/contact">Start with a conversation →</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
