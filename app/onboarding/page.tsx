import { AuthShell } from '@/components/auth/auth-shell'
import { OnboardingMarketingPanel } from '@/components/onboarding/onboarding-marketing-panel'
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'

export default function OnboardingPage(): JSX.Element {
  return (
    <AuthShell contentClassName="w-[420px]" rightPanel={<OnboardingMarketingPanel />}>
      <OnboardingWizard />
    </AuthShell>
  )
}
