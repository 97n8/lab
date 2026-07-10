import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHeader } from "@/components/page-header"
import { CTASection } from "@/components/cta-section"

export const metadata: Metadata = {
  title: "About",
  description:
    "PublicLogic builds continuity-of-record systems for small operators and public institutions — software that governs what your existing tools already produce.",
}

const VALUES = [
  {
    title: "The record is the deliverable",
    body: "For a lot of the work we build for, the proof that something happened correctly matters as much as the work itself — a permit, a payroll record, a closed job. We treat the record as a first-class product, not an afterthought.",
  },
  {
    title: "Don't replace what works",
    body: "Most institutions and small businesses already have a stack — Gmail, Drive, QuickBooks, a spreadsheet, CivicPlus. We don't ask anyone to rip it out. We govern what it already produces.",
  },
  {
    title: "Built for turnover",
    body: "People leave. Staff change. Contractors move on. A system that only works while the person who understands it stays is not a system — it's a dependency. Continuity has to survive the people.",
  },
  {
    title: "Small enough to use, rigorous enough to trust",
    body: "A two-person electrical shop and a town hall have different budgets and different stakes, but the same underlying need: an honest, ordered account of what happened. One runtime serves both.",
  },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PageHeader eyebrow="About PublicLogic" title="Systems that stick." />

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <p className="text-balance text-xl font-bold leading-snug text-foreground sm:text-2xl">
              PublicLogic builds the governance-aware continuity layer for real work — institutional
              stewardship systems for continuity, data, and public-sector execution.
            </p>
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                We started from a simple observation: the software market is full of workflow tools, but
                workflow tools aren&rsquo;t the real competition. The real competition is dropped balls —
                work that quietly stops moving because no one owns the next step, decisions made in a
                thread and lost when the thread scrolls away, and institutions that forget everything a
                person knew the day they leave.
              </p>
              <p>
                PuddleJumper, our runtime, treats every piece of work as a CaseSpace: one record that opens
                at intake, accumulates events as the work happens, and seals into an immutable packet at
                close. It doesn&rsquo;t replace the tools people already use — it governs what those tools
                are already producing, so the record outlives the person, the software, and the moment.
              </p>
              <p>
                That runtime is deliberately generic. Doctrine (our governance layer, VAULT) and core models
                (CaseSpace and its parts) sit underneath any specific product. STAY, MUNI, BIZ, and GRANT are
                thin skins on top — configuration and branding, not separate logic — because a small
                contractor&rsquo;s job record and a town&rsquo;s employee case are the same shape of problem
                wearing different clothes.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-secondary/60 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">What we believe</p>
            <h2 className="text-balance text-3xl font-black tracking-tight text-primary sm:text-4xl">
              Four ideas behind everything we build.
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {VALUES.map((v) => (
                <article key={v.title} className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-bold text-primary">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <SiteFooter />
    </div>
  )
}
