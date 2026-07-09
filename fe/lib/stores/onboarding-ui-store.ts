import { create } from 'zustand'

/**
 * Tracks the current onboarding step so the right-hand illustration (rendered
 * by the onboarding layout, which can't see the page's local step state) can
 * switch between the marketing panel (company step) and the integrations grid
 * (every step after). The onboarding page writes `step` here on each change.
 */
type OnboardingUiState = {
  step: string
  setStep: (step: string) => void
}

export const useOnboardingUiStore = create<OnboardingUiState>(set => ({
  step: 'company',
  setStep: step => set({ step }),
}))
