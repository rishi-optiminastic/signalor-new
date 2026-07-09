import type { Metadata } from "next";
import { AuthSiteShell } from "@fe/components/auth/auth-site-shell";
import { OnboardingRightPanel } from "@fe/components/onboarding/onboarding-right-panel";
import { buildMetadata } from "@fe/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Onboarding",
  description: "Set up your Signalor workspace.",
  path: "/onboarding",
  noindex: true,
});

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthSiteShell contentClassName="max-w-xl" subtleGrid rightPanel={<OnboardingRightPanel />}>
      {children}
    </AuthSiteShell>
  );
}
