import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="section">
        <div className="panel">
          <p className="eyebrow">PublicLogic</p>
          <h1>VAULT</h1>
          <p className="lede">The continuity spine for decisions, documents, audit trails, and institutional memory.</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
