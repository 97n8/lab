import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";
import { MuniCaseSpace } from "./MuniCaseSpace";
import data from "./sample-cases.json";
import type { MuniCase } from "./buildMuniRuntime";

export const metadata: Metadata = {
  title: "Municipal Staff Continuity",
  description:
    "A working example of municipal onboarding and offboarding with tasks, files, approvals, deadlines, and ownership in one place.",
};

export default function MuniPage() {
  const cases = data.cases as MuniCase[];
  return (
    <>
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="Working example · municipal operations"
          title="People come and go. The record should stay."
          lede="A town can keep Gmail, Drive, Excel, and its HR system while bringing the whole staff transition into one accountable record. Tasks, files, approvals, deadlines, and ownership stay visible. When someone leaves, the record stays with the town."
        />
        <section className="section">
          <MuniCaseSpace cases={cases} org={data.org} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
