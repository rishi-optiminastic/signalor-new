import { create } from 'zustand'

export type OnboardingStep =
  | 'auth-method'
  | 'otp-verify'
  | 'account-type'
  | 'org-details'
  | 'company-info'
  | 'complete'

/**
 * Agency name + user name are collected on a dedicated sign-up step BEFORE the
 * auth method is chosen, so they survive a Google OAuth redirect (which wipes
 * this in-memory store). The details form mirrors them into sessionStorage
 * under this key; the onboarding page restores from it on the OAuth path.
 */
export const SIGNUP_DETAILS_KEY = 'signalor.signup.details'

export type AuthMode = 'sign-up' | 'sign-in'
export type SignupMethod = 'email' | 'google' | null
export type AccountType = 'individual' | 'agency'

interface OnboardingState {
  step: OnboardingStep
  authMode: AuthMode
  signupMethod: SignupMethod
  email: string
  accountType: AccountType
  userName: string
  userRole: string
  companyName: string
  companyUrl: string
  // True once a fresh sign-up reaches OTP verification, so the sign-up page
  // keeps the user on its multi-step flow (e.g. the account-type step) instead
  // of the session-detect effect bouncing them straight to /dashboard.
  onboardingActive: boolean
}

interface OnboardingActions {
  setStep: (step: OnboardingStep) => void
  setAuthMode: (mode: AuthMode) => void
  setSignupMethod: (method: SignupMethod) => void
  setEmail: (email: string) => void
  setAccountType: (accountType: AccountType) => void
  setUserName: (userName: string) => void
  setUserRole: (userRole: string) => void
  setCompanyInfo: (name: string, url: string) => void
  setOnboardingActive: (active: boolean) => void
  reset: () => void
}

const initialState: OnboardingState = {
  step: 'auth-method',
  authMode: 'sign-up',
  signupMethod: null,
  email: '',
  accountType: 'individual',
  userName: '',
  userRole: '',
  companyName: '',
  companyUrl: '',
  onboardingActive: false,
}

export const useOnboardingStore = create<OnboardingState & OnboardingActions>(set => ({
  ...initialState,
  setStep: step => set({ step }),
  setAuthMode: mode => set({ authMode: mode }),
  setSignupMethod: method => set({ signupMethod: method }),
  setEmail: email => set({ email }),
  setAccountType: accountType => set({ accountType }),
  setUserName: userName => set({ userName }),
  setUserRole: userRole => set({ userRole }),
  setCompanyInfo: (name, url) => set({ companyName: name, companyUrl: url }),
  setOnboardingActive: active => set({ onboardingActive: active }),
  reset: () => set(initialState),
}))
