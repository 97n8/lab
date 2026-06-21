import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";

export const metadata: Metadata = {
  title: "PuddleJumper | PublicLogic",
  description:
    "The guided action layer: capture first, route later. Intake, triage, next step, evidence, owner, review, and archive.",
};

const flow = ["Home", "Capture", "Start", "CaseSpace", "RecordStream", "Retention", "VAULT"];

const daily = [
  "Capture raw notes, tasks, files, scans, screenshots, voice, and links.",
  "Drop unclear files into DocDump / Incoming.",
  "Start CaseSpaces only when something needs a live container.",
  "Record important transitions in RecordStream.",
  "Move completed or stale material through Retention.",
];

export default function PJPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="PuddleJumper"
          title="Open, do the thing, carry on."
          lede="PJ is the guided action layer. Capture first, route later — so nothing important falls through while the work keeps moving."
        />

        <section className="section split">
          <div>
            <p className="eyebrow">Core rule</p>
            <h2>Capture first. Route later.</h2>
            <p className="lede">
              The working promise is simple: the system holds, not people. PJ takes whatever you throw
              at it and makes sure it lands somewhere it can be found again.
            </p>
          </div>
          <ul className="list">
            {daily.map((item) => (
              <li key={item} className="list-stack">
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="section">
          <div className="panel">
            <p className="eyebrow">Primary flow</p>
            <h2>From capture to continuity.</h2>
            <div className="flow-chips">
              {flow.map((stage, i) => (
                <span key={stage} className="chip">
                  {stage}
                  {i < flow.length - 1 ? <span className="chip-arrow" aria-hidden="true">→</span> : null}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="panel">
            <p className="eyebrow">Runtime spine</p>
            <h2>What runs underneath.</h2>
            <p className="flow">
              Org Manager → CaseSpace → FormKey → DocDump → CloudSync → Automations → Vault
            </p>
            <p className="muted-note">
              This is the personal-first version that proves the behavior before the product gets built.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="cta-row">
            <Link className="button primary" href="/casespaces">
              Where it lands: CaseSpaces
            </Link>
            <Link className="button secondary" href="/vault">
              Where it stays: VAULT
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
