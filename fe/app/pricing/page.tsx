"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@fe/lib/auth-client";
import {
  CheckoutSessionError,
  createCheckoutSession,
  getPlanPrices,
  getSubscriptionStatus,
  type DodoMode,
  type DodoPlanPrice,
} from "@fe/lib/api/payments";
import { setAccountType as persistAccountType } from "@fe/lib/api/account";
import { POST_CHECKOUT_REDIRECT_KEY, safeInternalReturnPath } from "@fe/lib/internal-nav";
import { routes } from "@fe/lib/config";
import { Check, Clock, Crown, Rocket, Zap } from "@fe/components/icons";
import { useCurrency, formatPrice } from "@fe/lib/hooks/use-currency";
import { useOrgStore } from "@fe/lib/stores/org-store";
import { track } from "@fe/amplitude";
import { pingCheckoutStarted, pingPricingViewed } from "@fe/lib/api/drip";
import { SignalorLoader } from "@fe/components/ui/signalor-loader";
import { LandingFaq } from "@fe/components/landing/landing-faq";
import { LandingFooter } from "@fe/components/landing/landing-footer";
import { LandingMarketingShell } from "@fe/components/landing/landing-marketing-shell";
import { ScreenHR } from "@fe/components/ui/intersection-diamonds";
import { PricingHero } from "@fe/components/pricing/pricing-hero";
import { PricingStatsSection } from "@fe/components/pricing/pricing-stats-section";
import { CurrencyToggle } from "@fe/components/pricing/currency-toggle";
import { AudienceToggle, type PricingAudience } from "@fe/components/pricing/audience-toggle";
import { PRICING_FAQ_ITEMS } from "@fe/lib/pricing-marketing-content";
import { cn } from "@fe/lib/utils";
import NumberFlow from "@number-flow/react";

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  AUD: "A$",
  CAD: "C$",
  JPY: "¥",
  SGD: "S$",
  AED: "AED ",
  BRL: "R$",
  MXN: "MX$",
  ZAR: "R",
};

type PlanCta = "checkout" | "contact";

interface PlanConfig {
  id: string;
  label: string;
  /** Base monthly price in GBP. `null` renders as "Custom" (Enterprise). */
  price: number | null;
  /** Extra qualifier under the price, e.g. "per brand". */
  priceNote?: string;
  period: string;
  description: string;
  icon: typeof Zap;
  popular?: boolean;
  features: string[];
  comingSoonFeatures?: string[];
  /** "checkout" → Dodo checkout (starter/pro only); "contact" → Contact Sales. */
  cta: PlanCta;
  ctaLabel?: string;
}

// Only these plan ids may start a Dodo checkout. Everything else (Enterprise,
// every Agency card) routes to Contact Sales — no public checkout exists.
const CHECKOUTABLE = new Set(["starter", "pro"]);

// ── Individual flow ────────────────────────────────────────────────────────
const PLANS: PlanConfig[] = [
  {
    id: "starter",
    label: "Self-Serve Brand",
    price: 69.99,
    period: "/month",
    description: "Run it yourself — onboard, track, and improve your AI visibility.",
    icon: Zap,
    cta: "checkout",
    features: [
      "1 brand / domain",
      "10 prompts to rank & track",
      "AI visibility score",
      "Prompt ranking across AI engines",
      "Competitor visibility tracking",
      "Recommendations & improvement guidance",
    ],
  },
  {
    id: "pro",
    label: "Managed Growth Brand",
    price: 99.69,
    period: "/month",
    description: "Move faster with daily agency-style support from our team.",
    icon: Crown,
    popular: true,
    cta: "checkout",
    features: [
      "1 brand / domain",
      "25 prompts to rank & track",
      "Everything in Self-Serve",
      "Daily agency-style support from our team",
      "Guidance on recommendations, fixes & actions",
    ],
  },
  {
    id: "enterprise",
    label: "Enterprise",
    price: null,
    period: "",
    description: "For larger brands with higher prompt, multi-domain, or support needs.",
    icon: Rocket,
    cta: "contact",
    ctaLabel: "Contact sales",
    features: [
      "Custom prompt volume",
      "Multiple brands / domains",
      "Advanced & dedicated support",
      "Choose the AI engines you track",
      "Preferred currency & billing terms",
    ],
  },
];

// ── Agency flow (display only this phase — every CTA goes to Contact Sales) ──
const AGENCY_PLANS: PlanConfig[] = [
  {
    id: "agency-account",
    label: "Agency Account",
    price: 99.69,
    period: "/month",
    description: "Manage multiple client brands from one Signalor workspace.",
    icon: Crown,
    popular: true,
    cta: "contact",
    ctaLabel: "Talk to us",
    features: [
      "One workspace for all your clients",
      "Add & manage multiple client brands",
      "15% off every brand you onboard",
      "Consolidated visibility across clients",
    ],
  },
  {
    id: "agency-brand-10",
    label: "Per Brand · 10 prompts",
    price: 69.99,
    priceNote: "per brand",
    period: "/month",
    description: "Each client brand you onboard, billed per brand.",
    icon: Zap,
    cta: "contact",
    ctaLabel: "Talk to us",
    features: [
      "1 brand / domain",
      "10 prompts to rank & track",
      "AI visibility score & prompt ranking",
      "Competitor visibility tracking",
      "15% agency discount applied",
    ],
  },
  {
    id: "agency-brand-25",
    label: "Per Brand · 25 prompts",
    price: 99.69,
    priceNote: "per brand",
    period: "/month",
    description: "More prompt coverage per client brand.",
    icon: Rocket,
    cta: "contact",
    ctaLabel: "Talk to us",
    features: [
      "1 brand / domain",
      "25 prompts to rank & track",
      "Everything in the 10-prompt brand",
      "Recommendations & improvement guidance",
      "15% agency discount applied",
    ],
  },
];

function PricingPageFallback() {
  return (
    <LandingMarketingShell>
      <div className="flex min-h-[50vh] items-center justify-center px-6 py-24">
        <SignalorLoader size="lg" />
      </div>
    </LandingMarketingShell>
  );
}

function PricingPageInner() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = safeInternalReturnPath(searchParams.get("returnTo"));
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [checkoutDodoMode, setCheckoutDodoMode] = useState<DodoMode | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [livePrices, setLivePrices] = useState<Record<string, DodoPlanPrice | null> | null>(null);
  const [audience, setAudience] = useState<PricingAudience>("individual");
  const {
    currency,
    ready: currencyReady,
    country: detectedCountry,
    selectCurrency,
  } = useCurrency();

  useEffect(() => {
    getPlanPrices()
      .then((res) => {
        if (res.source === "dodo") {
          setLivePrices({ starter: res.starter, pro: res.pro, business: res.business });
        }
      })
      .catch(() => {
        /* graceful: keep static fallback */
      });
  }, []);

  // Amplitude: pricing_page_viewed. `geo_score` lives on the user (set during
  // audit_completed); this marketing-tier page can't read it.
  useEffect(() => {
    const activeOrg = useOrgStore.getState().activeOrg;
    track("pricing_page_viewed", { domain: activeOrg?.url ?? undefined });

    // Drip: enrol authenticated visitors. Anonymous marketing traffic skips
    // this — the drip is for signed-in users who already have an audit.
    const email = session?.user?.email;
    if (email) {
      const fullName = session.user.name ?? "";
      const firstName = fullName.trim().split(/\s+/)[0] ?? "";
      void pingPricingViewed({
        email,
        amplitude_user_id: session.user.id,
        first_name: firstName,
        domain: activeOrg?.url ?? undefined,
      }).catch(() => {
        /* swallow — analytics pings never break UX */
      });
    }
  }, [session?.user?.email, session?.user?.id, session?.user?.name]);

  useEffect(() => {
    const email = session?.user?.email;
    if (isPending || !email) {
      setCurrentPlanId(null);
      return;
    }
    getSubscriptionStatus(email)
      .then((s) => {
        // Default the toggle to the user's stored account type so an agency
        // lands on agency plans.
        if (s.account_type) {
          setAudience(s.account_type);
        }
        if (s.is_active) {
          setCurrentPlanId(s.plan);
          // Preserve onboarding/setup flows: if the user landed here with a
          // returnTo, send them onward. Guarded with a session flag so we
          // never re-redirect to the same path twice in the same tab — that
          // prevented an /pricing ↔ /onboarding/company-info bounce loop for
          // paid users at their project limit.
          if (returnTo) {
            const flagKey = `signalor:pricing-bounce:${returnTo}`;
            if (typeof window !== "undefined" && sessionStorage.getItem(flagKey)) return;
            try {
              sessionStorage.setItem(flagKey, "1");
            } catch {
              /* ignore */
            }
            router.replace(returnTo);
          }
        } else {
          setCurrentPlanId(null);
        }
      })
      .catch(() => setCurrentPlanId(null));
  }, [isPending, session?.user?.email, router, returnTo]);

  const handleSubscribe = useCallback(
    async (planId: string) => {
      if (loadingPlan) return;
      // Only the Individual self-serve plans are checkout-able; anything else
      // (Enterprise, Agency cards) is a sales conversation.
      if (!CHECKOUTABLE.has(planId)) {
        router.push(routes.contactSales);
        return;
      }
      // Amplitude: checkout_started — fire before the auth gate / API call so
      // we capture intent even if checkout creation fails or the user is
      // redirected to sign-in first.
      const activeOrg = useOrgStore.getState().activeOrg;
      track("checkout_started", { plan: planId, domain: activeOrg?.url ?? undefined });
      // Drip: permanently exclude this user from the drip sequence.
      if (session?.user?.email) {
        void pingCheckoutStarted(session.user.email).catch(() => {});
      }
      if (!session) {
        router.push(`${routes.signIn}?returnTo=${encodeURIComponent("/pricing")}`);
        return;
      }
      setLoadingPlan(planId);
      setError("");
      setCheckoutDodoMode(null);
      try {
        if (returnTo) {
          try {
            sessionStorage.setItem(POST_CHECKOUT_REDIRECT_KEY, returnTo);
          } catch {
            /* ignore */
          }
        }
        // Read partner code from localStorage (set by AffiliateCapture when
        // the visitor lands with ?aff=CODE). Expired codes are ignored so a
        // stale cookie never silently applies a discount.
        let partnerCode: string | undefined;
        try {
          const code = localStorage.getItem("signalor.partner.code");
          const expires = Number(localStorage.getItem("signalor.partner.expiresAt") || 0);
          if (code && (!expires || expires > Date.now())) partnerCode = code;
        } catch {
          /* ignore */
        }
        const { checkout_url } = await createCheckoutSession(session.user.email, planId, {
          country: detectedCountry ?? undefined,
          currency: currency.code,
          partnerCode,
        });
        window.location.href = checkout_url;
      } catch (e) {
        if (e instanceof CheckoutSessionError) {
          setError(e.message);
          setCheckoutDodoMode(e.dodoMode ?? null);
        } else {
          setError(e instanceof Error ? e.message : "Failed to start checkout. Please try again.");
          setCheckoutDodoMode(null);
        }
        setLoadingPlan(null);
      }
    },
    [session, loadingPlan, router, returnTo, detectedCountry, currency.code],
  );

  // Direct checkout from the landing pricing teaser: a ?checkout=<planId> param
  // auto-starts checkout for that plan. Anonymous visitors are sent to sign-in
  // with a returnTo that preserves the intent so checkout resumes afterwards.
  const autoCheckoutDone = useRef(false);
  useEffect(() => {
    if (autoCheckoutDone.current || isPending) return;
    const planParam = searchParams.get("checkout");
    // Only auto-start checkout for genuinely checkout-able plans. A stale
    // ?checkout=business / agency / enterprise link must no-op, not 400.
    if (!planParam || !CHECKOUTABLE.has(planParam)) return;
    autoCheckoutDone.current = true;
    if (!session) {
      const back = `/pricing?checkout=${planParam}`;
      router.push(`${routes.signIn}?returnTo=${encodeURIComponent(back)}`);
      return;
    }
    void handleSubscribe(planParam);
  }, [isPending, session, searchParams, router, handleSubscribe]);

  if (isPending) {
    return <PricingPageFallback />;
  }

  const showBackLink = !!(returnTo || session);
  const backHref = returnTo || routes.dashboard;
  const backLabel = returnTo ? "Back to setup" : "Back to dashboard";

  return (
    <LandingMarketingShell>
      <PricingHero
        showBackLink={showBackLink}
        backHref={backHref}
        backLabel={backLabel}
        onboardingBanner={returnTo === routes.onboardingCompanyInfo}
      />

      <ScreenHR />
      <section className="relative bg-background px-6 py-14 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            [ plans ]
          </p>
          <h2 className="mt-4 max-w-4xl text-3xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem]">
            Pick the plan that{" "}
            <span className="relative whitespace-nowrap text-primary">
              matches your team
              <span
                className="absolute -bottom-1 left-0 right-0 border-b-2 border-dashed border-primary/45"
                aria-hidden
              />
            </span>
          </h2>
          <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-accent-foreground lg:text-lg">
            See whether AI engines recommend you, ignore you, or recommend your competitors — and
            fix it. Pick a single-brand plan, or manage every client brand as an agency.
          </p>
          <p className="sr-only">
            Signalor measures whether ChatGPT, Gemini, Perplexity, Claude, and other AI engines
            recommend your brand. The Self-Serve Brand plan covers one brand with ten tracked
            prompts you run yourself. The Managed Growth Brand plan covers one brand with
            twenty-five tracked prompts plus daily agency-style support from our team. Enterprise
            adds custom prompt volume, multiple domains, and dedicated support. Agencies manage
            multiple client brands from one workspace with a fifteen percent discount on every brand
            onboarded.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <AudienceToggle
              audience={audience}
              onSelect={(value) => {
                setAudience(value);
                // Let a signed-in user switch their account type straight from
                // the pricing toggle (best-effort; UI updates regardless).
                const email = session?.user?.email;
                if (email) {
                  persistAccountType(email, value).catch(() => {});
                }
              }}
            />
            <CurrencyToggle currency={currency} onSelect={selectCurrency} />
          </div>

          <div className="mt-8">
            {error ? (
              <div className="mb-10 max-w-lg mx-auto space-y-2">
                <p className="rounded-none border border-destructive/25 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive">
                  {error}
                </p>
                {checkoutDodoMode === "test" && (
                  <p className="text-center text-xs leading-relaxed text-muted-foreground px-2">
                    Test mode: in <code className="text-[11px]">ranking-be/.env</code> use{" "}
                    <code className="text-[11px]">DODO_LIVE_MODE=false</code>, a secret key from the
                    Dodo dashboard <strong>Test</strong> tab, and a product id created in Test (live
                    product ids will not work).
                  </p>
                )}
                {checkoutDodoMode === "live" && (
                  <p className="text-center text-xs leading-relaxed text-muted-foreground px-2">
                    Live mode: use <code className="text-[11px]">DODO_LIVE_MODE=true</code>, a{" "}
                    <strong>Live</strong> secret key, and a Live product id in{" "}
                    <code className="text-[11px]">DODO_PRODUCT_ID_STARTER</code>.
                  </p>
                )}
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {(audience === "individual" ? PLANS : AGENCY_PLANS).map((plan) => {
                const isContact = plan.cta === "contact";
                const isCustom = plan.price === null;
                const isLoading = loadingPlan === plan.id;
                // "Current plan" only makes sense for the checkout-able tiers.
                const isCurrent = !isContact && currentPlanId === plan.id;

                // Live Dodo prices only exist for checkout-able plans; agency /
                // enterprise cards use the static GBP price (or "Custom").
                const live = livePrices?.[plan.id] ?? null;
                let displaySymbol: string;
                let displayCurrencyCode: string | null;
                let numericAmount: number;
                let isApprox: boolean;

                if (live) {
                  const userCcy = currencyReady ? currency.code : null;
                  const localized =
                    userCcy && live.prices_by_currency
                      ? live.prices_by_currency[userCcy]
                      : undefined;
                  const useLocal =
                    localized !== undefined && userCcy && userCcy !== live.currency.toUpperCase();
                  const ccy = useLocal ? userCcy! : live.currency.toUpperCase();
                  const amount = useLocal ? localized! : live.amount;
                  numericAmount = amount;
                  displaySymbol = CURRENCY_SYMBOLS[ccy] ?? ccy + " ";
                  displayCurrencyCode = ccy;
                  isApprox = !!useLocal;
                } else {
                  displaySymbol = currency.symbol;
                  displayCurrencyCode = currency.code;
                  numericAmount = isCustom ? 0 : (plan.price as number) * currency.rate;
                  isApprox = !isCustom && currencyReady && currency.code !== "GBP";
                }

                const priceDecimals =
                  displayCurrencyCode === "INR" || displayCurrencyCode === "JPY" ? 0 : 2;

                return (
                  <div
                    key={plan.id}
                    className={cn(
                      "relative flex flex-col rounded-none border p-8",
                      isCurrent
                        ? "border-success/30 bg-gradient-to-br from-success via-white to-success/40 ring-2 ring-success/50 shadow-[0_12px_40px_-12px_rgba(16,185,129,0.2)]"
                        : plan.popular
                          ? "border-primary/20 bg-gradient-to-br from-primary/5 via-white to-primary/5 ring-2 ring-primary/40 shadow-[0_12px_40px_-12px_rgba(224,74,61,0.2)]"
                          : "border-border bg-white",
                    )}
                  >
                    {/* Plan name + badge. Reserve two lines of title height so
                        the price row lines up across every card even when a
                        label (e.g. "Managed Growth Brand") wraps to two lines. */}
                    <div className="mb-3 flex min-h-[4.5rem] items-start justify-between">
                      <h3 className="text-3xl font-semibold tracking-tight text-foreground">
                        {plan.label}
                      </h3>
                      {isCurrent ? (
                        <span className="rounded-full bg-success px-3 py-1 text-[11px] font-semibold text-white">
                          Current Plan
                        </span>
                      ) : plan.popular ? (
                        <span className="rounded-full bg-success/10 px-3 py-1 text-[11px] font-semibold text-success">
                          Most Popular
                        </span>
                      ) : null}
                    </div>

                    {/* Price */}
                    {isCustom ? (
                      <>
                        <div className="mb-1 flex items-baseline">
                          <span className="text-5xl font-bold tracking-tight text-foreground">
                            Custom
                          </span>
                        </div>
                        <p className="mb-6 text-sm text-muted-foreground">
                          Tailored to your prompt & domain needs
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="mb-1 flex items-baseline gap-0.5">
                          <span className="text-2xl font-semibold text-foreground">
                            {displaySymbol}
                          </span>
                          <NumberFlow
                            value={numericAmount}
                            format={{
                              minimumFractionDigits: priceDecimals,
                              maximumFractionDigits: priceDecimals,
                            }}
                            className={cn(
                              "text-5xl font-bold tabular-nums tracking-tight",
                              live || currencyReady ? "text-foreground" : "text-foreground/40",
                            )}
                          />
                        </div>
                        <p className="mb-6 text-sm text-muted-foreground">
                          /month
                          {plan.priceNote ? ` \u00B7 ${plan.priceNote}` : ""}
                          {live && isApprox
                            ? ` \u00B7 approx. \u2014 billed in ${live.currency.toUpperCase()}`
                            : isApprox && displayCurrencyCode
                              ? ` \u00B7 approx. in ${displayCurrencyCode}`
                              : ""}
                        </p>
                      </>
                    )}

                    {/* Description */}
                    <p className="mb-6 text-[13px] font-light leading-relaxed text-muted-foreground">
                      {plan.description}
                    </p>

                    {/* CTA button */}
                    <button
                      type="button"
                      onClick={() =>
                        isContact ? router.push(routes.contactSales) : handleSubscribe(plan.id)
                      }
                      disabled={(!!loadingPlan && !isContact) || isCurrent}
                      className={cn(
                        "mb-6 w-full rounded-none py-4 text-base font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70",
                        isCurrent
                          ? "border border-success bg-gradient-to-t from-success to-success text-white shadow-lg shadow-emerald-500/25"
                          : plan.popular
                            ? "border border-primary/50 bg-gradient-to-t from-primary to-primary/80 text-white shadow-lg shadow-primary/30"
                            : "border border-foreground bg-gradient-to-t from-foreground to-foreground/85 text-white shadow-lg shadow-neutral-900/20",
                      )}
                    >
                      {isLoading ? (
                        <SignalorLoader size="sm" />
                      ) : isCurrent ? (
                        "Current Plan"
                      ) : isContact ? (
                        (plan.ctaLabel ?? "Contact sales")
                      ) : session ? (
                        "Subscribe now"
                      ) : (
                        "Get started"
                      )}
                    </button>

                    {/* Features */}
                    <div className="space-y-2.5 border-t border-border pt-5">
                      {plan.features.map((f) => (
                        <div key={f} className="flex items-center gap-3">
                          <span
                            className={cn(
                              "grid h-5 w-5 shrink-0 place-content-center rounded-full border bg-white",
                              isCurrent
                                ? "border-success"
                                : plan.popular
                                  ? "border-primary"
                                  : "border-border",
                            )}
                          >
                            <Check
                              className={cn(
                                "h-3 w-3",
                                isCurrent
                                  ? "text-success"
                                  : plan.popular
                                    ? "text-primary"
                                    : "text-muted-foreground",
                              )}
                              strokeWidth={2.5}
                              aria-hidden
                            />
                          </span>
                          <span className="text-sm text-foreground/80">{f}</span>
                        </div>
                      ))}

                      {plan.comingSoonFeatures && plan.comingSoonFeatures.length > 0 && (
                        <div className="mt-2 space-y-2.5">
                          {plan.comingSoonFeatures.map((f) => (
                            <div key={f} className="flex items-center gap-3">
                              <span className="grid h-5 w-5 shrink-0 place-content-center rounded-full border border-border bg-white">
                                <Clock className="h-3 w-3 text-muted-foreground" aria-hidden />
                              </span>
                              <span className="text-sm text-muted-foreground">{f}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-10 text-center text-[11px] font-medium text-muted-foreground">
              {audience === "agency"
                ? "Agency account is billed monthly; client brands are billed per brand with a 15% discount. Talk to us to get set up."
                : currency.code === "GBP"
                  ? "All prices in GBP. Secure payment. Cancel anytime."
                  : `Prices shown in ${currency.code}, indicative only. Charged in GBP at checkout. Cancel anytime.`}
            </p>
          </div>
        </div>
      </section>

      <ScreenHR />
      <PricingStatsSection />

      <LandingFaq
        sectionId="pricing-faq"
        headingId="pricing-faq-heading"
        heading="Pricing FAQs"
        description="Plans, billing, and what happens after you subscribe."
        items={[...PRICING_FAQ_ITEMS]}
      />

      <LandingFooter />
    </LandingMarketingShell>
  );
}

/**
 * Server-rendered SEO content (a real <h1> + plan copy) so the page isn't
 * empty / H1-less in the no-JS HTML. The interactive pricing UI below is
 * Suspense-gated by `useSearchParams`, so it only streams in with JS — leaving
 * crawlers (and the Semrush "no H1 / little content" checks) with nothing.
 * Rendered visually hidden to avoid duplicating the styled hero heading.
 */
function PricingSeoContent() {
  return (
    <div className="sr-only">
      <h1>Signalor pricing: plans for AI search and GEO visibility</h1>
      <p>
        Compare Signalor plans and pick the tier that matches your brand. Every plan shows whether
        AI engines like ChatGPT, Gemini, Perplexity, and Claude recommend your brand, ignore it, or
        recommend your competitors — with prompt ranking, competitor visibility tracking, and
        improvement guidance. Individual brands start with Self-Serve, upgrade to Managed Growth for
        hands-on support, or contact sales for Enterprise. Agencies manage multiple client brands
        from one workspace.
      </p>
      {[...PLANS, ...AGENCY_PLANS].map((plan) => (
        <section key={plan.id}>
          <h2>
            {plan.label}: {plan.price === null ? "Custom pricing" : `${plan.price.toFixed(2)} GBP`}{" "}
            {plan.period}
            {plan.priceNote ? ` (${plan.priceNote})` : ""}
          </h2>
          <p>{plan.description}</p>
          <ul>
            {plan.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default function PricingPage() {
  return (
    <>
      <PricingSeoContent />
      <Suspense fallback={<PricingPageFallback />}>
        <PricingPageInner />
      </Suspense>
    </>
  );
}
