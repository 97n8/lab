import { getPublishedByShelf } from "../../../../lib/paper-trail/collection";
import { buildAtomFeed } from "../../../../lib/paper-trail/atom";
import { SITE_URL } from "../../../../lib/paper-trail/urls";

export function GET() {
  const feed = buildAtomFeed({
    title: "The Paper Trail — Releases",
    feedUrl: `${SITE_URL}/paper-trail/releases/feed.xml`,
    items: getPublishedByShelf("release"),
  });
  return new Response(feed, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } });
}
