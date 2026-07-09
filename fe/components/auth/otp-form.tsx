"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@fe/components/ui/button";
import { Label } from "@fe/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@fe/components/ui/input-otp";
import { useOnboardingStore } from "@fe/lib/stores/onboarding-store";
import { authClient } from "@fe/lib/auth-client";
import { checkOrganizationExists } from "@fe/lib/api/organizations";
import { setAccountType } from "@fe/lib/api/account";
import { routes } from "@fe/lib/config";

const OTP_LENGTH = 6;

const otpSchema = z.object({
  otp: z
    .string()
    .length(OTP_LENGTH, `Enter the ${OTP_LENGTH}-digit code.`)
    .regex(/^\d+$/, "Code must contain only digits."),
});

export function OtpForm() {
  const router = useRouter();
  const { email, authMode, accountType, userName, userRole, companyName, setOnboardingActive } =
    useOnboardingStore();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const parsed = otpSchema.safeParse({ otp });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? `Enter the ${OTP_LENGTH}-digit code.`);
      return;
    }

    setLoading(true);
    setError("");

    // Set BEFORE sign-in resolves the session, so the sign-up page's
    // session-detect redirect doesn't fire before we route the new user to the
    // account-type step.
    if (authMode === "sign-up") {
      setOnboardingActive(true);
    }

    try {
      await authClient.signIn.emailOtp({ email, otp });

      // Persist the agency user's name (collected on the sign-up card) now that
      // a session exists. Best-effort — never block verification on it.
      if (authMode === "sign-up" && userName.trim()) {
        await authClient.updateUser({ name: userName.trim() }).catch(() => {});
      }

      const hasOrg = await checkOrganizationExists(email).catch(() => false);

      if (authMode === "sign-up") {
        if (hasOrg) {
          // Already onboarded, go straight to dashboard
          router.push(routes.dashboard);
        } else {
          // Brand vs Agency was chosen at the first step; persist it now that
          // we have a verified email (best-effort — enforcement defaults to
          // individual if this fails), then continue into company onboarding.
          try {
            // The agency name (captured on the org-details step) rides the
            // onboarding store's companyName field here.
            await setAccountType(
              email,
              accountType,
              accountType === "agency" ? companyName : undefined,
              accountType === "agency" ? userRole : undefined,
            );
          } catch {
            // non-blocking
          }
          router.push(routes.dashboard);
        }
      } else {
        // Sign-in mode
        if (hasOrg) {
          router.push(routes.dashboard);
        } else {
          // No org found, user hasn't signed up yet
          setError("No account found for this email. Please sign up first.");
          await authClient.signOut();
        }
      }
    } catch {
      setError("Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });
    } catch {
      setError("Failed to resend code.");
    }
  }

  return (
    <form onSubmit={handleVerify} className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-foreground">
          Code sent to <span className="font-normal text-muted-foreground">{email}</span>
        </Label>
        <div className="flex justify-center">
          <InputOTP maxLength={OTP_LENGTH} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              {Array.from({ length: OTP_LENGTH }, (_, i) => (
                <InputOTPSlot key={i} index={i} className="h-8 w-8 text-[13px]" />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      <Button
        type="submit"
        className="auth-cta-btn h-9 w-full rounded-md text-[13px] font-medium text-white hover:text-white"
        disabled={loading || otp.length !== OTP_LENGTH}
      >
        {loading ? "Verifying…" : "Verify"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="h-8 w-full rounded-md text-xs font-medium text-muted-foreground hover:text-foreground"
        onClick={handleResend}
      >
        Resend code
      </Button>
    </form>
  );
}
