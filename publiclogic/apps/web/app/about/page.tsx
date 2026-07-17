import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";

export const metadata: Metadata = {
  title: "About",
  description: "PublicLogic combines public-sector practice and organizational psychology to build systems institutions can carry forward.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageIntro
          eyebrow="About PublicLogic"
          title="Systems only stick when people can carry them."
          lede="PublicLogic is an institutions stewardship practice. We help public, regulated, and community-facing teams build clearer ways to work, keep what they learn, and stay capable through change."
        />

        <section className="section">
          <div className="founder-grid">
            <article className="person-card">
              <Image
                className="person-photo"
                src="/images/nathan-boudreau.jpg"
                alt="Nathan Boudreau working at a public event"
                width={902}
                height={1200}
                sizes="(max-width: 800px) 100vw, 50vw"
              />
              <p className="eyebrow">Founder & Principal</p>
              <h2>Nathan R. Boudreau, MPA, MCPPO</h2>
              <p>
                Nathan brings fifteen years inside Massachusetts municipal government, including
                town administration, town clerk work, legislative and mayoral staff, and elected
                local office.
              </p>
              <p>
                He knows how public work actually moves: across boards, deadlines, vendors,
                residents, records, regulations, and the people holding the whole picture together.
              </p>
            </article>
            <article className="person-card featured-person">
              <p className="eyebrow">Partner, Institutions Stewardship Services</p>
              <h2>Dr. Allison Weiss Rothschild, PsyD, MSW, LICSW, BCBA, LABA</h2>
              <p>
                Allie brings organizational psychology, behavioral systems design, and institutions
                stewardship into the work.
              </p>
              <p>
                Her lens keeps each engagement grounded in trust, adoption, leadership, and the
                realities of change. A process can be technically correct and still fail. Allie
                helps build the conditions that let people use it, own it, and make it better.
              </p>
            </article>
          </div>
        </section>

        <section className="home-statement">
          <div>
            <p className="eyebrow">Our shared belief</p>
            <h2>The point is not to make people serve the system.</h2>
            <p>The point is to build a system that helps people serve the work—and leaves the institution more capable for whatever comes next.</p>
          </div>
        </section>

        <section className="section">
          <div className="values-grid">
            <article><h3>Practitioner-led</h3><p>Built from lived public and institutional work, not abstract process diagrams.</p></article>
            <article><h3>People-first</h3><p>Human judgment, trust, and adoption are part of the system—not afterthoughts.</p></article>
            <article><h3>Institution-owned</h3><p>The work, records, and operating knowledge belong to the institution.</p></article>
            <article><h3>Made to continue</h3><p>Every engagement should make the next handoff and the next cycle stronger.</p></article>
          </div>
        </section>

        <section className="section">
          <div className="final-cta">
            <p className="eyebrow">Work with PublicLogic</p>
            <h2>Bring us the work that cannot afford to lose its thread.</h2>
            <Link className="button primary" href="/contact">Start a conversation</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
