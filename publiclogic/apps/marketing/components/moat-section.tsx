const FLOW = ["Traceable intake", "Living case record", "Decisions & artifacts captured", "Immutable closeout"]

const WINS = [
  { title: "Fewer re-entries", body: "The same fact isn't typed into five tools." },
  { title: "Faster closeout", body: "No Friday-night reconstruction to close a job." },
  { title: "Cleaner audits", body: "The proof is already assembled and ordered." },
  { title: "Less institutional amnesia", body: "The record stays when the person leaves." },
]

export function MoatSection() {
  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">The moat</p>
        <h2 className="text-balance text-3xl font-black tracking-tight text-primary sm:text-4xl">
          Traceable in. Immutable out.
        </h2>

        <div className="mt-8 flex flex-wrap gap-3">
          {FLOW.map((step, i) => (
            <span
              key={step}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-semibold text-foreground"
            >
              {step}
              {i < FLOW.length - 1 ? <span aria-hidden="true" className="text-accent">→</span> : null}
            </span>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {WINS.map((w) => (
            <article key={w.title} className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-bold text-primary">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
