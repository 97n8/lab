interface PageHeaderProps {
  eyebrow: string
  title: string
  lede?: string
}

export function PageHeader({ eyebrow, title, lede }: PageHeaderProps) {
  return (
    <section className="bg-primary py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">{eyebrow}</p>
        <h1 className="text-balance text-3xl font-black tracking-tight text-primary-foreground sm:text-5xl">
          {title}
        </h1>
        {lede ? (
          <p className="mx-auto mt-4 max-w-2xl text-balance text-primary-foreground/85">{lede}</p>
        ) : null}
      </div>
    </section>
  )
}
