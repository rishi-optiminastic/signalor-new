import { create } from 'zustand'

export type OnboardingStep =
  | 'account-type'
  | 'auth-method'
  | 'otp-verify'
  | 'company-info'
  | 'complete'

export type AuthMode = 'sign-up' | 'sign-in'
export type SignupMethod = 'email' | 'google' | null
export type AccountType = 'individual' | 'agency'

interface OnboardingState {
  step: OnboardingStep
  authMode: AuthMode
  signupMethod: SignupMethod
  email: string
  accountType: AccountType
  companyName: string
  companyUrl: string
}

interface OnboardingActions {
  setStep: (step: OnboardingStep) => void
  setAuthMode: (mode: AuthMode) => void
  setSignupMethod: (method: SignupMethod) => void
  setEmail: (email: string) => void
  setAccountType: (accountType: AccountType) => void
  setCompanyInfo: (name: string, url: string) => void
  reset: () => void
}

const initialState: OnboardingState = {
  step: 'account-type',
  authMode: 'sign-up',
  signupMethod: null,
  email: '',
  accountType: 'individual',
  companyName: '',
  companyUrl: '',
}

export const useOnboardingStore = create<OnboardingState & OnboardingActions>(set => ({
  ...initialState,
  setStep: step => set({ step }),
  setAuthMode: mode => set({ authMode: mode }),
  setSignupMethod: method => set({ signupMethod: method }),
  setEmail: email => set({ email }),
  setAccountType: accountType => set({ accountType }),
  setCompanyInfo: (name, url) => set({ companyName: name, companyUrl: url }),
  reset: () => set(initialState),
}))
