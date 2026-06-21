import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <Link className="brand" href="/" aria-label="PublicLogic home">
            <span className="brand-mark" aria-hidden="true" />
            <span>PublicLogic</span>
          </Link>
          <p className="footer-tag">Systems That Stick.</p>
        </div>
        <nav aria-label="Footer">
          <Link href="/work">Work</Link>
          <Link href="/casespaces">CaseSpaces</Link>
          <Link href="/pj">PuddleJumper</Link>
          <Link href="/vault">VAULT</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
      <div className="footer-base">
        <span>© {year} PublicLogic LLC</span>
        <span>Continuity • Data • Stewardship</span>
      </div>
    </footer>
  );
}
