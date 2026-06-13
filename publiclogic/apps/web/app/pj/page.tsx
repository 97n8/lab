import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="section">
        <div className="panel">
          <p className="eyebrow">PublicLogic</p>
          <h1>PuddleJumper</h1>
          <p className="lede">The guided action layer: intake, triage, next step, evidence, owner, review, and archive.</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
