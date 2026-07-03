import { AuthShell } from '@/components/auth/auth-shell'
import { OnboardingFlow } from '@/components/auth/onboarding-flow'

export default function SignUpPage(): JSX.Element {
  return (
    <AuthShell>
      <OnboardingFlow mode="sign-up" />
    </AuthShell>
  )
}
