import { getPublishedByShelf } from "../../../../lib/paper-trail/collection";
import { buildAtomFeed } from "../../../../lib/paper-trail/atom";
import { SITE_URL } from "../../../../lib/paper-trail/urls";

export function GET() {
  const feed = buildAtomFeed({
    title: "The Paper Trail — Findings",
    feedUrl: `${SITE_URL}/paper-trail/findings/feed.xml`,
    items: getPublishedByShelf("finding"),
  });
  return new Response(feed, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } });
}
