import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export default function ProductsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section page-hero">
          <p className="eyebrow">Products</p>
          <h1>One runtime.<br />Four domains.</h1>
          <p className="lede">
            STAY, Muni, Ops, and Grant are the same governed workspace — PuddleJumper — wearing different faces.
            Same four steps. Same record. Same authority. Different labels.
          </p>
        </section>

        <section className="section" style={{ paddingTop: '2rem' }}>
          <div className="product-table">
            <div className="product-row header-row">
              <span className="col-label">Product</span>
              <span className="col-label">Domain</span>
              <span className="col-label">What it carries</span>
            </div>

            <div className="product-row" id="stay">
              <div>
                <div className="product-name">STAY</div>
                <div className="product-domain">Property</div>
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '.95rem', lineHeight: 1.6 }}>
                Short-term rental operations — guests, turnovers, maintenance, vendors, inspections, owner records, and operating handoffs.
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '.9rem', lineHeight: 1.6 }}>
                Live: <strong style={{ color: 'var(--ink)' }}>stay.kendall</strong> — Kendall Pond Lodge, Gardner MA.
              </div>
            </div>

            <div className="product-row" id="muni">
              <div>
                <div className="product-name">Muni</div>
                <div className="product-domain">Municipality</div>
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '.95rem', lineHeight: 1.6 }}>
                Permits, records, boards, notices, grants, role changes, and public-facing continuity — the operating skeleton of a town office.
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '.9rem', lineHeight: 1.6 }}>
                Template ready. First deployment in preparation.
              </div>
            </div>

            <div className="product-row" id="ops">
              <div>
                <div className="product-name">Ops</div>
                <div className="product-domain">Business</div>
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '.95rem', lineHeight: 1.6 }}>
                Operations, admin rhythm, staff turnover, recurring obligations — the structure that keeps a business running when the person who knows everything leaves.
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '.9rem', lineHeight: 1.6 }}>
                Available now.
              </div>
            </div>

            <div className="product-row" id="grant">
              <div>
                <div className="product-name">Grant</div>
                <div className="product-domain">Project</div>
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '.95rem', lineHeight: 1.6 }}>
                Partners, milestones, evidence, deadlines, decisions, closeout — the full arc of a grant-funded project with the audit trail built in from day one.
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '.9rem', lineHeight: 1.6 }}>
                Live: <strong style={{ color: 'var(--ink)' }}>grant.MichiganLTC</strong> — active engagement.
              </div>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="card" style={{ padding: 'clamp(1.5rem,4vw,3rem)', display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              <h3 style={{ margin: 0 }}>Permit &amp; Bridge</h3>
              <span className="badge">cross-cutting</span>
            </div>
            <p style={{ color: 'var(--muted)', lineHeight: 1.65, maxWidth: '720px', margin: 0 }}>
              Permit &amp; Bridge isn&apos;t a domain product — it&apos;s a project service. It carries one project through the public process: idea → feasibility → permit path → documents → coordination → submission → follow-up → closeout. A fence at the lodge is a Permit &amp; Bridge project inside STAY. A subdivision notice is one inside Muni. The same arc, inside whichever domain it touches.
            </p>
            <a className="button secondary" href="/permit-bridge" style={{ width: 'fit-content' }}>See Permit &amp; Bridge →</a>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="split" style={{ alignItems: 'start' }}>
            <div>
              <p className="eyebrow">PuddleJumper</p>
              <h2>The workspace.<br />Not a product.</h2>
              <p className="lede">
                PuddleJumper is where the work runs. STAY, Muni, Ops, and Grant all live in it — not as separate apps, but as governed CaseSpaces wearing domain labels. It&apos;s the floor, not a peer.
              </p>
              <a className="button primary" href="https://pj.publiclogic.org" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>Enter PuddleJumper →</a>
            </div>
            <ul className="list">
              <li><strong>CaseSpaces</strong><span>Where one piece of work lives</span></li>
              <li><strong>FORM</strong><span>Capture and intake layer</span></li>
              <li><strong>Commons</strong><span>Reusable templates and patterns</span></li>
              <li><strong>VAULT</strong><span>The append-only record</span></li>
              <li><strong>Puddles</strong><span>AI assists, never decides</span></li>
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
