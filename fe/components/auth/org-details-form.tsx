"use client";

import { useState } from "react";
import { Button } from "@fe/components/ui/button";
import { Input } from "@fe/components/ui/input";
import { Label } from "@fe/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@fe/components/ui/select";
import { ArrowLeft, ArrowRight } from "@fe/components/icons";
import { useOnboardingStore, SIGNUP_DETAILS_KEY } from "@fe/lib/stores/onboarding-store";

/** Common positions at a brand/agency — kept short so the dropdown stays scannable. */
const ROLE_OPTIONS = [
  "Founder / CEO",
  "Marketing / Growth",
  "SEO / Content",
  "Account Manager",
  "Developer / Engineer",
  "Other",
];

/**
 * Agency-only sign-up step: collect the person's name, their role, and the
 * agency name BEFORE the auth method is chosen. Captured here so the details are
 * available regardless of whether the user continues with Google (a full-page
 * redirect that wipes the in-memory store) or email. Values ride the onboarding
 * store for the email path and sessionStorage for the OAuth round-trip.
 */
export function OrgDetailsForm() {
  const { userName, userRole, companyName } = useOnboardingStore();
  const [name, setName] = useState(userName);
  const [role, setRole] = useState(userRole);
  const [agency, setAgency] = useState(companyName);
  const [error, setError] = useState("");

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedAgency = agency.trim();
    if (!trimmedName || !trimmedAgency || !role) {
      setError("Please enter your name, role, and agency name.");
      return;
    }

    const { setUserName, setUserRole, setCompanyInfo, setStep } = useOnboardingStore.getState();
    setUserName(trimmedName);
    setUserRole(role);
    // Stash the agency name as the company name so onboarding can prefill it.
    setCompanyInfo(trimmedAgency, "");

    // Mirror to sessionStorage so the values survive the Google OAuth redirect.
    try {
      sessionStorage.setItem(
        SIGNUP_DETAILS_KEY,
        JSON.stringify({ userName: trimmedName, userRole: role, agencyName: trimmedAgency }),
      );
    } catch {
      /* best-effort */
    }

    setStep("auth-method");
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => useOnboardingStore.getState().setStep("account-type")}
        className="-mt-1 flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" />
        Back
      </button>

      <form onSubmit={handleContinue} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="agency-your-name" className="text-xs font-medium text-foreground">
            Your name
          </Label>
          <Input
            id="agency-your-name"
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            autoComplete="name"
            className="h-9 rounded-md border-border bg-white text-[13px]"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="agency-role" className="text-xs font-medium text-foreground">
            Your role
          </Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger
              id="agency-role"
              className="h-9 w-full rounded-md border-border bg-white text-[13px]"
            >
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((r) => (
                <SelectItem key={r} value={r} className="text-[13px]">
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="agency-name" className="text-xs font-medium text-foreground">
            Agency name
          </Label>
          <Input
            id="agency-name"
            type="text"
            placeholder="Acme Agency"
            value={agency}
            onChange={(e) => setAgency(e.target.value)}
            required
            autoComplete="organization"
            className="h-9 rounded-md border-border bg-white text-[13px]"
          />
        </div>
        {error && (
          <p className="text-xs font-medium text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button
          type="submit"
          disabled={!name.trim() || !role || !agency.trim()}
          className="auth-cta-btn flex h-9 w-full items-center justify-center gap-1.5 rounded-md text-[13px] font-medium text-white hover:text-white"
        >
          Continue
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </form>
    </div>
  );
}
