import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="bg-primary">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-28 lg:px-8">
        <p className="inline-flex items-center gap-2 rounded bg-accent px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-foreground">
          The governance-aware continuity layer for real work
        </p>
        <h1 className="mt-5 text-balance text-4xl font-black leading-[1.05] tracking-tight text-primary-foreground sm:text-6xl">
          Don&rsquo;t replace your stack. Give it a spine.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance leading-relaxed text-primary-foreground/85">
          One time-stamped record from intake to exit — fast enough for everyday work, defensible enough
          for audits, turnover, and retention. PuddleJumper governs what your tools already produce; it
          doesn&rsquo;t replace them.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
            <Link href="/pilots">See it live</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
          >
            <Link href="/product">How it works</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
