'use client'

import { ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react'
import Image from 'next/image'

import { useOnboardingWizardStore } from '@/stores/useOnboardingWizardStore'

const ANALYTICS_FEATURES = [
  'Track AI referral traffic (ChatGPT, Perplexity, etc.)',
  'Measure organic vs AI-driven sessions',
  'Monitor conversion impact from AI visibility',
]

/** Step 6: connect Google Analytics (optional). */
export function AnalyticsStep(): JSX.Element {
  const { setAnalyticsConnected, setStep } = useOnboardingWizardStore()

  const connect = (): void => {
    // Stub: mark connected. TODO(wire): GA4 OAuth connect.
    setAnalyticsConnected(true)
    setStep('launch')
  }

  return (
    <div className="space-y-3">
      <div className="shadow-input rounded-xl border border-black/8 bg-white p-5">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
            <Image
              src="/logos/google-analytics.svg"
              alt="Google Analytics"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
          </div>
          <div>
            <p className="text-foreground mb-1 text-[13px] font-medium">Google Analytics</p>
            <p className="text-xs leading-relaxed font-light text-neutral-400">
              See how much traffic AI engines send to your site. Track referrals from ChatGPT,
              Gemini, Perplexity, and more.
            </p>
          </div>
        </div>

        <div className="mb-5 space-y-3">
          {ANALYTICS_FEATURES.map(item => (
            <div key={item} className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#047857]" />
              <span className="text-foreground text-xs">{item}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={connect}
          className="auth-cta-btn flex h-10 w-full items-center justify-center gap-2 rounded-md text-[13px] font-medium text-white"
        >
          <ExternalLink className="h-4 w-4" />
          Connect Google Analytics
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setStep('prompts')}
          className="shadow-input text-foreground flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border border-neutral-200 bg-white text-[13px] font-medium transition hover:bg-neutral-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep('launch')}
          className="shadow-input hover:text-foreground flex h-10 flex-1 items-center justify-center rounded-md border border-neutral-200 bg-white text-[13px] font-medium text-neutral-500 transition"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
