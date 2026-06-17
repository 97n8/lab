export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/">PublicLogic</a>
      <nav aria-label="Primary navigation">
        <a href="/solutions">Solutions</a>
        <a href="/products">Products</a>
        <a href="/permit-bridge">Permit &amp; Bridge</a>
        <a href="/method">Method</a>
        <a href="/about">About</a>
        <a href="/resources">Resources</a>
      </nav>
      <div className="header-actions">
        <a href="/contact" className="nav-link">Contact</a>
        <a href="https://pj.publiclogic.org" className="button primary small">Enter PuddleJumper →</a>
      </div>
    </header>
  );
}
