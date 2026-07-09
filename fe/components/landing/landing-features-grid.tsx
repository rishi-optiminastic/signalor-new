"use client";

import { Sparkles } from "@fe/components/icons";
import { ScreenHR, GridDividerDiamonds } from "@fe/components/ui/intersection-diamonds";

export function LandingFeaturesGrid() {
  return (
    <section className="relative bg-transparent" aria-labelledby="landing-features-grid-heading">
      <ScreenHR />
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-14 lg:px-12 lg:pb-14 lg:pt-16 rounded-none ">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          [ platform ]
        </p>
        <h2
          id="landing-features-grid-heading"
          className="mt-4 max-w-4xl text-3xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem] xl:text-5xl"
        >
          Everything you need to{" "}
          <span className="relative inline-flex items-center gap-2 whitespace-nowrap text-primary align-middle">
            win in{" "}
            <Sparkles
              className="inline-block h-[0.85em] w-[0.85em] shrink-0 align-middle text-primary"
              strokeWidth={2.25}
              aria-hidden
            />{" "}
            search
            <span
              className="absolute -bottom-1 left-0 right-0 border-b-2 border-dashed border-primary/45"
              aria-hidden
            />
          </span>
        </h2>
        <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-accent-foreground lg:text-lg">
          Track and improve how AI engines cite your brand, across ChatGPT, Claude, Gemini, and
          Perplexity.
        </p>
      </div>
      <ScreenHR />
      <div className="mx-auto max-w-7xl bg-black-10">
        <div className="relative grid grid-cols-1 divide-y divide-black/6 md:grid-cols-3 md:divide-x md:divide-y-0 md:divide-black/6">
          <GridDividerDiamonds columns={3} top bottom />
          {/* Prompt tracking */}
          <div className="flex flex-col gap-8 px-6 py-12 md:px-8 md:py-16 lg:px-10 rounded-none bg-white">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                Prompt tracking
              </h3>
              <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-accent-foreground md:text-sm">
                Track real user prompts. See exactly when AI mentions your brand.
              </p>
            </div>
            <div className="w-full h-full flex justify-center items-center bg-background rounded-none border p-4">
              <div className="mt-auto rounded-none border border-black/8 bg-white p-4 shadow-xs">
                <div className="space-y-3 text-[13px] leading-snug">
                  <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-muted px-3.5 py-2.5 text-foreground">
                    What CRM do you recommend for a small sales team?
                  </div>
                  <div className="ml-auto max-w-[94%] rounded-2xl rounded-br-md bg-foreground px-3.5 py-2.5 text-xs font-medium text-muted-foreground">
                    Popular picks include{" "}
                    <span className="font-semibold text-orange-400">HubSpot</span>
                    {" and "}
                    <span className="text-white underline decoration-white/40">Salesforce</span> for
                    pipeline and reporting.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Citations analysis */}
          <div className="flex flex-col gap-8 px-6 py-12 md:px-8 md:py-16 lg:px-10 bg-white rounded-none">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                Citations analysis
              </h3>
              <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-accent-foreground md:text-sm">
                See which pages drive citations. Learn what content AI engines actually use.
              </p>
            </div>
            <div className="w-full h-full flex justify-center items-center bg-background rounded-none border p-4">
              <div className="mt-auto w-full rounded-none border border-black/8 bg-white p-4 shadow-xs">
                <div className="mb-3 flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                  <span>Mentioned</span>
                  <span>Missing</span>
                </div>
                <div className="mb-4 flex h-2.5 overflow-hidden rounded-full bg-muted">
                  <div className="w-[40%] bg-info" />
                  <div
                    className="relative flex-1 bg-muted"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.06) 4px, rgba(0,0,0,0.06) 5px)",
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-semibold tabular-nums text-muted-foreground">
                  <span>40%</span>
                  <span>60%</span>
                </div>
                <ul className="mt-4 space-y-2 border-t border-black/6 pt-3 text-xs font-medium text-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-info" />
                    Listicle (23%) · missing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                    Guide (18%) · cited
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                    Comparison (12%) · partial
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Agent analytics */}
          <div className="flex flex-col gap-8 px-6 py-12 md:px-8 md:py-16 lg:px-10 bg-white rounded-none ">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                Agent analytics
              </h3>
              <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-accent-foreground md:text-sm">
                Watch ChatGPT, Claude, and Gemini crawlers read your pages in real time.
              </p>
            </div>
            <div className="w-full h-full flex justify-center items-center bg-background rounded-none border p-4">
              <div className="mt-auto w-full rounded-none border border-black/8 bg-white p-3 shadow-xs">
                <ul className="divide-y divide-black/6 text-xs font-medium">
                  {[
                    {
                      name: "ChatGPT",
                      path: "/blog/security-…",
                      tone: "bg-success",
                    },
                    {
                      name: "Claude",
                      path: "/pricing/com…",
                      tone: "bg-[var(--feature-violet)]",
                    },
                    {
                      name: "Perplexity",
                      path: "/docs/api-v2…",
                      tone: "bg-info",
                    },
                    {
                      name: "Copilot",
                      path: "/resources/…",
                      tone: "bg-info",
                    },
                  ].map((row) => (
                    <li
                      key={row.name}
                      className="flex items-center gap-2.5 py-2.5 first:pt-1 last:pb-1"
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white ${row.tone}`}
                        aria-hidden
                      >
                        {row.name.slice(0, 1)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-foreground">{row.name}</div>
                        <div className="truncate text-[11px] text-muted-foreground">{row.path}</div>
                      </div>
                      <span className="shrink-0 rounded-md border border-black/8 bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Cited
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="relative left-1/2 w-screen -translate-x-1/2 border-t border-black/6"
        />

        <div className="relative grid grid-cols-1 divide-y divide-black/6 md:grid-cols-3 md:divide-x md:divide-y-0 md:divide-black/6">
          <GridDividerDiamonds columns={3} top bottom />
          {/* GEO score */}
          <div className="flex flex-col gap-8 rounded-none bg-white px-6 py-12 md:px-8 md:py-16 lg:px-10">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                GEO score
              </h3>
              <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-accent-foreground md:text-sm">
                One 0–100 score. Citability, schema, content — all rolled up. Know where you stand.
              </p>
            </div>
            <div className="flex h-full w-full items-center justify-center rounded-none border bg-background p-4">
              <div className="mt-auto w-full rounded-none border border-black/8 bg-white p-4 shadow-xs">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Overall
                    </p>
                    <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-foreground">
                      78
                      <span className="text-lg font-semibold text-muted-foreground">/100</span>
                    </p>
                  </div>
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-info/25 text-[11px] font-bold text-info">
                    +12
                  </div>
                </div>
                <ul className="mt-4 space-y-2.5 border-t border-black/6 pt-3 text-xs font-medium text-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-8 shrink-0 rounded-full bg-info/80" />
                    Citability · 82
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-6 shrink-0 rounded-full bg-success/90" />
                    Schema · 71
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-7 shrink-0 rounded-full bg-warning/90" />
                    Content · 74
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Fix queue */}
          <div className="flex flex-col gap-8 rounded-none bg-white px-6 py-12 md:px-8 md:py-16 lg:px-10">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                Fix queue
              </h3>
              <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-accent-foreground md:text-sm">
                Ranked fixes with impact estimates. Ship what moves citations first.
              </p>
            </div>
            <div className="flex h-full w-full items-center justify-center rounded-none border bg-background p-4">
              <div className="mt-auto w-full rounded-none border border-black/8 bg-white p-3 shadow-xs">
                <ul className="divide-y divide-black/6 text-xs font-medium">
                  <li className="flex items-start gap-2 py-2.5 first:pt-1">
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-destructive" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground">Add Organization JSON-LD</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">
                        High impact · ~2h
                      </div>
                    </div>
                    <span className="shrink-0 rounded-md bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-destructive">
                      Critical
                    </span>
                  </li>
                  <li className="flex items-start gap-2 py-2.5">
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-warning" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground">Rewrite meta for /pricing</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">Medium · ~45m</div>
                    </div>
                    <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Next
                    </span>
                  </li>
                  <li className="flex items-start gap-2 py-2.5 last:pb-1">
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-success" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground">
                        Publish FAQ block on /docs
                      </div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">
                        Shipped · cited in Perplexity
                      </div>
                    </div>
                    <span className="shrink-0 rounded-md bg-success/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-success">
                      Done
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Competitor lens */}
          <div className="flex flex-col gap-8 rounded-none bg-white px-6 py-12 md:px-8 md:py-16 lg:px-10">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                Competitor lens
              </h3>
              <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-accent-foreground md:text-sm">
                Compare your citation share with rivals. Close gaps before they widen.
              </p>
            </div>
            <div className="flex h-full w-full items-center justify-center rounded-none border bg-background p-4">
              <div className="mt-auto w-full rounded-none border border-black/8 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                  <span>Share of AI citations</span>
                  <span className="tabular-nums text-muted-foreground">7d</span>
                </div>
                <div className="mt-3 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-foreground">
                      <span>You</span>
                      <span className="tabular-nums text-info">38%</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-[38%] rounded-full bg-info" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-foreground">
                      <span>Acme</span>
                      <span className="tabular-nums text-muted-foreground">44%</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-[44%] rounded-full bg-muted" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-foreground">
                      <span>Northwind</span>
                      <span className="tabular-nums text-muted-foreground">18%</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-[18%] rounded-full bg-muted" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
