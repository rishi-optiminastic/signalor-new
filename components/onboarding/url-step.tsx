'use client'

import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { useSession } from '@/lib/auth-client'
import { createOrganization } from '@/services/onboarding.service'
import { useOnboardingWizardStore } from '@/stores/useOnboardingWizardStore'

const INPUT_CLASS =
  'shadow-input h-[38px] w-full rounded-md border border-neutral-200 bg-white px-3 text-[13px] text-foreground outline-none transition placeholder:text-muted-foreground/55 focus:border-primary focus:ring-2 focus:ring-ring/50 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-60'

const PLATFORM_COPY: Record<string, { title: string; sub: string; placeholder: string }> = {
  shopify: {
    title: 'Connect your Shopify store',
    sub: 'Enter your store domain to start GEO analysis and enable auto-fixes.',
    placeholder: 'your-store.myshopify.com',
  },
  wordpress: {
    title: 'Enter your WordPress URL',
    sub: "We'll connect your site via the Signalor plugin after verifying your URL.",
    placeholder: 'yoursite.com',
  },
  webflow: {
    title: 'Enter your Webflow URL',
    sub: "We'll run GEO analysis directly — no plugin required for Webflow.",
    placeholder: 'yoursite.com',
  },
  framer: {
    title: 'Enter your Framer site URL',
    sub: "We'll verify your site before connecting via the Framer plugin.",
    placeholder: 'yoursite.com',
  },
  nextjs: {
    title: 'Enter your Next.js site URL',
    sub: "We'll verify your site before generating your SDK API key.",
    placeholder: 'yoursite.com',
  },
}

/** Step 3: capture the site URL and create the organization. */
export function UrlStep(): JSX.Element {
  const { platform, siteUrl, setSiteUrl, setOrgId, setStep, companyName } =
    useOnboardingWizardStore()
  const { data: session } = useSession()
  const [value, setValue] = useState(siteUrl)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const copy = PLATFORM_COPY[platform]

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
      <div className="text-center">
        <p className="text-foreground text-sm font-semibold">{copy.title}</p>
        <p className="mt-1 text-xs leading-relaxed font-light text-neutral-400">{copy.sub}</p>
      </div>

      <input
        autoFocus
        placeholder={copy.placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={loading}
        className={INPUT_CLASS}
      />

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
