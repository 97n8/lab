import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for the PublicLogic website.",
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PageHeader eyebrow="Legal" title="Privacy Policy" />

        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <p className="mb-6 text-muted-foreground">
              <strong className="text-foreground">Effective date:</strong> January 1, 2026
            </p>

            <h2 className="mt-8 mb-4 text-xl font-bold text-foreground">Information we collect</h2>
            <p className="mb-4 text-muted-foreground">
              PublicLogic LLC (&ldquo;PublicLogic,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) collects
              information you provide directly to us, including:
            </p>
            <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Name, email address, and organization when you contact us through this site.</li>
              <li>Any other information you choose to include in a message to us.</li>
              <li>Basic technical information (such as browser and device type) collected automatically.</li>
            </ul>

            <h2 className="mt-8 mb-4 text-xl font-bold text-foreground">How we use your information</h2>
            <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>To respond to inquiries and requests you send us.</li>
              <li>To communicate about PublicLogic products, pilots, and updates you&rsquo;ve asked about.</li>
              <li>To improve this website and understand how it&rsquo;s used.</li>
            </ul>

            <h2 className="mt-8 mb-4 text-xl font-bold text-foreground">Information sharing</h2>
            <p className="mb-6 text-muted-foreground">
              We do not sell or rent your personal information. We may share information with service
              providers who help us operate this website, under obligations to keep it confidential.
            </p>

            <h2 className="mt-8 mb-4 text-xl font-bold text-foreground">Data security</h2>
            <p className="mb-6 text-muted-foreground">
              We take reasonable measures to protect information submitted through this site. No method of
              transmission over the internet is completely secure.
            </p>

            <h2 className="mt-8 mb-4 text-xl font-bold text-foreground">Your rights</h2>
            <p className="mb-6 text-muted-foreground">
              You may request access to, correction of, or deletion of your personal information at any
              time by contacting us at the address below.
            </p>

            <h2 className="mt-8 mb-4 text-xl font-bold text-foreground">Contact us</h2>
            <p className="mb-6 text-muted-foreground">
              Questions about this policy can be sent to{" "}
              <a href="mailto:hello@publiclogic.org" className="underline">
                hello@publiclogic.org
              </a>
              .
            </p>

            <h2 className="mt-8 mb-4 text-xl font-bold text-foreground">Changes to this policy</h2>
            <p className="mb-6 text-muted-foreground">
              We may update this Privacy Policy from time to time. Changes will be posted on this page.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
