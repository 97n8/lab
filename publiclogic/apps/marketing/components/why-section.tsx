const REASONS = [
  "Simple enough for a tiny shop.",
  "Rigorous enough for town hall.",
  "Turns everyday work into a trustworthy record.",
]

export function WhySection() {
  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Why it wins</p>
        <h2 className="text-balance text-3xl font-black tracking-tight text-primary sm:text-4xl">
          Small enough to use. Rigorous enough to trust.
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {REASONS.map((r) => (
            <li key={r} className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
              <span aria-hidden="true" className="mt-0.5 font-black text-accent">
                ✓
              </span>
              <span className="font-semibold text-foreground">{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
