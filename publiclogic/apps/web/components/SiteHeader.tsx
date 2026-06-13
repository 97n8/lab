export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/">PublicLogic</a>
      <nav aria-label="Primary navigation">
        <a href="/work">Work</a>
        <a href="/casespaces">CaseSpaces</a>
        <a href="/pj">PJ</a>
        <a href="/vault">VAULT</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>
  );
}
