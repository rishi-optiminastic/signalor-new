'use client'

import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, ExternalLink } from 'lucide-react'
import { useState } from 'react'

import { useOnboardingWizardStore, type Platform } from '@/stores/useOnboardingWizardStore'

const INSTALL_FEATURES = [
  'Auto-fix SEO & GEO issues directly on your site',
  'Inject JSON-LD schema markup automatically',
  'Add AI crawler meta tags for better visibility',
  'Generate and serve llms.txt for AI discovery',
]

const PRIMARY_LABEL: Record<Platform, string> = {
  shopify: 'Install on Shopify',
  wordpress: 'Get the WordPress plugin',
  webflow: 'No install needed',
  framer: 'Get the Framer plugin',
  nextjs: 'Copy the SDK snippet',
}

const NEXTJS_SNIPPET = `npm i @signalor/sdk

// app/layout.tsx
import { Signalor } from '@signalor/sdk'

<Signalor apiKey={process.env.SIGNALOR_API_KEY} />`

/** Step 4: platform-aware install / connect. */
export function InstallStep(): JSX.Element {
  const { platform, appInstalled, setAppInstalled, setStep } = useOnboardingWizardStore()
  const [copied, setCopied] = useState(false)

  const handlePrimary = async (): Promise<void> => {
    if (platform === 'nextjs') {
      try {
        await navigator.clipboard.writeText(NEXTJS_SNIPPET)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      } catch {
        // clipboard may be blocked; ignore
      }
    }
    // Stub: mark as connected. TODO(wire): real OAuth / plugin verification.
    setAppInstalled(true)
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-foreground text-sm font-semibold">Connect your site</p>
        <p className="mt-1 text-xs leading-relaxed font-light text-neutral-400">
          Install Signalor to enable auto-fixes, schema injection & AI meta tags.
        </p>
      </div>

      <div className="shadow-input rounded-xl border border-black/8 bg-white p-5">
        <div className="mb-5 space-y-3">
          {INSTALL_FEATURES.map(item => (
            <div key={item} className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#047857]" />
              <span className="text-foreground text-xs">{item}</span>
            </div>
          ))}
        </div>

        {platform === 'nextjs' && (
          <pre className="text-foreground mb-4 overflow-x-auto rounded-md border border-neutral-200 bg-neutral-50 p-3 text-[11px] leading-relaxed">
            {NEXTJS_SNIPPET}
          </pre>
        )}

        <button
          type="button"
          onClick={handlePrimary}
          className="auth-cta-btn flex h-10 w-full items-center justify-center gap-2 rounded-md text-[13px] font-medium text-white"
        >
          {appInstalled ? (
            <>
              <Check className="h-4 w-4" />
              Connected
            </>
          ) : (
            <>
              {platform === 'nextjs' ? (
                copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              {PRIMARY_LABEL[platform]}
            </>
          )}
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setStep('url')}
          className="shadow-input text-foreground flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border border-neutral-200 bg-white text-[13px] font-medium transition hover:bg-neutral-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep('prompts')}
          className="auth-cta-btn flex h-10 flex-[2] items-center justify-center gap-1.5 rounded-md text-[15px] font-medium text-white"
        >
          {appInstalled ? 'Continue' : 'Skip for now'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
