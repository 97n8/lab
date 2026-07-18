import Link from "next/link";
import type { PaperTrailItem } from "@/lib/paper-trail/schema";
import { itemPath } from "@/lib/paper-trail/urls";

export function ItemCard({ item }: { item: PaperTrailItem }) {
  return (
    <Link href={itemPath(item)} className="pt-item-card">
      <span className={`pt-item-shelf pt-shelf-${item.shelf}`}>
        {item.shelf === "release" ? "Release" : "Finding"}
      </span>
      <h3>{item.title}</h3>
      <p>{item.abstract}</p>
      <div className="pt-item-meta">
        <span>{item.id}</span>
        <span>
          {item.datePublished.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </span>
      </div>
    </Link>
  );
}
