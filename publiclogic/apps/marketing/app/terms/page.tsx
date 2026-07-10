import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for the PublicLogic website.",
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PageHeader eyebrow="Legal" title="Terms of Use" />

        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <p className="mb-6 text-muted-foreground">
              <strong className="text-foreground">Effective date:</strong> January 1, 2026
            </p>

            <h2 className="mt-8 mb-4 text-xl font-bold text-foreground">Acceptance of terms</h2>
            <p className="mb-6 text-muted-foreground">
              By accessing this website, you agree to these Terms of Use. If you do not agree, please do
              not use the site.
            </p>

            <h2 className="mt-8 mb-4 text-xl font-bold text-foreground">Purpose of this site</h2>
            <p className="mb-6 text-muted-foreground">
              This website describes PublicLogic LLC&rsquo;s products and pilots and provides a way to get
              in touch with us. It is informational and does not itself provide access to any PublicLogic
              product or system.
            </p>

            <h2 className="mt-8 mb-4 text-xl font-bold text-foreground">Intellectual property</h2>
            <p className="mb-6 text-muted-foreground">
              The content on this site — including text, graphics, logos, and the PublicLogic and
              PuddleJumper names and marks — is owned by PublicLogic LLC or its licensors and may not be
              copied or reused without permission.
            </p>

            <h2 className="mt-8 mb-4 text-xl font-bold text-foreground">No warranty</h2>
            <p className="mb-6 text-muted-foreground">
              This site is provided &ldquo;as is&rdquo; without warranties of any kind. Descriptions of
              pilots, statistics, and benchmarks on this site are representative and illustrative, not
              guarantees of results for any particular deployment.
            </p>

            <h2 className="mt-8 mb-4 text-xl font-bold text-foreground">Limitation of liability</h2>
            <p className="mb-6 text-muted-foreground">
              To the fullest extent permitted by law, PublicLogic LLC is not liable for any damages arising
              from your use of, or inability to use, this website.
            </p>

            <h2 className="mt-8 mb-4 text-xl font-bold text-foreground">Changes to these terms</h2>
            <p className="mb-6 text-muted-foreground">
              We may update these Terms of Use from time to time. Changes will be posted on this page.
            </p>

            <h2 className="mt-8 mb-4 text-xl font-bold text-foreground">Contact us</h2>
            <p className="mb-6 text-muted-foreground">
              Questions about these terms can be sent to{" "}
              <a href="mailto:hello@publiclogic.org" className="underline">
                hello@publiclogic.org
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
