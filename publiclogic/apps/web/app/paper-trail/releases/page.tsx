import type { Metadata } from "next";
import { SiteHeader } from "../../../components/SiteHeader";
import { SiteFooter } from "../../../components/SiteFooter";
import { PageIntro } from "../../../components/PageIntro";
import { ItemCard } from "../../../components/paper-trail/ItemCard";
import { ShelfTabs } from "../../../components/paper-trail/ShelfTabs";
import { getPublishedByShelf } from "../../../lib/paper-trail/collection";

export const metadata: Metadata = {
  title: "Releases — The Paper Trail",
  description: "PublicLogic's Release-shelf items: announcements and version-of-record statements.",
};

export default function ReleasesPage() {
  const items = getPublishedByShelf("release");

  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageIntro
          eyebrow="The Paper Trail"
          title="Releases"
          lede="Announcements and version-of-record statements — the things PublicLogic said, dated and citable."
        />
        <section className="section pt-index">
          <ShelfTabs active="release" />
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
