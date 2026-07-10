import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHeader } from "@/components/page-header"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { CTASection } from "@/components/cta-section"

export const metadata: Metadata = {
  title: "Product",
  description:
    "How PuddleJumper, PublicLogic's governance runtime, turns everyday intake into a continuous, auditable record — and how STAY, MUNI, BIZ, and GRANT build on top of it.",
}

const LAYERS = [
  {
    name: "PuddleJumper Runtime",
    tag: "runtime/",
    body: "The execution engine. It opens, moves, and seals CaseSpaces — kernel, lifecycle, transitions, and events. It never knows what a “booking” or a “permit” is; it just governs how any case moves and closes.",
  },
  {
    name: "Doctrine (VAULT)",
    tag: "doctrine/",
    body: "The governance rules the runtime proves, not just documents: VAULT continuity, CAL, PRM, authority, and legitimacy. This is what makes a closeout defensible, not just complete.",
  },
  {
    name: "Core Models",
    tag: "models/",
    body: "CaseSpace and its parts — form, record, thread, organization, person, asset, location, timeline. The shared vocabulary every product skin is built from.",
  },
  {
    name: "Reusable Capabilities",
    tag: "capabilities/",
    body: "Booking, turnover, guestbook, calendar, maintenance, finance, messaging, and more — operational abilities any product skin can compose without reinventing the logic.",
  },
  {
    name: "Product Skins",
    tag: "apps/",
    body: "STAY, MUNI, BIZ, and GRANT — thin, mostly-configuration products that assemble capabilities, templates, and branding for a specific kind of work.",
  },
]

const SKINS = [
  { name: "STAY", body: "Short-term rental operations — bookings, turnover, guestbook, maintenance." },
  { name: "MUNI", body: "Municipal workflows — HR intake, permits, records, and public-sector case management." },
  { name: "BIZ", body: "Small-business operations — jobs, invoicing, and field work for shops that run lean." },
  { name: "GRANT", body: "Grant and program administration — application intake through award closeout." },
]

export default function ProductPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PageHeader
          eyebrow="Product"
          title="One runtime. Four layers. Any kind of work."
          lede="PuddleJumper stays a thin execution runtime. Doctrine, models, and capabilities compose underneath it; STAY, MUNI, BIZ, and GRANT are thin skins on top."
        />

        <section className="border-b border-border py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <ol className="space-y-6">
              {LAYERS.map((layer, i) => (
                <li key={layer.name} className="flex gap-5 rounded-xl border border-border bg-card p-6">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h2 className="font-bold text-primary">{layer.name}</h2>
                      <code className="text-xs text-muted-foreground">{layer.tag}</code>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{layer.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <HowItWorksSection />

        <section className="border-b border-border bg-secondary/60 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Product skins</p>
            <h2 className="text-balance text-3xl font-black tracking-tight text-primary sm:text-4xl">
              Configuration, not logic.
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              A product skin contains almost no logic of its own. It composes shared capabilities and
              supplies templates and branding for one kind of work.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {SKINS.map((s) => (
                <div key={s.name} className="rounded-xl border border-border bg-card p-6">
                  <h3 className="text-lg font-black text-primary">{s.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
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
