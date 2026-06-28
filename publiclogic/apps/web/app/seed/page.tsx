import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";
import { SeedCompiler } from "./SeedCompiler";

export const metadata: Metadata = {
  title: "Seed · GP-001 Identity Compiler | PublicLogic",
  description:
    "One seed in, four governed objects out: Source Profile, Asset Set, Document Set, Starter CaseSpace.",
};

export default function SeedPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="GP-001 · the identity compiler"
          title="Start with what you have."
          lede="Drop one seed — a website, listing, repo, folder, or nothing at all — and the runtime compiles four governed objects to build everything else around. No AI, no forms yet."
        />
        <section className="section">
          <SeedCompiler />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
