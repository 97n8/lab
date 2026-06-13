import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="section">
        <div className="panel">
          <p className="eyebrow">PublicLogic</p>
          <h1>CaseSpaces</h1>
          <p className="lede">A governed workspace for each project, issue, client, grant, property, or institutional process.</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
