import type { Metadata } from "next";
import { SiteHeader } from "../../../components/SiteHeader";
import { SiteFooter } from "../../../components/SiteFooter";
import { PageIntro } from "../../../components/PageIntro";
import { ItemCard } from "../../../components/paper-trail/ItemCard";
import { ShelfTabs } from "../../../components/paper-trail/ShelfTabs";
import { getPublishedByShelf } from "../../../lib/paper-trail/collection";

export const metadata: Metadata = {
  title: "Findings — The Paper Trail",
  description: "PublicLogic's Findings-shelf items: sourced analysis and documented observations.",
};

export default function FindingsPage() {
  const items = getPublishedByShelf("finding");

  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageIntro
          eyebrow="The Paper Trail"
          title="Findings"
          lede="Sourced analysis and documented observations — cited, correctable, and never quietly removed."
        />
        <section className="section pt-index">
          <ShelfTabs active="finding" />
          {items.length > 0 ? (
            <div className="pt-item-grid">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="pt-empty">Nothing published yet.</p>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
