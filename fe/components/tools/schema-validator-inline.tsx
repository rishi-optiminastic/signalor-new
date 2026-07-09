"use client";

import { useCallback, useState } from "react";
import { ArrowRight, CircleAlert, CircleCheck, CircleX, Globe, Loader2 } from "@fe/components/icons";

import { Button } from "@fe/components/ui/button";
import { ToolGateCard } from "@fe/components/tools/tool-gate-card";
import { cn } from "@fe/lib/utils";

interface SchemaFinding {
  type: string;
  status: "ok" | "partial" | "invalid";
  fieldCount: number;
  missing: string[];
}

interface Summary {
  url: string;
  totalBlocks: number;
  invalidBlocks: number;
  findings: SchemaFinding[];
}

type State =
  | { kind: "idle" }
  | { kind: "running" }
  | { kind: "done"; data: Summary }
  | { kind: "error"; message: string };

export function SchemaValidatorInline() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!url.trim()) return;
      setState({ kind: "running" });
      try {
        const res = await fetch("/api/tools/schema-validator", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        if (!res.ok) {
          setState({ kind: "error", message: data.error ?? "Validation failed." });
          return;
        }
        setState({ kind: "done", data: data as Summary });
      } catch {
        setState({ kind: "error", message: "Couldn't reach the server. Try again." });
      }
    },
    [url],
  );

  return (
    <div className="w-full">
      <form
        onSubmit={submit}
        className="flex w-full items-center gap-2 rounded-none border border-primary/25 bg-white p-1.5 shadow-sm"
      >
        <Globe className="ml-2 h-4 w-4 text-muted-foreground" aria-hidden />
        <input
          type="text"
          placeholder="Paste a page URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={state.kind === "running"}
          className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-60"
        />
        <Button
          type="submit"
          disabled={!url.trim() || state.kind === "running"}
          className="shrink-0 rounded-none bg-primary px-4 text-xs font-semibold text-white hover:brightness-110"
        >
          {state.kind === "running" ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Scanning
            </>
          ) : (
            <>
              Validate
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </>
          )}
        </Button>
      </form>

      {state.kind === "running" && (
        <div className="mt-5 rounded-none border border-black/6 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Fetching the page and parsing JSON-LD…
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

function StatusIcon({ status }: { status: SchemaFinding["status"] }) {
  if (status === "ok") return <CircleCheck className="h-4 w-4 text-success" />;
  if (status === "partial") return <CircleAlert className="h-4 w-4 text-warning" />;
  return <CircleX className="h-4 w-4 text-destructive" />;
}

function ResultView({ data, onReset }: { data: Summary; onReset: () => void }) {
  const ok = data.findings.filter((f) => f.status === "ok").length;
  const partial = data.findings.filter((f) => f.status === "partial").length;
  const invalid = data.findings.filter((f) => f.status === "invalid").length + data.invalidBlocks;

  return (
    <div className="mt-6 space-y-4">
      {/* Summary card */}
      <div className="rounded-none border border-black/6 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Schema health
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-foreground">{data.url}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {data.findings.length} schema{data.findings.length === 1 ? "" : "s"} found
              {data.invalidBlocks > 0
                ? ` · ${data.invalidBlocks} malformed block${data.invalidBlocks === 1 ? "" : "s"}`
                : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="shrink-0 text-[11px] font-semibold text-muted-foreground underline-offset-4 hover:underline"
          >
            Try another URL
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip label="Valid" value={ok} tone="emerald" />
          <Chip label="Partial" value={partial} tone="amber" />
          <Chip label="Invalid" value={invalid} tone="red" />
        </div>
      </div>

      {/* Findings list */}
      {data.findings.length > 0 ? (
        <div className="rounded-none border border-black/6 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-foreground">Schemas detected</p>
          <ul className="mt-3 divide-y divide-black/6">
            {data.findings.map((f) => (
              <li key={f.type} className="flex items-start gap-3 py-2.5">
                <StatusIcon status={f.status} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-foreground">{f.type}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {f.status === "ok"
                      ? `Valid · ${f.fieldCount} field${f.fieldCount === 1 ? "" : "s"}`
                      : f.missing.length > 0
                        ? `Missing: ${f.missing.join(", ")}`
                        : `${f.fieldCount} field${f.fieldCount === 1 ? "" : "s"} · unrecognized`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-none border border-black/6 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-foreground">No JSON-LD found</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            This page ships no structured data. AI engines rely on schema to cite you confidently ,
            add Organization, Product, or FAQ schema to make content citable.
          </p>
        </div>
      )}

      <ToolGateCard
        theme="violet"
        signedOutMessage="Sign up to scan every URL on your site, get per-template coverage, and auto-generate the JSON-LD you're missing."
        upgradeMessage="Upgrade to Pro for site-wide schema coverage, per-template roll-ups, and ready-to-paste fix snippets."
        signedInActiveMessage="Run schema coverage on your connected projects site-wide."
        signedInActiveLabel="Open dashboard"
      />
    </div>
  );
}

function Chip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "amber" | "red";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold",
        tone === "emerald" && "border-success/30 bg-success/10 text-success",
        tone === "amber" && "border-warning/30 bg-warning/10 text-warning",
        tone === "red" && "border-destructive/30 bg-destructive/10 text-destructive",
      )}
    >
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
