const TOOLS = [
  "Gmail",
  "Drive",
  "Sheets",
  "QuickBooks",
  "Calendar",
  "DocuSign",
  "iCal",
  "Airbnb",
  "SharePoint",
  "CivicPlus",
  "GitHub",
]

export function IntegrationsSection() {
  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">The wedge</p>
          <h2 className="text-balance text-3xl font-black tracking-tight text-primary sm:text-4xl">
            Your tools can stay messy. The record cannot.
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            You don&rsquo;t need to replace Gmail, Drive, QuickBooks, the HRIS, or the spreadsheet. You
            need to govern what those tools are already producing.
          </p>
          <p className="mt-3 text-sm font-semibold text-primary">
            Most software wants to become the system of record. We don&rsquo;t.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-secondary/60 p-6">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Keep your tools</p>
          <div className="flex flex-wrap gap-2">
            {TOOLS.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
