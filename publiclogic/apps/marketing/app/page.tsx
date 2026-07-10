import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeroSection } from "@/components/hero-section"
import { MoatSection } from "@/components/moat-section"
import { ProblemSection } from "@/components/problem-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { PilotsSection } from "@/components/pilots-section"
import { IntegrationsSection } from "@/components/integrations-section"
import { WhySection } from "@/components/why-section"
import { CTASection } from "@/components/cta-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <MoatSection />
        <ProblemSection />
        <HowItWorksSection />
        <PilotsSection />
        <IntegrationsSection />
        <WhySection />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  )
}
