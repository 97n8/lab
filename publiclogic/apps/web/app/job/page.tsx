import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";
import { JobCaseSpace } from "./JobCaseSpace";

export const metadata: Metadata = {
  title: "A Living Job Record",
  description:
    "A working example that keeps hours, materials, change orders, photos, signatures, and invoicing together from the first call to final payment.",
};

export default function JobPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="Working example · project delivery"
          title="“I’ve got three jobs today.”"
          lede="A contractor thinks in jobs. This is a digital job folder that follows the work from the first call to final payment. Gmail, Calendar, QuickBooks, photos, and texts can stay. The record builds as the job moves."
        />
        <section className="section">
          <JobCaseSpace />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
