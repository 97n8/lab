import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";
import { CemeteryRecord } from "./CemeteryRecord";
import data from "./sample-record.json";
import type { CemeteryRecord as Rec } from "./buildCemeteryRuntime";

export const metadata: Metadata = {
  title: "Cemetery Records · Unexpected Proof | PublicLogic",
  description:
    "Municipal cemetery records — burial request, deed, fees, scheduling, and permit on one permanent timeline. The case where the record itself is the service, on PJ's verified runtime.",
};

export default function CemeteryPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="MUNI · unexpected proof — cemetery records"
          title="Where the record is the service."
          lede="A burial request, a deed, fees, scheduling, a permit, and a map — one permanent record on one timeline. Cemetery records are kept forever, which makes them the purest test of PJ's promise: the record should stay, and it should still be provable decades later."
        />
        <section className="section">
          <CemeteryRecord record={data.record as Rec} org={data.org} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
