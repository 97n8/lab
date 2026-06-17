import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section page-hero">
          <p className="eyebrow">Contact</p>
          <h1>Start with a conversation.</h1>
          <p className="lede">
            Tell us about the work, where it&apos;s breaking, and what needs to hold. We&apos;ll respond within one business day.
          </p>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="split" style={{ alignItems: 'start', gap: '3rem' }}>
            <div className="card" style={{ padding: 'clamp(1.5rem,4vw,3rem)' }}>
              <h3>PublicLogic LLC</h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.65 }}>Gardner · Massachusetts</p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.65, marginTop: '1.5rem' }}>
                For Permit &amp; Bridge project inquiries, product questions, platform access, or partnership conversations — reach out directly.
              </p>
              <div style={{ marginTop: '1.5rem', display: 'grid', gap: '.75rem' }}>
                <a href="mailto:hello@publiclogic.org" style={{ fontWeight: 900, color: 'var(--green)', textDecoration: 'none', fontSize: '1.1rem' }}>
                  hello@publiclogic.org →
                </a>
              </div>
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: '1rem' }}>What to include</p>
              <ul className="list">
                <li><strong>Project inquiry</strong><span>What you&apos;re building and where you are in the process</span></li>
                <li><strong>Platform access</strong><span>What you&apos;re working on and what product fits</span></li>
                <li><strong>Readiness review</strong><span>What operation, office, or project you want to assess</span></li>
                <li><strong>Partnership</strong><span>Who you are and what you&apos;re building</span></li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
