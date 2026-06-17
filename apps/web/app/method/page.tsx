import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export default function MethodPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section page-hero">
          <p className="eyebrow">The Method</p>
          <h1>Capture.<br />Organize.<br />Run.<br />Preserve.</h1>
          <p className="lede">
            One method, everywhere. Whether the work is a town office, a rental, a grant, or a permit project — the same four steps apply.
          </p>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="method-steps">
            <div className="step">
              <div className="step-num">01 · Capture</div>
              <h3>Gather what exists.</h3>
              <p>Name the relationships that must hold: work, record, approval, handoff, ownership. Capture what&apos;s real — not what the org chart says, but what actually has to happen and who has to do it. Don&apos;t start building a system. Start by making the current state visible.</p>
            </div>
            <div className="step">
              <div className="step-num">02 · Organize</div>
              <h3>One lane. Clear owners.</h3>
              <p>One governed lane, explicit ownership, visible next steps. The kind of structure someone else could actually run from — not a compliance checklist, not a filing cabinet. Organization means the next action is always findable without asking the person who left.</p>
            </div>
            <div className="step">
              <div className="step-num">03 · Run</div>
              <h3>Work from the system.</h3>
              <p>Steps and evidence explicit enough to survive turnover. The work moves because the lane moves it — not because one person remembered, not because someone checked in at the right moment. When it runs from the system, pressure doesn&apos;t break it.</p>
            </div>
            <div className="step">
              <div className="step-num">04 · Preserve</div>
              <h3>Knowledge stays.</h3>
              <p>Proof and handoff record intact through pressure and time. The decisions that were made. The evidence that something happened. The context the next person needs. Preservation isn&apos;t archiving — it&apos;s the live system maintaining a record that can be handed to anyone, at any point.</p>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="panel">
            <p className="eyebrow">The test</p>
            <h2>Could the next person pick this up cold?</h2>
            <div className="prose" style={{ marginTop: '1.5rem' }}>
              <p>Not: "Is there documentation?" Not: "Are we compliant?" The question is whether someone who doesn&apos;t know this project, this person, or this history can actually pick it up and run it — not just find a file folder, but understand what&apos;s live, what&apos;s next, what&apos;s been decided, and what evidence exists to prove it.</p>
              <p>That&apos;s the test that governs every design decision in the system. Everything that helps pass that test gets built in. Everything that&apos;s theater — compliance checkboxes, form fields no one reads, dashboards no one opens — gets cut.</p>
              <p>This isn&apos;t theoretical. It&apos;s the standard we apply to the live deployments before we consider anything done.</p>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="split" style={{ alignItems: 'start' }}>
            <div>
              <p className="eyebrow">Structure is care.</p>
              <h2>Why this matters.</h2>
              <p className="lede" style={{ marginTop: '1rem' }}>
                A system that works when you&apos;re not there isn&apos;t just operational efficiency. It&apos;s a form of respect — for the people who funded this, the people who come next, and the communities that depend on the work actually getting done.
              </p>
            </div>
            <ul className="list">
              <li><strong>Every product</strong><span>runs the same four steps</span></li>
              <li><strong>Every CaseSpace</strong><span>answers the cold-start test</span></li>
              <li><strong>Every record</strong><span>is append-only and can&apos;t be bypassed</span></li>
              <li><strong>AI assists</strong><span>never decides</span></li>
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
