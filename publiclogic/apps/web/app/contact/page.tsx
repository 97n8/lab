import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="section">
        <div className="panel">
          <p className="eyebrow">PublicLogic</p>
          <h1>Contact</h1>
          <p className="lede">Build the durable layer with PublicLogic.</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
