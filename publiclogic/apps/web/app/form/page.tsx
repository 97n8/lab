import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";
import { FormFlow } from "./FormFlow";

export const metadata: Metadata = {
  title: "FORM · GP-002 Universal Intake | PublicLogic",
  description:
    "The shortest possible intake, opened against a real Source Profile. The form already knows — so it has teeth.",
};

export default function FormPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="GP-002 · the universal form"
          title="Forms with teeth."
          lede="Because GP-001 already compiled the identity, the form doesn’t ask “company name? property? contact?” — it knows. You answer only what’s genuinely new, and a valid CaseSpace opens."
        />
        <section className="section">
          <FormFlow />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
