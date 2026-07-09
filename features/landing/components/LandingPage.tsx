import { AnnouncementBar } from '@/features/landing/components/AnnouncementBar'
import { Faq } from '@/features/landing/components/Faq'
import { FeaturesGrid } from '@/features/landing/components/FeaturesGrid'
import { FloatingChat } from '@/features/landing/components/FloatingChat'
import { Footer } from '@/features/landing/components/Footer'
import { GridBackdrop } from '@/features/landing/components/GridBackdrop'
import { Hero } from '@/features/landing/components/Hero'
import { HowItWorks } from '@/features/landing/components/HowItWorks'
import { IntegrationsStrip } from '@/features/landing/components/IntegrationsStrip'
import { LandingNav } from '@/features/landing/components/LandingNav'
import { Newsletter } from '@/features/landing/components/Newsletter'
import { PricingTeaser } from '@/features/landing/components/PricingTeaser'
import { Testimonials } from '@/features/landing/components/Testimonials'
import { WhySignalor } from '@/features/landing/components/WhySignalor'

export function LandingPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-[#fbfbfa] font-sans">
      <AnnouncementBar />
      <div className="relative overflow-hidden">
        <GridBackdrop />
        <div className="relative z-10">
          <LandingNav />
          <Hero />
        </div>
      </div>
      <HowItWorks />
      <FeaturesGrid />
      <Testimonials />
      <WhySignalor />
      <IntegrationsStrip />
      <PricingTeaser />
      <Faq />
      <Newsletter />
      <Footer />
      <FloatingChat />
    </div>
  )
}
