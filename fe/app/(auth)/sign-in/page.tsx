'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { AccountTypeForm } from '@fe/components/auth/account-type-form'
import { AuthMethodForm } from '@fe/components/auth/auth-method-form'
import { OtpForm } from '@fe/components/auth/otp-form'
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@fe/components/ui/card'
import { useSession } from '@fe/lib/auth-client'
import { routes } from '@fe/lib/config'
import { useOnboardingStore, type OnboardingStep } from '@fe/lib/stores/onboarding-store'

const STEP_CONTENT: Record<string, { title: string; description: string }> = {
  'account-type': {
    title: 'Account type',
    description: 'Sign in as an Individual or Agency.',
  },
  'auth-method': {
    title: 'Sign in',
    description: 'Continue with Google or your work email.',
  },
  'otp-verify': {
    title: '',
    description: '',
  },
}

const STEP_HERO: Record<
  Exclude<OnboardingStep, 'company-info' | 'complete' | 'org-details'>,
  { headline: string; sub: string; badge: string }
> = {
  'account-type': {
    headline: 'Sign in',
    sub: 'Choose Individual or Agency to continue.',
    badge: 'Account type',
  },
  'auth-method': {
    headline: 'Sign in',
    sub: 'Welcome back, continue with Google or use your email.',
    badge: 'Sign in',
  },
  'otp-verify': {
    headline: 'Verify email',
    sub: 'Enter the code to finish signing in.',
    badge: 'Verify',
  },
}

const STEP_COMPONENTS: Partial<Record<OnboardingStep, React.ComponentType>> = {
  'account-type': AccountTypeForm,
  'auth-method': AuthMethodForm,
  'otp-verify': OtpForm,
}

export default function SignInPage() {
  const { step, setAuthMode, setStep, reset } = useOnboardingStore()
  const { data: session, isPending } = useSession()
  const router = useRouter()

  // Initialise store once on mount only, must not re-run on session refetch

  useEffect(() => {
    reset()
    setAuthMode('sign-in')
    // Sign-in mirrors sign-up: it opens on the Individual-vs-Agency choice.
    setStep('account-type')
  }, [])

  // Redirect when a valid session is detected (e.g. after OTP verify).
  // Keyed on the stable email string so this doesn't re-fire on every
  // session ref churn from better-auth.
  const signedInEmail = session?.user?.email
  useEffect(() => {
    if (!isPending && signedInEmail) router.replace(routes.dashboard)
  }, [isPending, signedInEmail, router])

  const { title, description } = STEP_CONTENT[step] ?? STEP_CONTENT['auth-method']
  const hero =
    step === 'otp-verify'
      ? STEP_HERO['otp-verify']
      : step === 'account-type'
        ? STEP_HERO['account-type']
        : STEP_HERO['auth-method']
  const StepComponent = STEP_COMPONENTS[step]
  const stepIndex = step === 'account-type' ? '1/3' : step === 'auth-method' ? '2/3' : '3/3'
  const showStepDetail = step !== 'auth-method'

  return (
    <div>
      <CardHeader className="space-y-3 px-0 pt-0 pb-0">
        {/* <div className="flex items-center justify-between gap-2">
          <span className="rounded-md bg-[#fff4f2] px-2 py-0.5 text-[11px] font-medium text-[#b9382d]">
            {hero.badge}
          </span>
          <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
            Step {stepIndex}
          </span>
        </div> */}
        <div className="space-y-1">
          <CardTitle className="text-foreground text-xl font-semibold tracking-tight">
            <div className="flex items-center justify-between gap-2">
              {/* <span className="rounded-md bg-[#fff4f2] px-2 py-0.5 text-[11px] font-medium text-[#b9382d]">
            {hero.badge}
          </span> */}
              <div>{hero.headline}</div>
              <span className="text-muted-foreground shrink-0 text-[11px] tabular-nums">
                Step {stepIndex}
              </span>
            </div>
            {/* {hero.headline} */}
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
        {StepComponent && <StepComponent />}
      </CardContent>
      <CardFooter className="justify-center px-0 pt-5 pb-0">
        <p className="text-muted-foreground text-center text-xs">
          Don&apos;t have an account?{' '}
          <Link
            href="/sign-up"
            className="text-foreground hover:decoration-foreground font-medium underline decoration-neutral-300 underline-offset-2"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </div>
  )
}
