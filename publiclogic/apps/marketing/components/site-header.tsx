"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Product", href: "/product" },
  { name: "Pilots", href: "/pilots" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-lg font-extrabold tracking-tight text-primary"
          aria-label="PublicLogic home"
          onClick={() => setMobileOpen(false)}
        >
          <span className="relative h-6 w-6 flex-none rounded-[7px] bg-primary shadow-[inset_0_0_0_3px_var(--background),0_0_0_1px_var(--primary)]">
            <span className="absolute inset-[6px] rounded-[999px_999px_999px_2px] bg-accent" />
          </span>
          PublicLogic
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm uppercase tracking-wide transition-colors hover:text-primary ${
                pathname === item.href ? "font-bold text-primary" : "font-medium text-foreground/80"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Button asChild size="sm" className="uppercase tracking-wide">
            <Link href="/contact">Get in touch</Link>
          </Button>
        </nav>

        <button
          type="button"
          className="-m-2 p-2 text-foreground lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen ? (
        <nav className="border-t border-border bg-background lg:hidden" aria-label="Primary mobile">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block border-b border-border px-5 py-3 text-sm uppercase tracking-wide transition-colors ${
                pathname === item.href ? "bg-secondary font-bold text-primary" : "font-medium text-foreground/80"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="block px-5 py-3 text-sm font-bold uppercase tracking-wide text-accent"
          >
            Get in touch →
          </Link>
        </nav>
      ) : null}
    </header>
  )
}
