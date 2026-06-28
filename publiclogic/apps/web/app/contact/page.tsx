import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";

export const metadata: Metadata = {
  title: "Contact | PublicLogic",
  description: "Build the durable layer with PublicLogic. Start with the work that keeps slipping.",
};

const EMAIL = "hello@publiclogic.org";

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="Contact"
          title="Build the durable layer."
          lede="Tell us about the work that keeps slipping. We start narrow, prove the system on something real, and grow it only when the pattern holds."
        />

        <section className="section split">
          <div className="panel">
            <p className="eyebrow">Send a note</p>
            <h2>Email us.</h2>
            <p className="lede">
              The fastest way to start is a short note about what you are trying to keep on track.
            </p>
            <p>
              <a className="button primary" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </p>
          </div>

          <div className="panel">
            <p className="eyebrow">What to include</p>
            <ul className="list">
              <li className="list-stack">
                <span>The work or process that keeps losing the thread.</span>
              </li>
              <li className="list-stack">
                <span>Who owns it today and who has to pick it up next.</span>
              </li>
              <li className="list-stack">
                <span>What “handled” would look like six months from now.</span>
              </li>
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
