import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";
import { ItemCard } from "../../components/paper-trail/ItemCard";
import { ShelfTabs } from "../../components/paper-trail/ShelfTabs";
import { TopicChips } from "../../components/paper-trail/TopicChips";
import { getAllTagsInUse, getPublishedItems, getTagRegistry } from "../../lib/paper-trail/collection";
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from "../../lib/paper-trail/jsonld";

export const metadata: Metadata = {
  title: "The Paper Trail",
  description:
    "The version-of-record archive for PublicLogic's releases and findings — every item dated, versioned, and correctable in public.",
};

export default function PaperTrailIndex() {
  const items = getPublishedItems();
  const tags = getTagRegistry();
  const tagsInUse = getAllTagsInUse();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebsiteJsonLd()) }}
      />
      <SiteHeader />
      <main id="main">
        <PageIntro
          eyebrow="The Paper Trail"
          title="The version of record."
          lede="Every release and finding PublicLogic publishes — dated, versioned, and correctable in public. Nothing here disappears. It gets corrected, on the record."
        />
        <section className="section pt-index">
          <ShelfTabs active="all" />
          <TopicChips tagsInUse={tagsInUse} tagRegistry={tags} />
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
