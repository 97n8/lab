import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHeader } from "@/components/page-header"
import { CTASection } from "@/components/cta-section"
import { pilots } from "@/lib/pilots-content"

export const metadata: Metadata = {
  title: "Pilots",
  description:
    "Three working PuddleJumper pilots — a small contractor, a town HR office, and municipal cemetery records — showing the same runtime governing three very different kinds of work.",
}

export default function PilotsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PageHeader
          eyebrow="Clickable proof"
          title="Three pilots. Three live demos."
          lede="The same runtime, in three very different kinds of work — each one a working demo that seals and verifies a case from intake to closeout."
        />

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl space-y-14 px-6 lg:px-8">
            {pilots.map((p) => (
              <article key={p.slug} id={p.slug} className="scroll-mt-24 border-b border-border pb-14 last:border-0">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">{p.tag}</span>
                <h2 className="mt-2 text-2xl font-black text-primary sm:text-3xl">{p.sub}</h2>
                <p className="mt-4 text-lg leading-relaxed text-foreground">{p.summary}</p>
                <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
                  {p.detail.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <div className="mt-6 inline-flex flex-col rounded-xl border border-border bg-secondary/60 px-5 py-4">
                  <span className="text-sm font-black text-primary">{p.stat}</span>
                  <span className="text-xs text-muted-foreground">{p.note}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <CTASection />
      </main>
      <SiteFooter />
    </div>
  )
}
