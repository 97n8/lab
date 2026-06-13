import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="section">
        <div className="panel">
          <p className="eyebrow">PublicLogic</p>
          <h1>Work</h1>
          <p className="lede">Institutional readiness, governed automation, and continuity systems for public-sector operations.</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
