import { AuthShell } from '@/components/auth/auth-shell'
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'

export default function OnboardingPage(): JSX.Element {
  return (
    <AuthShell contentClassName="w-[420px]">
      <OnboardingWizard />
    </AuthShell>
  )
}
