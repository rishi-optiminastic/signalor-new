'use client'

import { CheckCircle2, Loader2, XCircle } from '@/lib/icons'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

import { CallbackPanel } from '@/features/integrations/components/CallbackPanel'
import { sendGACallback } from '@/lib/api/integrations'
import { routes } from '@/lib/routes'

type State = 'idle' | 'connecting' | 'done' | 'error'

function CallbackView({ state }: { state: State }): JSX.Element {
  if (state === 'connecting') {
    return (
      <CallbackPanel title="Connecting Google Analytics…">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--cat-ink-3)]" />
      </CallbackPanel>
    )
  }
  if (state === 'error') {
    return (
      <CallbackPanel
        title="Couldn’t connect Google Analytics"
        icon={<XCircle className="h-6 w-6 text-[#E5484D]" />}
      >
        <p className="text-[13px] text-neutral-500">Try again from onboarding or the dashboard.</p>
      </CallbackPanel>
    )
  }
  return state === 'done' ? <DonePanel /> : <IdlePanel />
}

function DonePanel(): JSX.Element {
  return (
    <CallbackPanel
      title="Google Analytics connected"
      icon={<CheckCircle2 className="h-6 w-6 text-[#047857]" />}
    >
      <p className="text-[13px] text-neutral-500">
        You can close this tab and return to onboarding — it’ll pick up the connection.
      </p>
    </CallbackPanel>
  )
}

function IdlePanel(): JSX.Element {
  return (
    <CallbackPanel title="Integrations">
      <p className="text-[13px] text-neutral-500">
        Connect Google Analytics from onboarding or the dashboard to see AI referral traffic.
      </p>
      <Link
        href={routes.dashboard}
        className="auth-cta-btn mt-4 inline-flex h-9 items-center rounded-md px-4 text-[13px] font-medium text-white"
      >
        Go to dashboard
      </Link>
    </CallbackPanel>
  )
}

function IntegrationsCallback(): JSX.Element {
  const params = useSearchParams()
  const code = params.get('code')
  const oauthState = params.get('state')
  const [state, setState] = useState<State>(code ? 'connecting' : 'idle')

  useEffect(() => {
    if (!code || !oauthState) return
    let active = true
    sendGACallback(code, oauthState)
      .then(() => active && setState('done'))
      .catch(() => active && setState('error'))
    return () => {
      active = false
    }
  }, [code, oauthState])

  return <CallbackView state={state} />
}

export default function IntegrationsPage(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <IntegrationsCallback />
    </Suspense>
  )
}
