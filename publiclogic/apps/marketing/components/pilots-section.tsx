import Link from "next/link"
import { pilots } from "@/lib/pilots-content"

export function PilotsSection() {
  return (
    <section className="border-b border-border bg-secondary/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Clickable proof</p>
        <h2 className="text-balance text-3xl font-black tracking-tight text-primary sm:text-4xl">
          Three pilots. Three kinds of work.
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          The same runtime, in three very different kinds of work — from a two-person contractor to a
          town hall.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {pilots.map((p) => (
            <Link
              key={p.slug}
              href={`/pilots#${p.slug}`}
              className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-accent">{p.tag}</span>
              <span className="mt-1 text-sm font-semibold text-primary">{p.sub}</span>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
              <span className="mt-4 text-sm font-bold text-primary">{p.stat}</span>
              <span className="text-xs text-muted-foreground">{p.note}</span>
              <span className="mt-4 text-sm font-bold text-accent group-hover:underline">See it live →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
