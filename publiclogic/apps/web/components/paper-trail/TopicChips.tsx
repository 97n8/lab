import Link from "next/link";
import type { TagRegistry } from "@/lib/paper-trail/schema";

export function TopicChips({
  tagsInUse,
  tagRegistry,
  activeTag,
}: {
  tagsInUse: string[];
  tagRegistry: TagRegistry;
  activeTag?: string;
}) {
  if (tagsInUse.length === 0) return null;

  return (
    <div className="pt-topic-chips">
      {tagsInUse.map((t) => (
        <Link
          key={t}
          href={`/paper-trail/topics/${t}`}
          className={t === activeTag ? "pt-chip pt-chip-active" : "pt-chip"}
        >
          {tagRegistry[t]?.label ?? t}
        </Link>
      ))}
    </div>
  );
}
