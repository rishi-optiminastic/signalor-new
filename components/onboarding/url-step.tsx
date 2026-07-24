'use client'

import { useState, type FormEvent } from 'react'

import { ONBOARDING_INPUT_CLASS } from '@/components/onboarding/input-class'
import { SiteFavicon } from '@/components/onboarding/site-favicon'
import { useSession } from '@/lib/auth-client'
import { ArrowLeft, ArrowRight, Loader2 } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { createOrganization } from '@/services/onboarding.service'
import { useOnboardingWizardStore } from '@/stores/useOnboardingWizardStore'

// Per-platform input placeholder (title/subtitle come from the wizard header).
const PLATFORM_PLACEHOLDER: Record<string, string> = {
  shopify: 'your-store.myshopify.com',
  wordpress: 'yoursite.com',
  webflow: 'yoursite.com',
  framer: 'yoursite.com',
  nextjs: 'yoursite.com',
}
const DEFAULT_PLACEHOLDER = 'yoursite.com'

/** Step 3: capture the site URL and create the organization. */
export function UrlStep(): JSX.Element {
  const { platform, siteUrl, setSiteUrl, setOrgId, setStep, companyName } =
    useOnboardingWizardStore()
  const { data: session } = useSession()
  const [value, setValue] = useState(siteUrl)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const placeholder = PLATFORM_PLACEHOLDER[platform] ?? DEFAULT_PLACEHOLDER

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    if (!value.trim()) return
    setLoading(true)
    setError('')
    try {
      const result = await createOrganization({
        name: companyName,
        url: value.trim(),
        email: session?.user?.email ?? '',
      })
      if (!result.ok) {
        setError(result.error ?? 'Failed. Please try again.')
        return
      }
      setOrgId(result.orgId ?? null)
      setSiteUrl(value.trim())
      setStep('install')
    } catch {
      setError('Failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* The wizard header already shows the step title/subtitle — no inner heading. */}
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
          <SiteFavicon value={value} />
        </span>
        <input
          autoFocus
          placeholder={placeholder}
          value={value}
          onChange={e => setValue(e.target.value)}
          disabled={loading}
          className={cn(ONBOARDING_INPUT_CLASS, 'pl-9')}
        />
      </div>

      {error && (
        <p className="border-destructive/20 bg-destructive/5 text-destructive rounded-md border px-3 py-2 text-xs font-medium">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setStep('platform')}
          className="shadow-input text-foreground flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border border-neutral-200 bg-white text-[13px] font-medium transition hover:bg-neutral-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="auth-cta-btn flex h-10 flex-[2] items-center justify-center gap-1.5 rounded-md text-[15px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Setting up…
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
