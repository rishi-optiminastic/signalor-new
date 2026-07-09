"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@fe/lib/auth-client";
import { getReferralMe } from "@fe/lib/api/referrals";
import { Skeleton } from "@fe/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@fe/components/ui/table";
import { Alert, AlertDescription } from "@fe/components/ui/alert";
import { EmptyState } from "@fe/components/shared";
import { Check, Copy, Sparkles, AlertCircle, Gift } from "@fe/components/icons";
import { DashboardSettingsNav } from "@fe/components/settings/dashboard-settings-nav";
import {
  BTN_OUTLINE,
  BTN_PRIMARY,
  Dot,
  FieldRow,
  SettingsCard,
  StatusPill,
} from "@fe/components/settings/settings-card";
import { cn } from "@fe/lib/utils";
import { env } from "@fe/lib/env";

const SITE_BASE = env.NEXT_PUBLIC_SITE_URL;

export default function ReferralsSettingsPage() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? "";

  const [copied, setCopied] = useState(false);

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["referral-me", email],
    queryFn: () => getReferralMe(email),
    enabled: !!email,
  });

  const shareUrl = useMemo(() => {
    if (!data?.code) return "";
    return `${SITE_BASE}/?ref=${data.code}`;
  }, [data?.code]);

  async function handleCopy() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="px-2 py-2 font-sans">
      <DashboardSettingsNav label="Referrals" />

      <div className="mb-8 mt-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Refer &amp; earn
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm font-light leading-relaxed text-muted-foreground">
            Share your referral link. When someone subscribes through it,{" "}
            <strong className="font-medium text-foreground">they get 10% off</strong> their first
            payment and <strong className="font-medium text-foreground">you get 20% off</strong>{" "}
            your next billing cycle.
          </p>
        </div>
        <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-primary/5 text-primary md:inline-flex">
          <Gift className="h-4 w-4" strokeWidth={1.75} />
        </span>
      </div>

      {loading && !data ? (
        <Skeleton className="h-44 w-full rounded-xl" />
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load referrals"}
          </AlertDescription>
        </Alert>
      ) : data ? (
        <div className="space-y-8">
          {/* ── Share link ───────────────────────────────────────────── */}
          <SettingsCard>
            <SettingsCard.Header
              title="Your referral link"
              description="Send this anywhere — Slack, email, X. We track signups for 30 days."
            />

            <SettingsCard.Body divided>
              <FieldRow
                label="Share URL"
                helper="Anyone who signs up through this link is credited to you."
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex-1 overflow-x-auto rounded-md border border-black/8 bg-muted px-3 py-2 font-mono text-xs text-foreground">
                    <span className="text-muted-foreground">
                      {SITE_BASE.replace(/^https?:\/\//, "")}
                    </span>
                    /?ref=
                    <span className="font-semibold text-foreground">{data.code}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={copied ? BTN_OUTLINE : BTN_PRIMARY}
                  >
                    {copied ? (
                      <>
                        <Check className="size-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" /> Copy link
                      </>
                    )}
                  </button>
                </div>
              </FieldRow>

              <FieldRow
                label="Referral code"
                helper="Short code embedded in the link above. Useful for verbal sharing."
              >
                <span className="inline-flex items-center gap-1.5">
                  <span className="rounded-md border border-black/8 bg-muted px-3 py-1.5 font-mono text-[13px] font-semibold tracking-tight text-foreground">
                    {data.code}
                  </span>
                </span>
              </FieldRow>
            </SettingsCard.Body>
          </SettingsCard>

          {/* ── Pending reward callout ──────────────────────────────── */}
          {data.stats.pending_reward ? (
            <div className="flex items-center gap-3 rounded-xl border border-primary/15 bg-gradient-to-r from-primary/[0.06] to-primary/[0.02] px-4 py-3.5 text-[13px] text-primary">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="size-4" />
              </span>
              <span className="leading-snug">
                You have{" "}
                <strong className="font-semibold">
                  {data.stats.pending_reward.percent_off}% off
                </strong>{" "}
                staged for your next billing cycle.
              </span>
            </div>
          ) : null}

          {/* ── Stats ────────────────────────────────────────────────── */}
          <SettingsCard>
            <SettingsCard.Header
              title="Performance"
              description="Lifetime totals across every referral you've sent."
            />

            <div className="grid grid-cols-2 divide-x divide-y divide-black/6 sm:grid-cols-4 sm:divide-y-0">
              <StatTile label="Total invites" value={data.stats.total} />
              <StatTile label="Pending" value={data.stats.pending} tone="muted" />
              <StatTile label="Subscribed" value={data.stats.paid} tone="positive" indicator />
              <StatTile label="Rewards earned" value={data.stats.rewards_applied} tone="primary" />
            </div>
          </SettingsCard>

          {/* ── Recent referrals ─────────────────────────────────────── */}
          <SettingsCard>
            <SettingsCard.Header
              title="Recent referrals"
              description="People who've clicked your link or signed up."
            />

            <SettingsCard.Body>
              {data.referrals.length === 0 ? (
                <EmptyState
                  icon={Gift}
                  title="No referrals yet"
                  description="Share your link with friends and they'll appear here once they sign up."
                />
              ) : (
                <div className="-mx-6 -my-5">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Subscribed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.referrals.map((r) => (
                        <TableRow key={r.referee_email}>
                          <TableCell className="font-medium text-foreground">
                            {r.referee_email}
                          </TableCell>
                          <TableCell>
                            <ReferralStatusPill status={r.status} />
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(r.created_at).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {r.paid_at
                              ? new Date(r.paid_at).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </SettingsCard.Body>
          </SettingsCard>
        </div>
      ) : null}
    </div>
  );
}

function StatTile({
  label,
  value,
  tone = "default",
  indicator = false,
}: {
  label: string;
  value: number;
  tone?: "default" | "muted" | "positive" | "primary";
  indicator?: boolean;
}) {
  return (
    <div className="px-5 py-5">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {indicator ? <Dot tone="emerald" /> : null}
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 text-2xl font-semibold leading-none tabular-nums tracking-tight",
          tone === "positive" && "text-success",
          tone === "primary" && "text-primary",
          tone === "muted" && "text-muted-foreground",
          tone === "default" && "text-foreground",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function ReferralStatusPill({ status }: { status: "pending" | "paid" | "cancelled" }) {
  if (status === "paid") {
    return (
      <StatusPill tone="emerald">
        <Dot tone="emerald" /> Subscribed
      </StatusPill>
    );
  }
  if (status === "cancelled") {
    return <StatusPill tone="rose">Cancelled</StatusPill>;
  }
  return (
    <StatusPill tone="neutral">
      <Dot tone="neutral" /> Pending
    </StatusPill>
  );
}
