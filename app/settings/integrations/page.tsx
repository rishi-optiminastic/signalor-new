'use client'

import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

import { sendGACallback } from '@/lib/api/integrations'
import { useSession } from '@/lib/auth-client'
import { routes } from '@/lib/routes'

type State = 'idle' | 'connecting' | 'done' | 'error'

interface PanelProps {
  title: string
  icon?: JSX.Element
  children: React.ReactNode
}

function Panel({ title, icon, children }: PanelProps): JSX.Element {
  return (
    <main className="grid min-h-svh place-items-center bg-white px-6 font-sans">
      <div className="flex w-full max-w-sm flex-col items-center gap-3 text-center">
        {icon}
        <h1 className="text-foreground text-lg font-semibold tracking-tight">{title}</h1>
        {children}
      </div>
    </main>
  )
}

function CallbackView({ state }: { state: State }): JSX.Element {
  if (state === 'connecting') {
    return (
      <Panel title="Connecting Google Analytics…">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--cat-ink-3)]" />
      </Panel>
    )
  }
  if (state === 'error') {
    return (
      <Panel
        title="Couldn’t connect Google Analytics"
        icon={<XCircle className="h-6 w-6 text-[#E5484D]" />}
      >
        <p className="text-[13px] text-neutral-500">Try again from onboarding or the dashboard.</p>
      </Panel>
    )
  }
  return state === 'done' ? <DonePanel /> : <IdlePanel />
}

function DonePanel(): JSX.Element {
  return (
    <Panel
      title="Google Analytics connected"
      icon={<CheckCircle2 className="h-6 w-6 text-[#047857]" />}
    >
      <p className="text-[13px] text-neutral-500">
        You can close this tab and return to onboarding — it’ll pick up the connection.
      </p>
    </Panel>
  )
}

function IdlePanel(): JSX.Element {
  return (
    <Panel title="Integrations">
      <p className="text-[13px] text-neutral-500">
        Connect Google Analytics from onboarding or the dashboard to see AI referral traffic.
      </p>
      <Link
        href={routes.dashboard}
        className="auth-cta-btn mt-4 inline-flex h-9 items-center rounded-md px-4 text-[13px] font-medium text-white"
      >
        Go to dashboard
      </Link>
    </Panel>
  )
}

function IntegrationsCallback(): JSX.Element {
  const params = useSearchParams()
  const { data: session } = useSession()
  const email = session?.user?.email
  const code = params.get('code')
  const [state, setState] = useState<State>(code ? 'connecting' : 'idle')

  useEffect(() => {
    if (!code || !email) return
    let active = true
    sendGACallback(email, code)
      .then(() => active && setState('done'))
      .catch(() => active && setState('error'))
    return () => {
      active = false
    }
  }, [code, email])

  return <CallbackView state={state} />
}

export default function IntegrationsPage(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <IntegrationsCallback />
    </Suspense>
  )
}
