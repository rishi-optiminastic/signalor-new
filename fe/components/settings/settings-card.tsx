/**
 * Shared chrome for every section card on /dashboard/[slug]/settings/*.
 *
 * Three primitives:
 *   <SettingsCard>          the outer container with the soft layered shadow
 *     <SettingsCard.Header  the top strip with title + optional subtitle/action
 *     <SettingsCard.Body    interior padding wrapper (use when not rendering rows)
 *     <SettingsCard.Footer  bottom strip, separated by a divider
 *
 *   <FieldRow>              two-column row inside a card (label left, content right)
 *
 *   <Dot/>                  status indicator (green/amber/rose/neutral)
 *
 * Tokens deliberately favor neutral-200 borders + softer shadows over the
 * stark black/8 we had before; that's the single largest visual upgrade.
 */

"use client";

import { type ReactNode } from "react";
import { cn } from "@fe/lib/utils";

// Chrome aligned to the landing page's "lined and tight" aesthetic:
// flat rounded-sm, hairline border-black/6, no soft layered shadow. Matches
// the cells used in landing-features-grid / landing-why-signalor.
const CARD_CLS = "rounded-sm border border-black/6 bg-white";

export function SettingsCard({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn(CARD_CLS, className)}>{children}</section>;
}

function CardHeader({
  title,
  eyebrow,
  description,
  action,
  className,
}: {
  title: string;
  /** Optional [ eyebrow ] tag rendered above the title to match the landing voice. */
  eyebrow?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex items-start justify-between gap-3 border-b border-black/6 px-6 py-5",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            [ {eyebrow} ]
          </p>
        ) : null}
        <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
        {description ? (
          <p className="mt-1 text-[13px] font-light leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

function CardBody({
  children,
  className,
  divided = false,
}: {
  children: ReactNode;
  className?: string;
  /** Auto-divide direct children with horizontal rules (use with FieldRow). */
  divided?: boolean;
}) {
  return (
    <div className={cn(divided ? "divide-y divide-black/6 px-6" : "px-6 py-5", className)}>
      {children}
    </div>
  );
}

function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <footer
      className={cn(
        "flex items-center justify-between gap-3 border-t border-black/6 px-6 py-4",
        className,
      )}
    >
      {children}
    </footer>
  );
}

SettingsCard.Header = CardHeader;
SettingsCard.Body = CardBody;
SettingsCard.Footer = CardFooter;

/** Two-column form row used inside SettingsCard.Body divided. */
export function FieldRow({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 py-6 md:grid-cols-[260px_1fr] md:gap-10">
      <div>
        <p className="text-[13px] font-medium tracking-tight text-foreground">{label}</p>
        {helper ? (
          <p className="mt-1 text-xs font-light leading-[1.6] text-muted-foreground">{helper}</p>
        ) : null}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

/** Small colored dot used inline as a status indicator. */
export function Dot({
  tone,
  className,
}: {
  tone: "emerald" | "amber" | "rose" | "neutral" | "primary";
  className?: string;
}) {
  const color =
    tone === "emerald"
      ? "bg-success"
      : tone === "amber"
        ? "bg-warning"
        : tone === "rose"
          ? "bg-destructive"
          : tone === "primary"
            ? "bg-primary"
            : "bg-muted";
  return (
    <span
      className={cn("relative inline-flex h-2 w-2 shrink-0 rounded-full", color, className)}
      aria-hidden
    >
      {tone === "emerald" ? (
        <span className="absolute inset-0 animate-ping rounded-full bg-success/70" />
      ) : null}
    </span>
  );
}

/** Refined status pill — use for invoices etc. */
export function StatusPill({
  tone,
  children,
  className,
}: {
  tone: "emerald" | "amber" | "rose" | "neutral" | "primary";
  children: ReactNode;
  className?: string;
}) {
  const cls =
    tone === "emerald"
      ? "border-success/30 bg-success/10 text-success"
      : tone === "amber"
        ? "border-warning/30 bg-warning/10 text-warning"
        : tone === "rose"
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : tone === "primary"
            ? "border-primary/20 bg-primary/5 text-primary"
            : "border-black/8 bg-muted text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-tight",
        cls,
        className,
      )}
    >
      {children}
    </span>
  );
}

// ── Shared button + input tokens ────────────────────────────────────────
// Exported as plain class strings so callers can compose with cn().

export const BTN_PRIMARY =
  "inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-xs font-medium tracking-tight text-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-150 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50";

export const BTN_OUTLINE =
  "inline-flex items-center justify-center gap-1.5 rounded-md border border-black/12 bg-white px-3.5 py-2 text-xs font-medium tracking-tight text-foreground shadow-sm transition-colors duration-150 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

export const BTN_DANGER =
  "inline-flex items-center justify-center gap-1.5 rounded-md bg-destructive px-3.5 py-2 text-xs font-medium tracking-tight text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-colors duration-150 hover:bg-destructive disabled:cursor-not-allowed disabled:opacity-50";

export const INPUT_CLS =
  "w-full rounded-sm border border-black/10 bg-white px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus:border-black/30 focus:outline-none focus:ring-4 focus:ring-black/[0.04] disabled:bg-muted disabled:text-muted-foreground";
