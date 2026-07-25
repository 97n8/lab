import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { SiteHeader } from "../../../../components/SiteHeader";
import { SiteFooter } from "../../../../components/SiteFooter";
import { TopicRow } from "../../../../components/paper-trail/TopicRow";
import { RecordLine } from "../../../../components/paper-trail/RecordLine";
import { AbstractBlock } from "../../../../components/paper-trail/AbstractBlock";
import { CorrectionsLog } from "../../../../components/paper-trail/CorrectionsLog";
import { CitationBlock } from "../../../../components/paper-trail/CitationBlock";
import { SealFooter } from "../../../../components/paper-trail/SealFooter";
import { ShareRow } from "../../../../components/paper-trail/ShareRow";
import {
  getAuthorRegistry,
  getItem,
  getPublishedItems,
  getTagRegistry,
} from "../../../../lib/paper-trail/collection";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, jsonLdScriptProps } from "../../../../lib/paper-trail/jsonld";
import { buildCitation } from "../../../../lib/paper-trail/citation";
import { buildSeal } from "../../../../lib/paper-trail/seal";
import { pdfFileExists } from "../../../../lib/paper-trail/pdf";
import { itemUrl } from "../../../../lib/paper-trail/urls";

export function generateStaticParams() {
  return getPublishedItems().map((item) => ({ year: item.year, slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; slug: string }>;
}): Promise<Metadata> {
  const { year, slug } = await params;
  const item = getItem(year, slug);
  if (!item) return {};

  const url = itemUrl(item);
  const tags = getTagRegistry();

  return {
    title: item.title,
    description: item.abstract,
    alternates: { canonical: url },
    openGraph: {
      title: item.title,
      description: item.abstract,
      type: "article",
      publishedTime: item.datePublished.toISOString(),
      modifiedTime: item.dateModified?.toISOString(),
      tags: item.tags.map((t) => tags[t]?.label ?? t),
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.abstract,
    },
  };
}

export default async function PaperTrailItemPage({
  params,
}: {
  params: Promise<{ year: string; slug: string }>;
}) {
  const { year, slug } = await params;
  const item = getItem(year, slug);
  if (!item) notFound();

  const tags = getTagRegistry();
  const authors = getAuthorRegistry();

  const seal = buildSeal(item);
  const citation = buildCitation(item);
  const articleJsonLd = buildArticleJsonLd(item, authors, tags);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(item);
  const bodyHtml = marked.parse(item.body, { async: false }) as string;

  return (
    <>
      <script type="application/ld+json" {...jsonLdScriptProps(articleJsonLd)} />
      <script type="application/ld+json" {...jsonLdScriptProps(breadcrumbJsonLd)} />
      <SiteHeader />
      <main id="main">
        <article className="section pt-item">
          <TopicRow shelf={item.shelf} tags={item.tags} tagRegistry={tags} />
          <h1 className="page-title">{item.title}</h1>
          <RecordLine seal={seal} />
          <AbstractBlock text={item.abstract} />

          <div className="pt-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

          {item.shelf === "finding" && (
            <section className="pt-sources">
              <h2>Sources</h2>
              {item.sources.length > 0 ? (
                <ul>
                  {item.sources.map((s, i) => (
                    <li key={i}>{s.url ? <a href={s.url}>{s.label}</a> : s.label}</li>
                  ))}
                </ul>
              ) : (
                <p className="pt-no-sources">No sources listed.</p>
              )}
            </section>
          )}

          <CorrectionsLog corrections={item.corrections} />
          <CitationBlock citation={citation} />
          <SealFooter seal={seal} />
          <ShareRow
            url={seal.canonicalUrl}
            title={item.title}
            abstract={item.abstract}
            pdfUrl={seal.pdfUrl}
            pdfReady={pdfFileExists(item)}
          />
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
