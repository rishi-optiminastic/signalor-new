"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@fe/lib/auth-client";
import {
  getInvoiceList,
  getSubscriptionStatus,
  getUsage,
  type SubscriptionStatus,
  type UsageData,
} from "@fe/lib/api/payments";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@fe/components/ui/table";
import { EmptyState } from "@fe/components/shared";
import {
  CreditCard,
  CheckCircle2,
  FileDown,
  Zap,
  Crown,
  Rocket,
  AlertTriangle,
  ArrowUpRight,
} from "@fe/components/icons";
import { EngineBadge } from "@fe/components/ui/engine-badge";
import { engineLabel } from "@fe/lib/engines";
import { config } from "@fe/lib/config";
import { DashboardSettingsNav } from "@fe/components/settings/dashboard-settings-nav";
import { BillingSkeleton } from "@fe/components/dashboard/skeletons";
import {
  BTN_PRIMARY,
  Dot,
  FieldRow,
  SettingsCard,
  StatusPill,
} from "@fe/components/settings/settings-card";
import { cn } from "@fe/lib/utils";

const PLAN_ICONS: Record<string, typeof Zap> = {
  starter: Zap,
  pro: Crown,
  business: Rocket,
};

function UsageBar({ used, max, atLimit }: { used: number; max: number; atLimit: boolean }) {
  const pct = max > 0 ? Math.min((used / max) * 100, 100) : 0;
  const warn = pct >= 80 && !atLimit;
  const barColor = atLimit ? "bg-destructive" : warn ? "bg-warning" : "bg-success";
  const remaining = Math.max(0, max - used);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium tabular-nums text-foreground">
          {used} <span className="text-muted-foreground">/ {max}</span>
        </span>
        {atLimit ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-destructive">
            <AlertTriangle className="h-3 w-3" /> Limit reached
          </span>
        ) : (
          <span
            className={cn(
              "text-[11px] font-medium",
              warn ? "text-warning" : "text-muted-foreground",
            )}
          >
            {remaining} left
          </span>
        )}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function BillingSettingsPage() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? "";

  const [sub, setSub] = useState<SubscriptionStatus | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;
    Promise.all([
      getSubscriptionStatus(email).catch(() => null),
      getUsage(email).catch(() => null),
    ]).then(([s, u]) => {
      setSub(s);
      setUsage(u);
      setLoading(false);
    });
  }, [email]);

  const PlanIcon = sub ? PLAN_ICONS[sub.plan] || Zap : Zap;
  const atAnyLimit = usage?.at_limit.projects || usage?.at_limit.prompts;
  const renewsDate =
    sub?.is_active && sub.current_period_end
      ? new Date(sub.current_period_end).toLocaleDateString("en-GB", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : null;

  return (
    <div className="px-2 py-2 font-sans">
      <DashboardSettingsNav label="Billing" />

      <div className="mb-8 mt-5">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Billing &amp; usage
        </h2>
        <p className="mt-1.5 text-sm font-light leading-relaxed text-muted-foreground">
          Your subscription, plan limits, and recent invoices.
        </p>
      </div>

      {loading ? (
        <BillingSkeleton />
      ) : (
        <div className="space-y-8">
          {/* ── Subscription ──────────────────────────────────────────── */}
          <SettingsCard>
            <SettingsCard.Header
              title="Subscription"
              description="Your current plan and renewal date."
              action={
                sub?.is_active ? (
                  <StatusPill tone="emerald">
                    <Dot tone="emerald" />
                    Active
                  </StatusPill>
                ) : (
                  <Link href="/pricing" className={BTN_PRIMARY}>
                    <CreditCard className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Choose a plan
                  </Link>
                )
              }
            />

            <SettingsCard.Body divided>
              <FieldRow
                label="Plan"
                helper="Determines projects, prompt cap, and which AI engines are included."
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border border-black/8 bg-gradient-to-b from-white to-muted text-primary shadow-sm">
                    <PlanIcon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold tracking-tight text-foreground">
                      {sub?.plan_label || "Starter"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {sub?.is_active ? "Active subscription" : "Free tier"}
                    </p>
                  </div>
                </div>
              </FieldRow>

              {renewsDate ? (
                <FieldRow
                  label="Next billing date"
                  helper="The next time your card will be charged."
                >
                  <p className="text-sm font-medium text-foreground">{renewsDate}</p>
                </FieldRow>
              ) : null}

              <FieldRow
                label="AI engines"
                helper="Engines marked unavailable require a higher plan."
              >
                <div className="flex flex-wrap gap-1.5">
                  {["gemini", "google", "chatgpt", "perplexity", "claude"].map((eng) => {
                    const allowed = sub?.limits?.engines.includes(eng) ?? false;
                    return (
                      <span
                        key={eng}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium tracking-tight transition-colors",
                          allowed
                            ? "border-success/30 bg-success/10 text-success"
                            : "border-black/8 bg-muted text-muted-foreground line-through",
                        )}
                      >
                        <EngineBadge engine={eng} size={14} showLabel={false} />
                        {engineLabel(eng)}
                      </span>
                    );
                  })}
                </div>
              </FieldRow>
            </SettingsCard.Body>

            {sub?.is_active && sub.plan !== "business" ? (
              <SettingsCard.Footer>
                <p className="text-xs text-muted-foreground">
                  {atAnyLimit
                    ? "You've hit your plan limit. Upgrade to keep going."
                    : "Need more projects, prompts, or engines?"}
                </p>
                <Link href="/pricing" className={BTN_PRIMARY}>
                  <Rocket className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Upgrade
                </Link>
              </SettingsCard.Footer>
            ) : null}
          </SettingsCard>

          {/* ── Usage ─────────────────────────────────────────────────── */}
          {usage ? (
            <SettingsCard>
              <SettingsCard.Header
                title="Usage this period"
                description="Counts reset on your next billing date."
                action={
                  atAnyLimit ? (
                    <StatusPill tone="rose">
                      <AlertTriangle className="h-3 w-3" /> At limit
                    </StatusPill>
                  ) : null
                }
              />

              <SettingsCard.Body divided>
                <FieldRow
                  label="Projects"
                  helper="Each project is a workspace with its own scoring runs and prompts."
                >
                  <UsageBar
                    used={usage.usage.projects}
                    max={usage.limits.max_projects}
                    atLimit={usage.at_limit.projects}
                  />
                </FieldRow>

                <FieldRow
                  label="Tracked prompts"
                  helper="Prompts we re-run across AI engines to track your brand."
                >
                  <UsageBar
                    used={usage.usage.prompts}
                    max={usage.limits.max_prompts}
                    atLimit={usage.at_limit.prompts}
                  />
                </FieldRow>

                <FieldRow
                  label="Analysis runs"
                  helper="Scans completed since your last billing date."
                >
                  <p className="text-xl font-semibold tabular-nums tracking-tight text-foreground">
                    {usage.usage.runs_this_month}
                  </p>
                </FieldRow>
              </SettingsCard.Body>
            </SettingsCard>
          ) : null}

          {/* ── Plan features ─────────────────────────────────────────── */}
          {sub?.is_active && sub.limits ? (
            <SettingsCard>
              <SettingsCard.Header
                title={`What's included in ${sub.plan_label}`}
                description="Everything your plan ships with."
              />
              <SettingsCard.Body>
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                  {[
                    `${sub.limits.max_projects} brand${sub.limits.max_projects > 1 ? "s" : ""} / domain${sub.limits.max_projects > 1 ? "s" : ""}`,
                    `Up to ${sub.limits.max_prompts} tracked prompts`,
                    `Engines: ${sub.limits.engines.map((e: string) => engineLabel(e)).join(", ")}`,
                    // Drop feature lines that merely restate the project/prompt/engine
                    // counts we synthesize above (those start with "up to", a digit,
                    // or "engines") so the list isn't duplicative.
                    ...(sub.limits.features ?? []).filter(
                      (f: string) =>
                        !f.toLowerCase().startsWith("up to") &&
                        !/^\d/.test(f.trim()) &&
                        !f.toLowerCase().startsWith("engines"),
                    ),
                  ].map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-success"
                        strokeWidth={2}
                      />
                      <span className="text-[13px] leading-snug text-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </SettingsCard.Body>
            </SettingsCard>
          ) : null}

          {/* ── Invoices ──────────────────────────────────────────────── */}
          {sub?.is_active && email ? <InvoicesSection email={email} /> : null}

          <p className="pt-2 text-center text-xs font-light text-muted-foreground">
            Payments are processed securely by Dodo Payments. Cancel anytime.
          </p>
        </div>
      )}
    </div>
  );
}

function InvoicesSection({ email }: { email: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["invoices", email],
    queryFn: () => getInvoiceList(email),
    enabled: !!email,
  });

  const items = data?.items ?? [];

  return (
    <SettingsCard>
      <SettingsCard.Header
        title="Invoices"
        description="Download a PDF receipt for any successful payment."
      />
      <SettingsCard.Body>
        {isLoading ? (
          <p className="py-6 text-center text-xs font-light text-muted-foreground">
            Loading invoices…
          </p>
        ) : error ? (
          <p className="py-6 text-center text-xs font-light text-muted-foreground">
            Could not load invoices right now. Try again in a moment.
          </p>
        ) : items.length === 0 ? (
          <EmptyState
            icon={FileDown}
            title="No invoices yet"
            description="They'll appear here after your first successful charge."
          />
        ) : (
          <div className="-mx-6 -my-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((row) => (
                  <TableRow key={row.payment_id}>
                    <TableCell className="text-foreground">
                      {row.created_at
                        ? new Date(row.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell className="font-medium tabular-nums text-foreground">
                      {row.amount != null
                        ? `${row.currency ?? ""} ${row.amount.toFixed(2)}`.trim()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <InvoiceStatusPill status={row.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <a
                        href={`${config.apiBaseUrl}/api/payments/invoice/?email=${encodeURIComponent(email)}&payment_id=${encodeURIComponent(row.payment_id)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
                      >
                        <FileDown className="h-3.5 w-3.5" strokeWidth={1.75} />
                        PDF
                        <ArrowUpRight
                          className="h-3 w-3 text-muted-foreground"
                          strokeWidth={1.75}
                        />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SettingsCard.Body>
    </SettingsCard>
  );
}

function InvoiceStatusPill({ status }: { status: string | null }) {
  if (!status) return <span className="text-muted-foreground">—</span>;
  const s = status.toLowerCase();
  if (s === "succeeded" || s === "paid" || s === "completed") {
    return (
      <StatusPill tone="emerald">
        <Dot tone="emerald" /> Paid
      </StatusPill>
    );
  }
  if (s === "failed" || s === "declined") {
    return (
      <StatusPill tone="rose">
        <Dot tone="rose" /> {status}
      </StatusPill>
    );
  }
  if (s === "refunded" || s === "partially_refunded") {
    return <StatusPill tone="amber">{status.replace(/_/g, " ")}</StatusPill>;
  }
  if (s === "pending" || s === "processing") {
    return (
      <StatusPill tone="amber">
        <Dot tone="amber" /> {status}
      </StatusPill>
    );
  }
  return <StatusPill tone="neutral">{status.replace(/_/g, " ")}</StatusPill>;
}
