'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { ArrowLeft, CheckCircle2, ExternalLink, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'

import { getGAAuthUrl, getIntegrationStatus } from '@/lib/api/integrations'
import { useSession } from '@/lib/auth-client'
import { useOnboardingWizardStore } from '@/stores/useOnboardingWizardStore'

const ANALYTICS_FEATURES = [
  'Track AI referral traffic (ChatGPT, Perplexity, etc.)',
  'Measure organic vs AI-driven sessions',
  'Monitor conversion impact from AI visibility',
]

const GA_PROVIDERS = ['ga4', 'google_analytics', 'google-analytics']

/** Step 6: connect Google Analytics (real GA4 OAuth, optional). */
export function AnalyticsStep(): JSX.Element {
  const { data: session } = useSession()
  const email = session?.user?.email ?? ''
  const { analyticsConnected, setAnalyticsConnected, setStep } = useOnboardingWizardStore()

  // Poll the connection so we reflect a GA connect completed in the other tab.
  const status = useQuery({
    queryKey: ['onboarding-ga', email],
    queryFn: () => getIntegrationStatus(email),
    enabled: Boolean(email),
    refetchInterval: 4000,
  })

  const connected =
    analyticsConnected ||
    (status.data ?? []).some(i => i.is_active && GA_PROVIDERS.includes(i.provider.toLowerCase()))

  useEffect(() => {
    if (connected) setAnalyticsConnected(true)
  }, [connected, setAnalyticsConnected])

  const connect = useMutation({
    mutationFn: () => getGAAuthUrl(email),
    onSuccess: url => {
      // New tab keeps the onboarding flow intact; polling reflects the connect.
      window.open(url, '_blank', 'noopener')
    },
  })

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

        {connected ? (
          <div className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[rgba(4,120,87,0.08)] text-[13px] font-medium text-[#047857]">
            <CheckCircle2 className="h-4 w-4" />
            Google Analytics connected
          </div>
        ) : (
          <button
            type="button"
            onClick={() => connect.mutate()}
            disabled={connect.isPending || !email}
            className="auth-cta-btn flex h-10 w-full items-center justify-center gap-2 rounded-md text-[13px] font-medium text-white disabled:opacity-60"
          >
            {connect.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ExternalLink className="h-4 w-4" />
            )}
            Connect Google Analytics
          </button>
        )}
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
          {connected ? 'Continue' : 'Skip for now'}
        </button>
      </div>
    </div>
  )
}
