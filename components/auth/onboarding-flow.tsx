'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import { routes } from '@/lib/routes'
import {
  useOnboardingStore,
  type AccountType,
  type AuthMode,
  type OnboardingStep,
} from '@/stores/useOnboardingStore'

import { AccountTypeForm } from './account-type-form'
import { AuthMethodForm } from './auth-method-form'
import { OnboardingComplete } from './onboarding-complete'
import { OrgDetailsForm } from './org-details-form'
import { OtpForm } from './otp-form'

interface OnboardingFlowProps {
  mode: AuthMode
}

// Agency sign-ups insert an org-details step (name / agency / role) before auth.
function stepOrder(mode: AuthMode, accountType: AccountType): OnboardingStep[] {
  if (mode === 'sign-up' && accountType === 'agency') {
    return ['account-type', 'org-details', 'auth-method', 'otp-verify']
  }
  return ['account-type', 'auth-method', 'otp-verify']
}

function stepHeader(step: OnboardingStep, mode: AuthMode): { title: string; description: string } {
  const isSignUp = mode === 'sign-up'
  switch (step) {
    case 'account-type':
      return {
        title: isSignUp ? 'How will you use Signalor?' : 'Sign in',
        description: 'Choose Individual or Agency to continue.',
      }
    case 'org-details':
      return {
        title: 'Tell us about your agency',
        description: 'Your name, agency and role — so we can set up your workspace.',
      }
    case 'auth-method':
      return {
        title: isSignUp ? 'Create your account' : 'Welcome back',
        description: isSignUp
          ? "Start tracking your brand's AI-search visibility."
          : 'Sign in to continue to Signalor.',
      }
    case 'otp-verify':
      return { title: 'Verify your email', description: 'Almost there — check your inbox.' }
    default:
      return { title: '', description: '' }
  }
}

const STEP_COMPONENTS: Partial<Record<OnboardingStep, () => JSX.Element>> = {
  'account-type': AccountTypeForm,
  'org-details': OrgDetailsForm,
  'auth-method': AuthMethodForm,
  'otp-verify': OtpForm,
}

/**
 * Drives the multi-step onboarding wizard for both sign-in and sign-up. Renders
 * the header + stepper and the component for the current store step.
 */
export function OnboardingFlow({ mode }: OnboardingFlowProps): JSX.Element {
  const step = useOnboardingStore(s => s.step)
  const accountType = useOnboardingStore(s => s.accountType)
  const reset = useOnboardingStore(s => s.reset)
  const setAuthMode = useOnboardingStore(s => s.setAuthMode)
  const setStep = useOnboardingStore(s => s.setStep)

  // Initialise the flow once on mount — always open on the account-type choice.
  useEffect(() => {
    reset()
    setAuthMode(mode)
    setStep('account-type')
  }, [mode, reset, setAuthMode, setStep])

  if (step === 'complete') {
    return <OnboardingComplete />
  }

  const order = stepOrder(mode, accountType)
  const stepIndex = Math.max(0, order.indexOf(step))
  const { title, description } = stepHeader(step, mode)
  const StepComponent = STEP_COMPONENTS[step]

  return (
    <div>
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="text-foreground text-xl font-semibold tracking-tight">{title}</h1>
          <span className="shrink-0 text-[11px] text-neutral-400 tabular-nums">
            Step {stepIndex + 1}/{order.length}
          </span>
        </div>
        <p className="text-[13px] leading-relaxed font-light text-neutral-400">{description}</p>
      </div>

      <div className="mt-5">{StepComponent && <StepComponent />}</div>

      <p className="mt-6 text-center text-xs text-neutral-500">
        {mode === 'sign-up' ? (
          <>
            Already have an account?{' '}
            <Link
              href={routes.signIn}
              className="text-foreground hover:decoration-foreground font-medium underline decoration-neutral-300 underline-offset-2"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{' '}
            <Link
              href={routes.signUp}
              className="text-foreground hover:decoration-foreground font-medium underline decoration-neutral-300 underline-offset-2"
            >
              Sign up
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
