const PROBLEMS = [
  { title: "Dropped balls", body: "Work that quietly stops moving because no one owns the next step." },
  { title: "Missing proof", body: "It happened, but nothing shows it happened — or who decided what." },
  { title: "Orphaned decisions", body: "Choices made in a thread, lost the moment the thread scrolls away." },
  { title: "Memory loss", body: "The person who knew leaves, and the institution forgets." },
]

export function ProblemSection() {
  return (
    <section className="border-b border-border bg-secondary/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">The real competition</p>
        <h2 className="text-balance text-3xl font-black tracking-tight text-primary sm:text-4xl">
          Not workflow tools — dropped balls.
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          PuddleJumper isn&rsquo;t competing with workflow tools. It&rsquo;s competing with dropped balls,
          missing proof, orphaned decisions, and institutional memory loss. That is the market.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PROBLEMS.map((p) => (
            <article key={p.title} className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-bold text-primary">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
