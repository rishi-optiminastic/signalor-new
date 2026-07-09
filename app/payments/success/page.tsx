'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { CheckCircle2, Loader2 } from '@fe/components/icons'
import { startAnalysis } from '@fe/lib/api/analyzer'
import { getSubscriptionStatus } from '@fe/lib/api/payments'
import { useSession } from '@fe/lib/auth-client'
import { routes } from '@fe/lib/config'
import {
  ONBOARDING_DRAFT_KEY,
  POST_CHECKOUT_REDIRECT_KEY,
  clearPendingAnalysisAfterPayment,
  readPendingAnalysisAfterPayment,
  safeInternalReturnPath,
} from '@fe/lib/internal-nav'

/** Read and remove post-checkout redirect (same as before, exported for reuse). */
function consumePostCheckoutPath(): string {
  try {
    const raw = sessionStorage.getItem(POST_CHECKOUT_REDIRECT_KEY)
    const safe = safeInternalReturnPath(raw)
    sessionStorage.removeItem(POST_CHECKOUT_REDIRECT_KEY)
    return safe || routes.dashboard
  } catch {
    return routes.dashboard
  }
}

export default function PaymentSuccessPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [message, setMessage] = useState('Confirming your payment...')
  const [showSuccessIcon, setShowSuccessIcon] = useState(false)
  const startedRef = useRef(false)

  // Polling is keyed on email (a stable string), not the whole session
  // object. better-auth's useSession returns a fresh `session` reference on
  // every render; depending on `session` directly would tear down the
  // setInterval and the startedRef guard would silently prevent restart —
  // so polling would die after the first re-render and the user would
  // never see is_active flip to true.
  const userEmail = session?.user?.email
  useEffect(() => {
    if (!userEmail) return
    if (startedRef.current) return
    startedRef.current = true

    let cancelled = false
    let attempts = 0

    let busy = false
    const poll = setInterval(async () => {
      if (cancelled || busy) return
      busy = true
      attempts += 1

      try {
        const status = await getSubscriptionStatus(userEmail)
        if (!status.is_active) {
          if (attempts > 20) {
            clearInterval(poll)
            if (!cancelled) {
              setShowSuccessIcon(false)
              setMessage('Could not confirm payment yet. You can continue from the app.')
              router.replace(consumePostCheckoutPath())
            }
          }
          return
        }

        clearInterval(poll)

        const pending = readPendingAnalysisAfterPayment()
        const emailMatch = pending && pending.email.toLowerCase() === userEmail.toLowerCase()

        if (pending && !emailMatch) {
          clearPendingAnalysisAfterPayment()
        }

        if (emailMatch && pending) {
          setMessage('Starting your GEO analysis...')
          setShowSuccessIcon(false)
          try {
            const run = await startAnalysis({
              url: pending.url,
              run_type: pending.run_type,
              email: pending.email,
              brand_name: pending.brand_name,
              org_id: pending.org_id,
              ...(pending.v === 2
                ? {
                    verify_org_workspace: true,
                    prompts: pending.prompts,
                  }
                : {}),
            })
            if (cancelled) return
            clearPendingAnalysisAfterPayment()
            try {
              sessionStorage.removeItem(POST_CHECKOUT_REDIRECT_KEY)
              sessionStorage.removeItem(ONBOARDING_DRAFT_KEY)
            } catch {
              /* ignore */
            }
            router.replace(routes.dashboardProject(run.slug))
          } catch {
            if (cancelled) return
            setMessage('Payment received. Continue setup to run analysis.')
            router.replace(consumePostCheckoutPath())
          }
          return
        }

        setShowSuccessIcon(true)
        setMessage('Redirecting...')
        const next = consumePostCheckoutPath()
        setTimeout(() => {
          if (!cancelled) router.replace(next)
        }, 1500)
      } catch {
        if (attempts > 20) {
          clearInterval(poll)
          if (!cancelled) {
            setShowSuccessIcon(false)
            router.replace(consumePostCheckoutPath())
          }
        }
      } finally {
        busy = false
      }
    }, 2000)

    return () => {
      cancelled = true
      clearInterval(poll)
    }
  }, [userEmail, router])

  if (isPending) {
    return (
      <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground mt-4 text-sm">Loading your session…</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="bg-background mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
        <p className="text-muted-foreground text-sm">
          If you completed payment, sign in with the <strong>same email</strong> you used at
          checkout so we can confirm your subscription and continue.
        </p>
        <Link
          href={routes.signIn}
          className="bg-primary text-primary-foreground mt-6 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center">
      {!showSuccessIcon ? (
        <>
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground mt-4 text-sm">{message}</p>
        </>
      ) : (
        <>
          <CheckCircle2 className="text-primary h-12 w-12" />
          <h1 className="mt-4 text-xl font-bold text-white md:text-2xl">Payment Successful!</h1>
          <p className="text-muted-foreground mt-2 text-sm">{message}</p>
        </>
      )}
    </div>
  )
}
