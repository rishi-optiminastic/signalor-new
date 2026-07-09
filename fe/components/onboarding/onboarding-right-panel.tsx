"use client";

import { AuthMarketingPanel } from "@fe/components/auth/auth-site-shell";
import { IntegrationGridPanel } from "@fe/components/onboarding/integration-grid-panel";
import { useOnboardingUiStore } from "@fe/lib/stores/onboarding-ui-store";

/**
 * Right-rail illustration for the onboarding flow.
 *
 * On the first step (company name) we keep the same marketing panel the
 * sign-in / sign-up pages use, so onboarding visually continues from auth.
 * From the platform step onward we switch to the integrations-logos lattice
 * ("your stack, connected"), which is only relevant once the user is past
 * naming their company.
 */
export function OnboardingRightPanel() {
  const step = useOnboardingUiStore((s) => s.step);
  return step === "company" ? <AuthMarketingPanel /> : <IntegrationGridPanel />;
}
