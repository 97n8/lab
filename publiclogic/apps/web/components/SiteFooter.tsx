import Link from "next/link";
import { BrandMark } from "./BrandMark";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <Link className="brand" href="/" aria-label="PublicLogic home">
            <BrandMark />
          </Link>
          <p className="footer-tag">Systems stewardship for continuity.</p>
        </div>
        <nav aria-label="Footer">
          <Link href="/work">Work</Link>
          <Link href="/proof">Proof</Link>
          <Link href="/services">Services</Link>
          <Link href="/method">Method</Link>
          <Link href="/permit-bridge">Permit &amp; Bridge</Link>
          <Link href="/paper-trail">Paper Trail</Link>
          <Link href="/about">About</Link>
          <Link href="/pj">PuddleJumper</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
      <div className="footer-base">
        <span>© {year} PublicLogic LLC · Gardner, Massachusetts</span>
        <span>We do not create dependency. We create understanding.</span>
      </div>
    </footer>
  );
}
