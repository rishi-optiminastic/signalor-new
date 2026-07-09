'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'

import { identifyUser, track } from '@fe/amplitude'
import { AccountTypeForm } from '@fe/components/auth/account-type-form'
import { AuthMethodForm } from '@fe/components/auth/auth-method-form'
import { CompanyInfoForm } from '@fe/components/auth/company-info-form'
import { OrgDetailsForm } from '@fe/components/auth/org-details-form'
import { OtpForm } from '@fe/components/auth/otp-form'
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@fe/components/ui/card'
import { attributePartner } from '@fe/lib/api/partners'
import { redeemReferralCode } from '@fe/lib/api/referrals'
import { useSession } from '@fe/lib/auth-client'
import { routes } from '@fe/lib/config'
import { useOnboardingStore, type OnboardingStep } from '@fe/lib/stores/onboarding-store'

const REFERRAL_PENDING_KEY = 'signalor.referral.pendingCode'
const AFFILIATE_KEY = 'signalor.partner.code'
const AFFILIATE_EXPIRES_KEY = 'signalor.partner.expiresAt'

const STEP_CONTENT: Record<string, { title: string; description: string }> = {
  'auth-method': {
    title: 'Create your account',
    description: 'Continue with Google or use your work email.',
  },
  'otp-verify': {
    title: '',
    description: '',
  },
  'account-type': {
    title: 'Account type',
    description: "Pick how you'll use Signalor — you can change this later.",
  },
  'org-details': {
    title: 'Your details',
    description: 'Tell us your name and agency name.',
  },
  'company-info': {
    title: 'Company',
    description: 'Name and site help us tailor the product.',
  },
}

const STEP_HERO: Record<OnboardingStep, { headline: string; sub: string; badge: string }> = {
  'auth-method': {
    headline: 'Sign up',
    sub: 'Create your account to continue.',
    badge: 'Create account',
  },
  'otp-verify': {
    headline: 'Verify email',
    sub: 'We sent a 6-digit code to your inbox.',
    badge: 'Verify',
  },
  'account-type': {
    headline: 'How will you use Signalor?',
    sub: 'Choose Brand or Agency to continue.',
    badge: 'Account type',
  },
  'org-details': {
    headline: 'About your agency',
    sub: 'Add your name and agency name to continue.',
    badge: 'Details',
  },
  'company-info': {
    headline: 'Company details',
    sub: 'Almost done, add your organization.',
    badge: 'Profile',
  },
  complete: {
    headline: 'Welcome',
    sub: 'Redirecting…',
    badge: 'Done',
  },
}

const STEP_COMPONENTS: Partial<Record<OnboardingStep, React.ComponentType>> = {
  'auth-method': AuthMethodForm,
  'otp-verify': OtpForm,
  'account-type': AccountTypeForm,
  'org-details': OrgDetailsForm,
  'company-info': CompanyInfoForm,
}

function SignUpContent() {
  const { step, accountType, setAuthMode, setStep, reset } = useOnboardingStore()
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  // Guards the post-signup attribution effect against re-firing when
  // better-auth returns a fresh `session` reference on rerender — without
  // this, redeemReferralCode and attributePartner (both non-idempotent
  // POSTs) could be called multiple times before the redirect completes.
  const postSignupRan = useRef(false)
  const errorParam = searchParams.get('error')

  // Capture ?ref=CODE / ?aff=CODE on first mount.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const ref = searchParams.get('ref')
    if (ref) {
      localStorage.setItem(REFERRAL_PENDING_KEY, ref)
    }
    const aff = searchParams.get('aff')
    if (aff) {
      const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000
      localStorage.setItem(AFFILIATE_KEY, aff)
      localStorage.setItem(AFFILIATE_EXPIRES_KEY, String(expiresAt))
    }
  }, [searchParams])

  const signedInEmail = session?.user?.email
  useEffect(() => {
    if (!isPending && signedInEmail) {
      if (postSignupRan.current) return
      postSignupRan.current = true

      // Amplitude: identify + signup_completed. Read the chosen method from
      // the onboarding store (set when the user clicked Google or submitted
      // the email form). Falls back to the session.user.image heuristic only
      // if the store value is missing — e.g., if the session resolved on a
      // page that didn't go through AuthMethodForm or OAuthButton.
      const userId = session?.user?.id
      const fullName = session?.user?.name ?? ''
      const firstName = fullName.trim().split(/\s+/)[0] ?? ''
      const storedMethod = useOnboardingStore.getState().signupMethod
      const method: 'email' | 'google' = storedMethod ?? (session?.user?.image ? 'google' : 'email')
      if (userId) {
        identifyUser(userId, { email: signedInEmail, first_name: firstName })
      }
      track('signup_completed', { method })

      // When a fresh sign-up is mid-flow (e.g. on the account-type step), the
      // step components own navigation — don't let this effect bounce the user
      // to /dashboard before they've chosen Brand vs Agency.
      const onboardingActive = useOnboardingStore.getState().onboardingActive
      const finish = () => {
        if (!onboardingActive) router.replace(routes.dashboard)
      }

      // Sign-up complete, fire any pending referral redeem AND affiliate
      // attribution in parallel. Failures are non-blocking; the user still
      // reaches the dashboard.
      const pendingReferral =
        typeof window !== 'undefined' ? localStorage.getItem(REFERRAL_PENDING_KEY) : null

      const affiliateCode =
        typeof window !== 'undefined' ? localStorage.getItem(AFFILIATE_KEY) : null
      const affiliateExpiresAt =
        typeof window !== 'undefined'
          ? Number(localStorage.getItem(AFFILIATE_EXPIRES_KEY) ?? '0')
          : 0
      const affiliateActive = affiliateCode && affiliateExpiresAt > Date.now()

      const tasks: Promise<unknown>[] = []
      if (pendingReferral) {
        tasks.push(
          redeemReferralCode(pendingReferral, signedInEmail)
            .catch(() => {})
            .finally(() => {
              try {
                localStorage.removeItem(REFERRAL_PENDING_KEY)
              } catch {}
            }),
        )
      }
      if (affiliateActive && affiliateCode) {
        tasks.push(attributePartner(affiliateCode, signedInEmail).catch(() => {}))
      }

      if (tasks.length === 0) {
        finish()
        return
      }

      Promise.allSettled(tasks).finally(finish)
      return
    }
    if (!isPending && !signedInEmail) {
      reset()
      setAuthMode('sign-up')
      // Sign-up opens on the Individual-vs-Agency choice; the rest of the flow
      // (auth method → OTP) follows from there.
      setStep('account-type')
    }
  }, [reset, setAuthMode, setStep, isPending, signedInEmail, router])

  const { title, description } = STEP_CONTENT[step] ?? STEP_CONTENT['auth-method']
  const hero = STEP_HERO[step] ?? STEP_HERO['auth-method']
  const StepComponent = STEP_COMPONENTS[step]
  // Agencies get an extra "org-details" step, so the flow is 4 steps; brands 3.
  const flow: OnboardingStep[] =
    accountType === 'agency'
      ? ['account-type', 'org-details', 'auth-method', 'otp-verify']
      : ['account-type', 'auth-method', 'otp-verify']
  const stepIndex = `${Math.max(0, flow.indexOf(step)) + 1}/${flow.length}`
  const showStepDetail = step !== 'auth-method'

  return (
    <div>
      <CardHeader className="space-y-3 px-0 pt-0 pb-0">
        <div className="space-y-1">
          <CardTitle className="text-foreground text-xl font-semibold tracking-tight">
            <div className="flex items-center justify-between gap-2">
              <div>{hero.headline}</div>
              <span className="text-muted-foreground shrink-0 text-[11px] tabular-nums">
                Step {stepIndex}
              </span>
            </div>
            <div></div>
          </CardTitle>
          <CardDescription className="text-[13px] leading-relaxed">{hero.sub}</CardDescription>
          {showStepDetail && (
            <div className="pt-2">
              <p className="text-foreground text-[13px] font-medium">{title}</p>
              <CardDescription className="mt-0.5 text-xs">{description}</CardDescription>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-0 pt-4">
        {errorParam === 'no-account' && step === 'auth-method' && (
          <p className="border-warning/80 bg-warning/10 text-warning rounded-md border px-2.5 py-2 text-center text-xs">
            No account found. Please sign up first.
          </p>
        )}
        {errorParam === 'work-email' && step === 'account-type' && (
          <p className="border-warning/80 bg-warning/10 text-warning rounded-md border px-2.5 py-2 text-center text-xs">
            Agency accounts need a work email — personal providers aren&apos;t allowed. Use your
            company email to continue.
          </p>
        )}
        {StepComponent && <StepComponent />}
      </CardContent>
      <CardFooter className="justify-center px-0 pt-5 pb-0">
        <p className="text-muted-foreground text-center text-xs">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="text-foreground hover:decoration-foreground font-medium underline decoration-neutral-300 underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpContent />
    </Suspense>
  )
}
