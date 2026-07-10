import Link from "next/link"
import { Mail } from "lucide-react"

const productLinks = [
  { name: "Product", href: "/product" },
  { name: "Pilots", href: "/pilots" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-lg font-extrabold tracking-tight">
              <span className="relative h-6 w-6 flex-none rounded-[7px] bg-primary-foreground/10 shadow-[inset_0_0_0_3px_var(--primary),0_0_0_1px_var(--primary-foreground)]">
                <span className="absolute inset-[6px] rounded-[999px_999px_999px_2px] bg-accent" />
              </span>
              PublicLogic
            </Link>
            <p className="mt-3 max-w-xs text-sm text-primary-foreground/80">
              Systems that stick. A governance-aware continuity layer for real work — one time-stamped
              record from intake to exit.
            </p>
            <a
              href="mailto:hello@publiclogic.org"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground/90 hover:text-primary-foreground"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              hello@publiclogic.org
            </a>
          </div>

          <nav aria-label="Footer" className="sm:justify-self-end">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              {productLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-primary-foreground/80 hover:text-primary-foreground">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60 sm:flex-row">
          <span>© {new Date().getFullYear()} PublicLogic LLC</span>
          <span>Continuity · Data · Stewardship</span>
          <nav className="flex items-center gap-4">
            {legalLinks.map((item) => (
              <Link key={item.name} href={item.href} className="hover:text-primary-foreground/90">
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
