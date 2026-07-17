import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { ContactBrief } from "../../components/ContactBrief";

export const metadata = {
  title: "Contact",
  description: "Bring PublicLogic the work that is active, stuck, scattered, or being carried by one person.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ work?: string }>;
}) {
  const { work = "" } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="page-cover contact-cover">
          <p className="eyebrow">Contact</p>
          <h1>Bring the unfinished picture.</h1>
          <p>You do not need a polished scope. Tell us what is moving, what keeps getting lost, and what must not fail.</p>
        </section>

        <section className="section contact-layout">
          <div>
            <p className="eyebrow">A useful first conversation</p>
            <h2>Start with the work, not a product.</h2>
            <p>We will listen for the responsibility, deadline, transition, or decision underneath the immediate request.</p>
            <div className="contact-direct">
              <p><span>Email</span><a href="mailto:hello@publiclogic.org">hello@publiclogic.org</a></p>
              <p><span>Based in</span>Gardner, Massachusetts</p>
              <p><span>Working with</span>Public organizations, partners, and complex projects</p>
            </div>
          </div>
          <ContactBrief initialWork={work} />
        </section>

        <section className="section contact-expect">
          <div><span>01</span><h3>We read the brief</h3><p>A real person reviews what you send.</p></div>
          <div><span>02</span><h3>We clarify the need</h3><p>The first conversation is about the work and the people carrying it.</p></div>
          <div><span>03</span><h3>We name a useful next step</h3><p>If there is a fit, we define a bounded beginning and what it should leave behind.</p></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
