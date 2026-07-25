import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "../../../../components/SiteHeader";
import { SiteFooter } from "../../../../components/SiteFooter";
import { PageIntro } from "../../../../components/PageIntro";
import { ItemCard } from "../../../../components/paper-trail/ItemCard";
import { getPublishedByTag, getTagRegistry } from "../../../../lib/paper-trail/collection";
import { buildTopicHubJsonLd, jsonLdScriptProps } from "../../../../lib/paper-trail/jsonld";

export function generateStaticParams() {
  const tags = getTagRegistry();
  return Object.keys(tags).map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const label = getTagRegistry()[tag]?.label;
  if (!label) return {};
  return {
    title: `${label} — The Paper Trail`,
    description: `Paper Trail releases and findings tagged ${label}.`,
  };
}

export default async function TopicHubPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const tags = getTagRegistry();
  const label = tags[tag]?.label;
  if (!label) notFound();

  const items = getPublishedByTag(tag);
  const jsonLd = buildTopicHubJsonLd(tag, label);

  return (
    <>
      <script type="application/ld+json" {...jsonLdScriptProps(jsonLd)} />
      <SiteHeader />
      <main id="main">
        <PageIntro
          eyebrow="The Paper Trail · Topic"
          title={label}
          lede={`Every published item tagged ${label}.`}
        />
        <section className="section pt-index">
          {items.length > 0 ? (
            <div className="pt-item-grid">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="pt-empty">Nothing published under {label} yet.</p>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
