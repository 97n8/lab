import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";
import { JobCaseSpace } from "./JobCaseSpace";

export const metadata: Metadata = {
  title: "A job that tracks itself | PublicLogic",
  description:
    "An electrician's day: every job is a CaseSpace that fills itself — hours, materials, change orders, photos, signature, invoice. Nothing changes about the tools they use.",
};

export default function JobPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="BIZ · the living job folder"
          title="“I’ve got three jobs today.”"
          lede="A contractor doesn’t think in projects or tasks — they think in jobs. A CaseSpace is just the digital job folder that follows the work from the first call to the final payment. They keep Gmail, Calendar, QuickBooks, photos, texts. The folder fills itself."
        />
        <section className="section">
          <JobCaseSpace />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
