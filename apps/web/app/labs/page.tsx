import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export default function LabsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section page-hero">
          <p className="eyebrow">Labs</p>
          <h1>What&apos;s being built.</h1>
          <p className="lede">
            Pre-release work, the Governance Steward layer, and what&apos;s coming next in the platform.
          </p>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="split" style={{ alignItems: 'start', gap: '3rem' }}>
            <div className="card" style={{ padding: 'clamp(1.5rem,4vw,3rem)' }}>
              <p className="eyebrow" style={{ margin: '0 0 .75rem' }}>Governance Steward</p>
              <h3>AI assists. Never decides.</h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.65, marginBottom: '1rem' }}>
                Governance Steward is the AI layer in PuddleJumper. It assists operators: drafting case summaries, surfacing missing evidence, flagging deadlines, suggesting next steps based on case context.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.65, marginBottom: '1rem' }}>
                It doesn&apos;t approve work. It doesn&apos;t sign off on decisions. It doesn&apos;t move a case without a human action. Every consequential step in the governed lane requires a human in the loop — the Steward is the research assistant and the pattern spotter, not the decision-maker.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.65 }}>
                The Steward is not a navigation surface and not a product. It&apos;s part of the environment — available everywhere in PuddleJumper, accountable to the same append-only record as everything else.
              </p>
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>Roadmap</p>
              <ul className="list">
                <li><strong>Permit &amp; Bridge verticals</strong><span>Deck · driveway · shed · sign · change of use</span></li>
                <li><strong>B2G data layer</strong><span>Structured town bylaws + MassGIS — engine goes town-deep</span></li>
                <li><strong>Muni CaseSpace live</strong><span>Municipal deployment, PRR / Posting Desk templates</span></li>
                <li><strong>Client operators</strong><span>Scoped access for external operators and funders</span></li>
                <li><strong>Commons preview</strong><span>LogicCommons library access for platform partners</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="cta-block">
            <p className="eyebrow" style={{ color: 'var(--gold)' }}>Get involved</p>
            <h2>Build with us.</h2>
            <p className="lede">
              If you&apos;re building in the same space — municipal continuity, governed AI, public process tools — reach out. Early partners, B2G data contributors, and domain experts are welcome.
            </p>
            <div className="actions">
              <a className="button on-dark" href="/contact">Start a conversation</a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
