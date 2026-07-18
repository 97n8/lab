import { getPublishedItems } from "../../../lib/paper-trail/collection";
import { buildAtomFeed } from "../../../lib/paper-trail/atom";
import { SITE_URL } from "../../../lib/paper-trail/urls";

export function GET() {
  const feed = buildAtomFeed({
    title: "The Paper Trail — PublicLogic LLC",
    feedUrl: `${SITE_URL}/paper-trail/feed.xml`,
    items: getPublishedItems(),
  });
  return new Response(feed, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } });
}
