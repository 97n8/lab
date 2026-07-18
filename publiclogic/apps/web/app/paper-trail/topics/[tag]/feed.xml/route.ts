import { notFound } from "next/navigation";
import { getPublishedByTag, getTagRegistry } from "../../../../../lib/paper-trail/collection";
import { buildAtomFeed } from "../../../../../lib/paper-trail/atom";
import { SITE_URL } from "../../../../../lib/paper-trail/urls";

export function generateStaticParams() {
  return Object.keys(getTagRegistry()).map((tag) => ({ tag }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const label = getTagRegistry()[tag]?.label;
  if (!label) notFound();

  const feed = buildAtomFeed({
    title: `The Paper Trail — ${label}`,
    feedUrl: `${SITE_URL}/paper-trail/topics/${tag}/feed.xml`,
    items: getPublishedByTag(tag),
  });
  return new Response(feed, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } });
}
