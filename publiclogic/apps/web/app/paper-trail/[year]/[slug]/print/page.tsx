import { notFound } from "next/navigation";
import { marked } from "marked";
import { getItem, getTagRegistry } from "../../../../../lib/paper-trail/collection";
import { buildCitation } from "../../../../../lib/paper-trail/citation";
import { buildSeal } from "../../../../../lib/paper-trail/seal";

/**
 * Dedicated print target for the PDF export CI job (§7): Playwright loads
 * this route and prints it to PDF. No SiteHeader/SiteFooter, no nav chrome —
 * the seal block here stands in for the page-1 header the Playwright job
 * requests; the "page N of M" footer is injected by Playwright's own
 * headerTemplate/footerTemplate, not rendered here.
 */
export default async function PrintPage({
  params,
}: {
  params: Promise<{ year: string; slug: string }>;
}) {
  const { year, slug } = await params;
  const item = getItem(year, slug);
  if (!item) notFound();

  const tags = getTagRegistry();
  const seal = buildSeal(item);
  const citation = buildCitation(item);
  const bodyHtml = marked.parse(item.body, { async: false }) as string;

  return (
    <main className="pt-print">
      <header className="pt-print-seal">
        <div className="pt-print-seal-mark">PublicLogic</div>
        <div className="pt-print-seal-line">THE PAPER TRAIL — VERSION OF RECORD</div>
        <div className="pt-print-seal-meta">
          {seal.id} · v{seal.version} · Published {seal.publishedLabel} · {seal.canonicalUrl}
        </div>
      </header>

      <h1>{item.title}</h1>
      <p className="pt-print-tags">
        {item.shelf === "release" ? "Release" : "Finding"} · {item.tags.map((t) => tags[t]?.label ?? t).join(", ")}
      </p>
      <p className="pt-print-abstract">{item.abstract}</p>

      <div className="pt-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

      {item.shelf === "finding" && (
        <section>
          <h2>Sources</h2>
          {item.sources.length > 0 ? (
            <ul>
              {item.sources.map((s, i) => (
                <li key={i}>{s.url ? `${s.label} — ${s.url}` : s.label}</li>
              ))}
            </ul>
          ) : (
            <p>No sources listed.</p>
          )}
        </section>
      )}

      {item.corrections.length > 0 && (
        <section className="pt-print-corrections">
          <h2>Corrections log</h2>
          <ul>
            {item.corrections.map((c, i) => (
              <li key={i}>
                {c.date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · v{c.version}{" "}
                — {c.note}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="pt-print-citation">{citation}</p>
    </main>
  );
}
