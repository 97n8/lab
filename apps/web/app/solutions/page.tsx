import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

const domains = [
  {
    name: "Municipality",
    problem: "Staff turns over. Institutional knowledge walks out. The next town clerk, department head, or board member starts from nothing — and the residents pay for it.",
    answer: "Muni gives every process a governed lane: permits, board cycles, notices, records, grant obligations. Change in staff doesn't mean loss of context.",
    product: "Muni",
    href: "/products#muni",
  },
  {
    name: "Business",
    problem: "Operations held together by one person's spreadsheet and memory. When that person leaves — or just goes on vacation — things fall through.",
    answer: "Ops turns the operating rhythm into a system: admin cycles, vendor obligations, staff roles, recurring tasks. The business runs from the lane, not from the person.",
    product: "Ops",
    href: "/products#ops",
  },
  {
    name: "Property",
    problem: "A short-term rental is a small business. Guests, maintenance cycles, vendor relationships, inspection records, owner handoffs — none of it fits in a calendar app.",
    answer: "STAY gives the property a governed workspace: bookings, turnovers, maintenance, inspections, and the operating record the next owner or manager actually needs.",
    product: "STAY",
    href: "/products#stay",
  },
  {
    name: "Project",
    problem: "Grant-funded projects are evidence games. Miss a milestone, lose a document, let a deadline slip — and the closeout becomes a crisis. Partners have different systems. Nothing talks to anything.",
    answer: "Grant holds the full arc: partners, milestones, evidence, decision log, deadlines, and the closeout record. The audit trail is built in, not assembled at the end.",
    product: "Grant",
    href: "/products#grant",
  },
  {
    name: "Institution",
    problem: "Boards, nonprofits, and public agencies run on volunteer memory and paper processes. Continuity is always one departure away from collapse.",
    answer: "The same method — Capture, Organize, Run, Preserve — scales to institutional complexity. Governed lanes for programs, obligations, records, and roles that survive leadership change.",
    product: "All products",
    href: "/products",
  },
];

export default function SolutionsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section page-hero">
          <p className="eyebrow">Solutions</p>
          <h1>The work breaks<br />the same ways.</h1>
          <p className="lede">
            Scattered practice. Undocumented decisions. Systems that exist only in one person&apos;s head.
            The domain changes — the failure mode doesn&apos;t.
          </p>
        </section>

        <section className="section" style={{ paddingTop: '2rem' }}>
          <div className="domain-grid">
            {domains.map((d) => (
              <article key={d.name} className="card" style={{ display: 'grid', gap: '.75rem' }}>
                <p className="eyebrow" style={{ margin: 0 }}>{d.name}</p>
                <h3 style={{ marginTop: 0 }}>The problem</h3>
                <p style={{ color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>{d.problem}</p>
                <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '.5rem 0' }} />
                <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>{d.answer}</p>
                <a href={d.href} style={{ fontWeight: 900, color: 'var(--green)', textDecoration: 'none', fontSize: '.9rem' }}>
                  {d.product} →
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="cta-block">
            <h2>Structure is care.</h2>
            <p className="lede">
              A system that works when you&apos;re not there isn&apos;t just operational efficiency — it&apos;s a form of respect for the people who come next.
            </p>
            <div className="actions">
              <a className="button on-dark" href="/method">See the method</a>
              <a className="button on-dark-outline" href="/contact">Start a conversation</a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
