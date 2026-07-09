'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Github,
  Globe,
  Loader2,
} from 'lucide-react'
import { useEffect } from 'react'

import { getOrgGithubInstallUrl, getOrgGithubStatus } from '@/lib/api/github'
import { useSession } from '@/lib/auth-client'
import { useOnboardingWizardStore, type Platform } from '@/stores/useOnboardingWizardStore'

const CARD = 'shadow-input rounded-xl border border-black/8 bg-white p-5'

/** Next.js → connect the GitHub App so Signalor can open fix PRs on the repo. */
function GithubConnector({ email }: { email: string }): JSX.Element {
  const setAppInstalled = useOnboardingWizardStore(s => s.setAppInstalled)

  const status = useQuery({
    queryKey: ['onboarding-github', email],
    queryFn: () => getOrgGithubStatus(email),
    enabled: Boolean(email),
    refetchInterval: q => (q.state.data?.connected ? false : 4000),
  })

  const connected = status.data?.connected ?? false

  useEffect(() => {
    if (connected) setAppInstalled(true)
  }, [connected, setAppInstalled])

  const connect = useMutation({
    mutationFn: () => getOrgGithubInstallUrl(email),
    onSuccess: url => {
      window.location.href = url
    },
  })

  if (status.isLoading) {
    return (
      <div className={`${CARD} flex items-center justify-center gap-2 py-6`}>
        <Loader2 className="h-4 w-4 animate-spin text-[var(--cat-ink-3)]" />
        <span className="text-xs text-neutral-500">Checking GitHub connection…</span>
      </div>
    )
  }

  if (connected) {
    return (
      <div className={`${CARD} flex items-start gap-3`}>
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#047857]" />
        <div>
          <p className="text-foreground text-[13px] font-semibold">GitHub repo connected</p>
          <p className="mt-0.5 text-xs text-neutral-500">
            {status.data?.repo_full_name || 'Signalor can now open fix PRs on your repo.'}
          </p>
        </div>
      </div>
    )
  }

  const notConfigured = Boolean(status.data && !status.data.configured)

  return (
    <div className={`${CARD} space-y-3`}>
      <div className="flex items-start gap-3">
        <Github className="text-foreground mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="text-foreground text-[13px] font-semibold">Connect your GitHub repo</p>
          <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">
            Install the Signalor GitHub App so it can open fix PRs (schema, llms.txt, robots,
            canonical) on your Next.js repo.
          </p>
        </div>
      </div>
      {notConfigured ? (
        <p className="rounded-md bg-neutral-50 px-3 py-2 text-[11px] text-neutral-500">
          GitHub connect isn’t enabled on this server yet — you can skip for now.
        </p>
      ) : (
        <button
          type="button"
          onClick={() => connect.mutate()}
          disabled={connect.isPending}
          className="auth-cta-btn flex h-10 w-full items-center justify-center gap-2 rounded-md text-[13px] font-medium text-white disabled:opacity-60"
        >
          {connect.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Github className="h-4 w-4" />
          )}
          Connect GitHub
        </button>
      )}
      {connect.isError && (
        <p className="text-xs font-medium text-[#E5484D]">
          Couldn’t start the GitHub connection. You can skip and connect later.
        </p>
      )}
    </div>
  )
}

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
        Install the Signalor connector to enable auto-fixes, schema injection & AI meta tags.
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
          Let Signalor apply fixes automatically — or skip and analyse by URL.
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
