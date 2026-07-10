import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHeader } from "@/components/page-header"
import { ContactForm } from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with PublicLogic about PuddleJumper, our pilots, or a potential fit for your team.",
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PageHeader
          eyebrow="Contact"
          title="Get in touch"
          lede="Tell us about the work you're trying to govern — a job, a case, a record that keeps slipping through the cracks."
        />

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-xl px-6 lg:px-8">
            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
