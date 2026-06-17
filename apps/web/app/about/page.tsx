import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section page-hero">
          <p className="eyebrow">About</p>
          <h1>Systems that stick.</h1>
          <p className="lede">
            PublicLogic LLC. Gardner, Massachusetts. Fixed-fee project controls, grant-stacking, diligence, documentation, continuity, and implementation-readiness.
          </p>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="split" style={{ alignItems: 'start', gap: '3rem' }}>
            <div className="prose">
              <p>Systems fail when people leave. Not because the people were bad at their jobs — usually the opposite. They were so good, so central, so irreplaceable that the work ran through them rather than through a system. When they went, the work went with them.</p>
              <p>This happens in town offices, nonprofits, rental operations, grant-funded projects, and small businesses at roughly the same rate and for roughly the same reasons: no one built the lane. The work got done, but the doing didn&apos;t leave a record anyone else could run from.</p>
              <p>PublicLogic builds the lane. Governed, documented, tested against the cold-start question: could the next person pick this up and know what to do? That&apos;s the standard. Everything else is a consequence of taking it seriously.</p>
            </div>
            <div>
              <div className="card" style={{ padding: '1.5rem', display: 'grid', gap: '.75rem' }}>
                <p className="eyebrow" style={{ margin: 0 }}>Gardner · Massachusetts</p>
                <p style={{ color: 'var(--muted)', lineHeight: 1.65, margin: 0 }}>
                  PublicLogic was built out of the same small-city public infrastructure that it&apos;s designed to serve. We know what a town office actually looks like at 4:45 on a Friday, what a grant closeout crisis feels like, and what it means to hand something to the next person and have it actually work.
                </p>
              </div>
              <div className="card" style={{ padding: '1.5rem', marginTop: '1rem', display: 'grid', gap: '.75rem' }}>
                <p className="eyebrow" style={{ margin: 0 }}>AI assists · never decides</p>
                <p style={{ color: 'var(--muted)', lineHeight: 1.65, margin: 0 }}>
                  Governance Steward — the AI layer — assists in PuddleJumper. It can draft, summarize, flag patterns, and surface what&apos;s missing. It doesn&apos;t approve work, make decisions, or sign off on anything. Every consequential action requires a human in the lane. That&apos;s not a limitation we&apos;re working around — it&apos;s the design.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="cta-block">
            <h2>Start a conversation.</h2>
            <p className="lede">
              We work by conversation first. Tell us about the work, where it&apos;s breaking, and what needs to hold.
            </p>
            <div className="actions">
              <a className="button on-dark" href="/contact">Contact PublicLogic</a>
              <a className="button on-dark-outline" href="/method">Read the method</a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
