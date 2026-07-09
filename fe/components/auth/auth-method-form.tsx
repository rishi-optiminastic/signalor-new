"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@fe/components/ui/button";
import { Input } from "@fe/components/ui/input";
import { Label } from "@fe/components/ui/label";
import { ArrowLeft } from "@fe/components/icons";
import { useOnboardingStore } from "@fe/lib/stores/onboarding-store";
import { authClient } from "@fe/lib/auth-client";
import { checkOrganizationExists } from "@fe/lib/api/organizations";
import { isWorkEmail } from "@fe/lib/work-email";
import { OAuthButton } from "./oauth-button";

const authEmailSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
});

export function AuthMethodForm() {
  const { authMode, accountType, setEmail, setStep, setSignupMethod } = useOnboardingStore();
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Agency sign-ups must use a company email — personal providers are rejected.
  const requireWorkEmail = authMode === "sign-up" && accountType === "agency";
  // Agencies fill name + agency name on the preceding "org-details" step, so the
  // Back button returns there rather than to the account-type choice.
  const isAgencySignup = authMode === "sign-up" && accountType === "agency";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = authEmailSchema.safeParse({ email: emailInput });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid email address.");
      return;
    }
    const email = parsed.data.email;

    if (requireWorkEmail && !isWorkEmail(email)) {
      setError("Agency accounts require a work email. Personal email providers aren't allowed.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orgExists = await checkOrganizationExists(email);

      if (authMode === "sign-up" && orgExists) {
        setError("An account with this email already exists. Please sign in.");
        setLoading(false);
        return;
      }

      if (authMode === "sign-in" && !orgExists) {
        setError("No account found for this email. Please sign up first.");
        setLoading(false);
        return;
      }

      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });
      setEmail(email);
      setSignupMethod("email");
      setStep("otp-verify");
    } catch {
      setError("Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isSignUp = authMode === "sign-up";

  return (
    <div className="space-y-5">
      {/* Both sign-up and sign-in open on the account-type choice, so the auth
          step can always go back to it. */}
      <button
        type="button"
        onClick={() => setStep(isAgencySignup ? "org-details" : "account-type")}
        className="-mt-1 flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" />
        Back
      </button>
      <div className="space-y-2">
        <OAuthButton provider="google" />
      </div>

      <div className="relative py-0.5">
        <div className="relative flex justify-center">
          <span className="bg-white px-2 text-[11px] text-muted-foreground lg:bg-transparent">
            or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
            autoComplete="email"
            className="h-9 rounded-md border-border bg-white text-[13px]"
          />
          {isSignUp && (
            <p className="text-[11px] text-muted-foreground">
              {requireWorkEmail
                ? "Use your company email — personal providers (gmail, outlook…) aren't allowed."
                : "Use your work email."}
            </p>
          )}
        </div>
        {error && (
          <p className="text-xs font-medium text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button
          type="submit"
          className="auth-cta-btn h-9 w-full rounded-md text-[13px] font-medium text-white hover:text-white"
          disabled={loading}
        >
          {loading ? "Sending…" : isSignUp ? "Sign Up" : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
