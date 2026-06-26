import Link from "next/link";

const links = [
  { href: "/work", label: "Work" },
  { href: "/casespaces", label: "CaseSpaces" },
  { href: "/pj", label: "PJ" },
  { href: "/vault", label: "VAULT" },
  { href: "/kpl", label: "KPL" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="PublicLogic home">
        <span className="brand-mark" aria-hidden="true" />
        <span>PublicLogic</span>
      </Link>
      <nav aria-label="Primary">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
