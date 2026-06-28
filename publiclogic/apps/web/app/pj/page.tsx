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

const flow = [
  "Seed", "Form", "CaseSpace", "Recordstream", "Evidence",
  "Gate", "Check", "Digest", "Packet", "Seal",
];

const daily = [
  "Capture raw notes, tasks, files, scans, screenshots, voice, and links.",
  "Drop unclear files into an Incoming inbox to sort later.",
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
            <p className="eyebrow">The moat is the discipline</p>
            <h2>Seed to seal. Every time.</h2>
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
            <p className="eyebrow">Runtime line</p>
            <h2>What runs underneath.</h2>
            <p className="flow">
              FORM opens → CaseSpace owns → CAL gates → Manifest / PRM checks → PRR records → VAULT governs → ARCHIEVE seals
            </p>
            <p className="muted-note">
              PJ governs the movement of the case — not the tools you use. Your tools can stay messy; the record cannot.
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
