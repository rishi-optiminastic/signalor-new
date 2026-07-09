// Canonical primary button: h-9 / rounded-md / hover-lift — matches the shared
// Button default size so landing + dashboard CTAs are visually identical.
export const LANDING_PRIMARY_CTA_CLASS =
  "auth-cta-btn inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md px-5 text-sm font-semibold text-white shadow-sm transition-all motion-safe:hover:-translate-y-px hover:text-white";

export const LANDING_COUNTRY_OPTIONS = [
  { name: "United States", code: "US", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
  { name: "India", code: "IN", flag: "🇮🇳" },
  { name: "Canada", code: "CA", flag: "🇨🇦" },
  { name: "Australia", code: "AU", flag: "🇦🇺" },
] as const;
