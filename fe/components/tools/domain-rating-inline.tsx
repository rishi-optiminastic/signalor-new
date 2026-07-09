"use client";

import { useCallback, useState } from "react";
import { ArrowRight, Globe, Loader2 } from "@fe/components/icons";

import { Button } from "@fe/components/ui/button";
import { ToolGateCard } from "@fe/components/tools/tool-gate-card";
import { checkDomainRating, type DomainRatingResult } from "@fe/lib/api/domain-rating";

type State =
  | { kind: "idle" }
  | { kind: "running" }
  | { kind: "done"; data: DomainRatingResult }
  | { kind: "error"; message: string };

/** Strip scheme, www., and any path/query so we're left with a bare hostname. */
function normalizeDomain(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[/?#].*$/, "");
}

// 1+ labels + a 2-letter-min TLD, no scheme/path/spaces.
const DOMAIN_RE = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;

function isValidDomain(domain: string): boolean {
  return DOMAIN_RE.test(domain);
}

function errorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  return "Couldn't fetch domain rating. Try again.";
}

/** Show the decimal when present (0.4), but no trailing ".0" for whole values (99). */
function formatRating(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function ratingTone(value: number) {
  if (value >= 70) return "text-success";
  if (value >= 40) return "text-warning";
  if (value >= 20) return "text-orange-600";
  return "text-destructive";
}

export function DomainRatingInline() {
  const [domain, setDomain] = useState("");
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<State>({ kind: "idle" });

  const normalized = normalizeDomain(domain);
  const valid = isValidDomain(normalized);
  const showFormatError = touched && domain.trim().length > 0 && !valid;

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setTouched(true);
      if (!valid) return;
      setState({ kind: "running" });
      try {
        const data = await checkDomainRating(normalized);
        setState({ kind: "done", data });
      } catch (err) {
        setState({ kind: "error", message: errorMessage(err) });
      }
    },
    [normalized, valid],
  );

  return (
    <div className="w-full">
      <form onSubmit={submit} className="w-full">
        <label className="block text-sm font-semibold text-foreground">Domain</label>
        <div className="mt-2 flex w-full items-center gap-2 rounded-none border border-primary/25 bg-white p-1.5 shadow-sm">
          <Globe className="ml-2 h-4 w-4 text-muted-foreground" aria-hidden />
          <input
            type="text"
            inputMode="url"
            placeholder="Enter your domain (e.g. signalor.ai)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onBlur={() => setTouched(true)}
            disabled={state.kind === "running"}
            className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-60"
            aria-invalid={showFormatError}
          />
        </div>

        {showFormatError && (
          <p className="mt-2 text-xs text-destructive">
            Enter a valid domain, e.g. <span className="font-medium">signalor.ai</span> (no https://
            or paths).
          </p>
        )}

        <Button
          type="submit"
          disabled={!valid || state.kind === "running"}
          className="mt-3 w-full rounded-none bg-primary text-sm font-semibold text-white hover:brightness-110"
        >
          {state.kind === "running" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking domain rating
            </>
          ) : (
            <>
              Check domain rating
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {state.kind === "running" && (
        <div className="mt-5 rounded-none border border-black/6 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Looking up domain authority…
          </div>
        </div>
      )}

      {state.kind === "error" && (
        <div className="mt-5 rounded-none border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {state.message}
        </div>
      )}

      {state.kind === "done" && (
        <ResultView data={state.data} onReset={() => setState({ kind: "idle" })} />
      )}
    </div>
  );
}

function ResultView({ data, onReset }: { data: DomainRatingResult; onReset: () => void }) {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Results for <span className="font-semibold text-foreground">{data.domain}</span>
        </p>
        <button
          type="button"
          onClick={onReset}
          className="shrink-0 text-[11px] font-semibold text-muted-foreground underline-offset-4 hover:underline"
        >
          Check another domain
        </button>
      </div>

      {/* Domain Rating (only) */}
      <div className="rounded-none border border-black/6 bg-white p-6 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Domain Rating (DR)
        </p>
        <p className="mt-1.5 text-4xl font-bold tabular-nums tracking-tight">
          <span className={ratingTone(data.domain_rating)}>{formatRating(data.domain_rating)}</span>
          <span className="text-xl font-semibold text-muted-foreground">/100</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Authority score (0&ndash;100) from Ahrefs.
        </p>
      </div>

      <ToolGateCard
        theme="blue"
        signedOutMessage="Sign up to track your Domain Rating over time and benchmark it against competitors."
        upgradeMessage="Upgrade to Pro for Domain Rating tracking, referring-domain growth, and competitor authority benchmarks."
        signedInActiveMessage="Track domain authority on your connected projects."
        signedInActiveLabel="Open dashboard"
      />
    </div>
  );
}
