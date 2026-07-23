'use client'

import { useEffect, useState } from 'react'

/**
 * The GitHub App install/callback lands here. It's opened in a popup by the
 * connect flow (onboarding, Integrations, the Fixes page), so it closes itself
 * the moment it loads — the opener window is already polling connection status
 * and reacts on its own. If it isn't a popup (a popup-blocked full redirect),
 * it forwards into the app instead.
 */
export default function GithubCallbackPage(): JSX.Element {
  const [status, setStatus] = useState<'connected' | 'error'>('connected')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setStatus(params.get('status') === 'error' ? 'error' : 'connected')

    // A popup we opened can close itself; a normal tab can't (browsers no-op it),
    // so after a beat we forward a non-popup tab into the app.
    window.close()
    const timer = window.setTimeout(() => {
      if (window.closed) return
      window.location.replace(params.get('next') || '/dashboard')
    }, 400)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 text-center">
      <div>
        <p className="text-[15px] font-semibold text-neutral-900">
          {status === 'error' ? 'GitHub connection failed' : 'GitHub connected'}
        </p>
        <p className="mt-1 text-[13px] text-neutral-500">
          {status === 'error'
            ? 'Something went wrong. You can close this window and try again.'
            : 'You can close this window.'}
        </p>
      </div>
    </main>
  )
}
