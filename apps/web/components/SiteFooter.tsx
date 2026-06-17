export function SiteFooter() {
  return (
    <footer>
      <div>
        <span style={{ fontWeight: 900, color: 'var(--green)' }}>PublicLogic</span>
        <span style={{ marginLeft: '1rem' }}>Gardner · Massachusetts · AI assists · never decides</span>
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <a href="/solutions" style={{ textDecoration: 'none', color: 'var(--muted)' }}>Solutions</a>
        <a href="/products" style={{ textDecoration: 'none', color: 'var(--muted)' }}>Products</a>
        <a href="/permit-bridge" style={{ textDecoration: 'none', color: 'var(--muted)' }}>Permit &amp; Bridge</a>
        <a href="/method" style={{ textDecoration: 'none', color: 'var(--muted)' }}>Method</a>
        <a href="/about" style={{ textDecoration: 'none', color: 'var(--muted)' }}>About</a>
        <a href="/contact" style={{ textDecoration: 'none', color: 'var(--muted)' }}>Contact</a>
      </div>
    </footer>
  );
}
