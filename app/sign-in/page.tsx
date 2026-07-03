import { AuthShell } from '@/components/auth/auth-shell'
import { OnboardingFlow } from '@/components/auth/onboarding-flow'

export default function SignInPage(): JSX.Element {
  return (
    <AuthShell>
      <OnboardingFlow mode="sign-in" />
    </AuthShell>
  )
}
