import Link from "next/link";
import type { TagRegistry } from "@/lib/paper-trail/schema";

export function TopicRow({
  shelf,
  tags,
  tagRegistry,
}: {
  shelf: "release" | "finding";
  tags: string[];
  tagRegistry: TagRegistry;
}) {
  const shelfLabel = shelf === "release" ? "Release" : "Finding";
  const shelfHref = shelf === "release" ? "/paper-trail/releases" : "/paper-trail/findings";

  return (
    <div className="pt-topic-row">
      <Link href={shelfHref} className={`pt-shelf-chip pt-shelf-${shelf}`}>
        {shelfLabel}
      </Link>
      {tags.map((t) => (
        <Link key={t} href={`/paper-trail/topics/${t}`} className="pt-tag-chip">
          {tagRegistry[t]?.label ?? t}
        </Link>
      ))}
    </div>
  );
}
