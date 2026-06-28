import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";

export const metadata: Metadata = {
  title: "VAULT | PublicLogic",
  description:
    "Proof is the product: decisions, documents, audit trails, and the sealed packet that proves what happened.",
};

const pillars = [
  { title: "Continuity", body: "Knowledge survives turnover, transitions, and time. Nothing critical lives only in one head." },
  { title: "Evidence", body: "Documents and records are preserved with the context that makes them mean something." },
  { title: "Audit", body: "A clear trail of what happened, when, and why — ready when someone needs to ask." },
  { title: "Memory", body: "The institution remembers its own decisions, so it stops re-learning the same lessons." },
];

export default function VaultPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="VAULT"
          title="Proof is the product."
          lede="VAULT is where the record is proved. Decisions, documents, audit trails, and the sealed packet that shows what happened, who decided, and what closed it — preserved and findable."
        />

        <section className="section">
          <div className="grid grid-2">
            {pillars.map((pillar) => (
              <article key={pillar.title} className="card">
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section split">
          <div>
            <p className="eyebrow">Retention, on purpose</p>
            <h2>Nothing rots quietly.</h2>
            <p className="lede">
              Material moves into VAULT through retention — completed or stale work gets reviewed,
              kept, or closed deliberately. The record stays clean because the system tends it.
            </p>
            <p className="muted-note">What closes the record? What packet proves it? VAULT answers.</p>
          </div>
          <ul className="list">
            <li>
              <strong>Capture</strong>
              <span>PJ collects it</span>
            </li>
            <li>
              <strong>Work</strong>
              <span>CaseSpace holds it</span>
            </li>
            <li>
              <strong>Retention</strong>
              <span>Review keep or close</span>
            </li>
            <li>
              <strong>VAULT</strong>
              <span>Preserved and findable</span>
            </li>
          </ul>
        </section>

        <section className="section">
          <div className="cta-row">
            <Link className="button primary" href="/work">
              See the full system
            </Link>
            <Link className="button secondary" href="/contact">
              Talk to us
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
