const STEPS = [
  { n: "1", title: "Intake", body: "form, email, calendar" },
  { n: "2", title: "CaseSpace", body: "one record opens" },
  { n: "3", title: "Events", body: "time, notes, files, approvals" },
  { n: "4", title: "Close", body: "freeze, export, archive" },
  { n: "5", title: "Continuity", body: "survives turnover" },
]

const PIPELINE = [
  "Seed",
  "Form",
  "CaseSpace",
  "Recordstream",
  "Evidence",
  "Gate",
  "Check",
  "Digest",
  "Packet",
  "Seal",
]

export function HowItWorksSection() {
  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">How PuddleJumper works</p>
        <h2 className="text-balance text-3xl font-black tracking-tight text-primary sm:text-4xl">
          Five steps. Every case.
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-5">
          {STEPS.map((s) => (
            <div key={s.n} className="text-center sm:text-left">
              <span className="text-3xl font-black text-accent">{s.n}</span>
              <h3 className="mt-2 font-bold text-primary">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-2xl leading-relaxed text-foreground">
          Every intake becomes a case. Every change becomes an event. Every close becomes an{" "}
          <strong className="text-primary">immutable packet.</strong>
        </p>

        <details className="mt-6 rounded-xl border border-border bg-secondary/60 p-5">
          <summary className="cursor-pointer text-sm font-bold text-primary">
            Underneath: ten steps, every time
          </summary>
          <div className="mt-4 flex flex-wrap gap-3">
            {PIPELINE.map((step, i) => (
              <span
                key={step}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground"
              >
                {step}
                {i < PIPELINE.length - 1 ? <span aria-hidden="true" className="text-accent">→</span> : null}
              </span>
            ))}
          </div>
        </details>
      </div>
    </section>
  )
}
