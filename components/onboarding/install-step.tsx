'use client'

import { GithubConnector } from '@/components/onboarding/github-connector'
import { useSession } from '@/lib/auth-client'
import { ArrowLeft, ArrowRight, ExternalLink, Globe } from '@/lib/icons'
import { useOnboardingWizardStore, type Platform } from '@/stores/useOnboardingWizardStore'

const CARD = 'shadow-input rounded-xl border border-black/8 bg-white p-5'

const PLUGIN_LINK: Partial<Record<Platform, { label: string; href: string }>> = {
  shopify: { label: 'Connect Shopify', href: '/integration/shopify' },
  wordpress: { label: 'Get the WordPress plugin', href: '/integration/wordpress' },
  framer: { label: 'Get the Framer plugin', href: '/integration' },
}

/** Webflow / others → no install, analysed by URL. */
function NoInstallConnector(): JSX.Element {
  return (
    <div className={`${CARD} flex items-start gap-3`}>
      <Globe className="text-foreground mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="text-foreground text-[13px] font-semibold">No install needed</p>
        <p className="mt-0.5 text-xs text-neutral-500">
          We analyse your site by URL — just continue. Auto-fix connectors can be added later from
          Integrations.
        </p>
      </div>
    </div>
  )
}

/** Shopify / WordPress / Framer → open the platform connector in a new tab. */
function LinkConnector({ platform }: { platform: Platform }): JSX.Element {
  const link = PLUGIN_LINK[platform]
  if (!link) return <NoInstallConnector />
  return (
    <div className={`${CARD} space-y-3`}>
      <p className="text-foreground text-[13px] font-semibold">Connect your site</p>
      <p className="text-xs leading-relaxed text-neutral-500">
        Install the SignalorAI connector to enable auto-fixes, schema injection & AI meta tags.
      </p>
      <a
        href={link.href}
        target="_blank"
        rel="noreferrer"
        className="auth-cta-btn flex h-10 w-full items-center justify-center gap-2 rounded-md text-[13px] font-medium text-white"
      >
        <ExternalLink className="h-4 w-4" />
        {link.label}
      </a>
    </div>
  )
}

/** Step 4: platform-aware connect (GitHub App for Next.js, plugins for others). */
export function InstallStep(): JSX.Element {
  const { data: session } = useSession()
  const email = session?.user?.email ?? ''
  const { platform, appInstalled, setStep } = useOnboardingWizardStore()

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-foreground text-sm font-semibold">Connect your site</p>
        <p className="mt-1 text-xs leading-relaxed font-light text-neutral-400">
          Let SignalorAI apply fixes automatically — or skip and analyse by URL.
        </p>
      </div>

      {platform === 'nextjs' ? (
        <GithubConnector email={email} />
      ) : (
        <LinkConnector platform={platform} />
      )}

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
