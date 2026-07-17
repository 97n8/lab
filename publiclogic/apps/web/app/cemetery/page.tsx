import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";
import { CemeteryRecord } from "./CemeteryRecord";
import data from "./sample-record.json";
import type { CemeteryRecord as Rec } from "./buildCemeteryRuntime";

export const metadata: Metadata = {
  title: "Municipal Cemetery Records",
  description:
    "A working example that keeps a burial request, deed, fees, scheduling, permit, and map together as one permanent municipal record.",
};

export default function CemeteryPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="Working example · permanent records"
          title="Where the record is the service."
          lede="A burial request, deed, fees, scheduling, permit, and map belong on one permanent timeline. The record should remain understandable, complete, and ready to check decades later."
        />
        <section className="section">
          <CemeteryRecord record={data.record as Rec} org={data.org} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
