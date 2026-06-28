import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";
import { RecordStream } from "./RecordStream";

export const metadata: Metadata = {
  title: "PRR · GP-004 Recordstream | PublicLogic",
  description:
    "The append-only recordstream. Evidence, decisions, CAL, and PRM all write back — the stream is the proof.",
};

export default function RecordStreamPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="GP-004 · the recordstream"
          title="Every move, recorded."
          lede="The CaseSpace is open. Now take actions — request evidence, log decisions, run a CAL gate or a PRM check — and watch each one append to PRR. Nothing is edited or deleted."
        />
        <section className="section">
          <RecordStream />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
