import Link from "next/link"
import { Button } from "@/components/ui/button"

const PROOF = [
  "Time-stamped every step",
  "Provenance for every change",
  "Immutable closeout",
  "Exportable anytime",
  "Built for audits, retention, and trust",
]

export function CTASection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="rounded-2xl bg-primary px-6 py-14 text-center sm:px-12">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Proof is the product</p>
          <h2 className="text-balance text-3xl font-black tracking-tight text-primary-foreground sm:text-4xl">
            Everything else is packaging.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-primary-foreground/85">
            A clean path, a live record, and a sealed handoff — for whatever your work actually is.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
              <Link href="/contact">Get in touch</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
            >
              <Link href="/pilots">See the pilots</Link>
            </Button>
          </div>
        </div>

        <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {PROOF.map((p) => (
            <li key={p} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
