import Link from "next/link";
import { BrandMark } from "./BrandMark";

const links = [
  { href: "/services", label: "Services" },
  { href: "/method", label: "Method" },
  { href: "/work", label: "Selected work" },
  { href: "/proof", label: "Proof" },
  { href: "/paper-trail", label: "Paper Trail" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="PublicLogic home">
        <BrandMark />
      </Link>
      <div className="nav-actions">
        <nav className="desktop-nav" aria-label="Primary">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <Link className="nav-cta" href="/contact">Start a conversation</Link>
        </nav>
        <details className="mobile-nav">
          <summary>Menu</summary>
          <nav aria-label="Mobile primary">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
            <Link href="/contact">Start a conversation</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
