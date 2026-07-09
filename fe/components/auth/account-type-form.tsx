"use client";

import { useState } from "react";
import { ArrowRight, Building2, Check, Users } from "@fe/components/icons";
import { useOnboardingStore, type AccountType } from "@fe/lib/stores/onboarding-store";
import { cn } from "@fe/lib/utils";

type Option = {
  value: AccountType;
  label: string;
  blurb: string;
  Icon: typeof Building2;
};

const OPTIONS: Option[] = [
  {
    value: "individual",
    label: "Sign up as an Individual",
    blurb: "Track one brand or domain with self-serve tools. Any email works.",
    Icon: Building2,
  },
  {
    value: "agency",
    label: "Sign up as an Agency",
    blurb:
      "Manage multiple client brands with higher limits and agency plans. Work email required.",
    Icon: Users,
  },
];

/**
 * First step of sign-up: choose Individual vs Agency. The choice is kept in the
 * onboarding store and drives the rest of the flow — Agency requires a work
 * email (enforced in AuthMethodForm / the Google callback) and gets the agency
 * project cap + plans. The type is persisted server-side once we have a
 * verified email (see OtpForm / auth callback).
 */
export function AccountTypeForm() {
  const accountType = useOnboardingStore((s) => s.accountType);
  const [selected, setSelected] = useState<AccountType>(accountType);

  function handleContinue() {
    // Read the actions from the live store at click-time rather than closing
    // over destructured references. This is immune to stale HMR closures that
    // can otherwise leave an action `undefined` after Fast Refresh.
    const { authMode, setAccountType, setStep } = useOnboardingStore.getState();
    setAccountType(selected);
    // Sign-up agencies fill their name + agency name on a dedicated step before
    // picking an auth method; individuals (and all sign-ins) go straight to
    // Google/email.
    setStep(authMode === "sign-up" && selected === "agency" ? "org-details" : "auth-method");
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {OPTIONS.map((opt) => {
          const active = selected === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelected(opt.value)}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg border bg-white px-3 py-3 text-left transition-colors",
                active
                  ? "border-foreground ring-1 ring-foreground"
                  : "border-border hover:border-foreground/40",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                  active ? "bg-foreground text-white" : "bg-muted text-muted-foreground",
                )}
              >
                <opt.Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold text-foreground">{opt.label}</span>
                  {active && <Check className="h-4 w-4 shrink-0 text-foreground" />}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                  {opt.blurb}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={handleContinue}
        className="auth-cta-btn flex h-9 w-full items-center justify-center gap-1.5 rounded-md text-[13px] font-medium text-white hover:text-white"
      >
        Continue
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
