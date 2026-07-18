import Link from "next/link";

export function ShelfTabs({ active }: { active: "all" | "release" | "finding" }) {
  return (
    <nav className="pt-shelf-tabs" aria-label="Filter by shelf">
      <Link href="/paper-trail" className={active === "all" ? "pt-tab pt-tab-active" : "pt-tab"}>
        All
      </Link>
      <Link href="/paper-trail/releases" className={active === "release" ? "pt-tab pt-tab-active" : "pt-tab"}>
        Releases
      </Link>
      <Link href="/paper-trail/findings" className={active === "finding" ? "pt-tab pt-tab-active" : "pt-tab"}>
        Findings
      </Link>
    </nav>
  );
}
