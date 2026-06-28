import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";
import { MuniCaseSpace } from "./MuniCaseSpace";
import data from "./sample-cases.json";
import type { MuniCase } from "./buildMuniRuntime";

export const metadata: Metadata = {
  title: "MUNI · People come and go. The record should stay. | PublicLogic",
  description:
    "Municipal onboarding and offboarding as governed CaseSpaces on the same verified runtime as STAY — one accountable record that survives turnover.",
};

export default function MuniPage() {
  const cases = data.cases as MuniCase[];
  return (
    <>
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="MUNI · onboarding & offboarding"
          title="People come and go. The record should stay."
          lede="Keep Gmail, Drive, Excel, the HRIS — PJ connects them into one accountable operating record. Each person becomes one CaseSpace: tasks, files, approvals, deadlines, and ownership in one place. When someone leaves, the record stays with the Town, not the person."
        />
        <section className="section">
          <MuniCaseSpace cases={cases} org={data.org} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
