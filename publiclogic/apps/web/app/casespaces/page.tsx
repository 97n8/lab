import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";

export const metadata: Metadata = {
  title: "CaseSpaces | PublicLogic",
  description:
    "A governed workspace for each project, issue, client, grant, property, or institutional process.",
};

const holds = [
  { title: "Context", body: "Why this exists, who it serves, and what good looks like." },
  { title: "Evidence", body: "The documents, scans, and records that back every decision." },
  { title: "Decisions", body: "What was chosen, by whom, and the reasoning at the time." },
  { title: "Next steps", body: "The current owner and the next action, always visible." },
];

export default function CaseSpacesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="CaseSpaces"
          title="A governed place for every case."
          lede="Give each project, issue, client, grant, property, or institutional process one container for context, evidence, decisions, and next steps."
        />

        <section className="section split">
          <div>
            <p className="eyebrow">What a CaseSpace holds</p>
            <h2>One container. The whole thread.</h2>
            <p className="lede">
              A CaseSpace starts only when something needs a live container. Until then, capture stays
              light. When it goes live, everything about the case lives in one governed place.
            </p>
          </div>
          <ul className="list">
            {holds.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="section">
          <div className="panel">
            <p className="eyebrow">Runtime spine</p>
            <h2>Where CaseSpace sits.</h2>
            <p className="lede">
              CaseSpace is the working-memory layer between capture and the long-term record.
            </p>
            <p className="flow">
              Org Manager → <strong>CaseSpace</strong> → FormKey → DocDump → CloudSync → Automations → Vault
            </p>
          </div>
        </section>

        <section className="section">
          <div className="cta-row">
            <Link className="button primary" href="/pj">
              See how PJ routes it
            </Link>
            <Link className="button secondary" href="/vault">
              And how VAULT keeps it
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
