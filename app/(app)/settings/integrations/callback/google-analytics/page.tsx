'use client'

import { CheckCircle2, Loader2, XCircle } from '@/lib/icons'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'

import { CallbackPanel } from '@/features/integrations/components/CallbackPanel'
import { GAPropertyPicker } from '@/features/integrations/components/GAPropertyPicker'
import { sendGACallback } from '@/lib/api/integrations'
import { emailFromState } from '@/lib/oauth-state'
import { routes } from '@/lib/routes'

/**
 * Google's OAuth redirect target for Google Analytics.
 *
 * This route is what GOOGLE_ANALYTICS_REDIRECT_URI has always pointed at (both
 * `http://localhost:3000/...` and `https://signalor.ai/...`), but it did not
 * exist — so every consent landed on a 404 and no code was ever exchanged.
 *
 * It exchanges the code, then immediately asks which GA4 property to read,
 * because tokens alone are not a working connection: without a property every
 * sync fails with "No GA4 property selected".
 */

type State = 'connecting' | 'choose' | 'done' | 'error'

function DashboardLink({ label }: { label: string }): JSX.Element {
  return (
    <Link
      href={routes.dashboard}
      className="auth-cta-btn mt-4 inline-flex h-9 items-center rounded-md px-4 text-[13px] font-medium text-white"
    >
      {label}
    </Link>
  )
}

function GoogleAnalyticsCallback(): JSX.Element {
  const params = useSearchParams()
  const code = params.get('code')
  const oauthState = params.get('state')
  const oauthError = params.get('error')

  // Key the property picker off the SAME identity the OAuth flow used (carried in
  // the signed state), not the dashboard session. They can differ — you can be
  // logged into the dashboard as one account and connect GA under another — and a
  // mismatch would point the picker at the wrong org, which has no integration.
  const email = emailFromState(oauthState)

  const [state, setState] = useState<State>('connecting')
  // React 18 StrictMode double-invokes effects in dev; an OAuth code is
  // single-use, so a second exchange would fail and flip a good connection to
  // an error screen.
  const exchanged = useRef(false)

  useEffect(() => {
    if (oauthError) {
      setState('error')
      return
    }
    // The backend identifies the org from the signed state, so the exchange
    // doesn't need the session email — only the property-picker step does.
    if (!code || !oauthState || exchanged.current) return
    exchanged.current = true

    let active = true
    sendGACallback(code, oauthState)
      .then(() => active && setState('choose'))
      .catch(() => active && setState('error'))
    return () => {
      active = false
    }
  }, [code, oauthState, oauthError])

  if (oauthError || !code) {
    return (
      <CallbackPanel
        title="Couldn’t connect Google Analytics"
        icon={<XCircle className="h-6 w-6 text-[#E5484D]" />}
      >
        <p className="text-[13px] text-neutral-500">
          {oauthError
            ? 'Google reported that access was denied or cancelled.'
            : 'This page is the Google sign-in redirect — start from Integrations.'}
        </p>
        <DashboardLink label="Go to dashboard" />
      </CallbackPanel>
    )
  }

  if (state === 'error') {
    return (
      <CallbackPanel
        title="Couldn’t connect Google Analytics"
        icon={<XCircle className="h-6 w-6 text-[#E5484D]" />}
      >
        <p className="text-[13px] text-neutral-500">
          The sign-in didn’t complete. Try connecting again from Integrations.
        </p>
        <DashboardLink label="Go to dashboard" />
      </CallbackPanel>
    )
  }

  if (state === 'choose' && email) {
    return (
      <CallbackPanel title="Choose a GA4 property">
        <GAPropertyPicker email={email} onDone={() => setState('done')} />
      </CallbackPanel>
    )
  }

  if (state === 'done') {
    return (
      <CallbackPanel
        title="Google Analytics connected"
        icon={<CheckCircle2 className="h-6 w-6 text-[#047857]" />}
      >
        <p className="text-[13px] text-neutral-500">
          We’re pulling your first 30 days of data now. It’ll appear on your dashboard shortly.
        </p>
        <DashboardLink label="Go to dashboard" />
      </CallbackPanel>
    )
  }

  return (
    <CallbackPanel title="Connecting Google Analytics…">
      <Loader2 className="h-5 w-5 animate-spin text-[var(--cat-ink-3)]" />
    </CallbackPanel>
  )
}

export default function GoogleAnalyticsCallbackPage(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsCallback />
    </Suspense>
  )
}
