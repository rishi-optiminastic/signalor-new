"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getGithubInstallUrl, getGithubStatus } from "@fe/lib/api/github";
import { Github, Loader2 } from "@fe/components/icons";
import { Button } from "@fe/components/ui/button";
import { cn } from "@fe/lib/utils";

function extractError(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const data = (err as { response?: { data?: { error?: string } } }).response?.data;
    if (data?.error) return data.error;
  }
  return fallback;
}

/**
 * Slim "connect your repo" banner for the Fixes page. Once the repo is connected
 * the per-row "Fix with AI" buttons take over, so this renders nothing — no
 * bundled fix chips or PR list (those live on each recommendation card now).
 */
export function GithubConnectBanner({ slug }: { slug: string }) {
  const [notice, setNotice] = useState<string | null>(null);

  const { data: status, isLoading } = useQuery({
    queryKey: ["github-status", slug],
    queryFn: () => getGithubStatus(slug),
  });

  const connectMut = useMutation({
    mutationFn: () => getGithubInstallUrl(slug),
    onSuccess: (url) => {
      window.location.href = url;
    },
    onError: (e) => setNotice(extractError(e, "Could not start GitHub connection.")),
  });

  // Hidden until the App is configured server-side, and once a repo is connected.
  if (isLoading || !status || !status.configured || status.connected) return null;

  const card =
    "overflow-hidden rounded-sm border border-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-none";

  return (
    <div className={cn(card, "px-4 py-4")}>
      <div className="flex items-start gap-3">
        <Github className="mt-0.5 size-5 shrink-0 text-foreground" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            Auto-fix these issues with a Pull Request
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Connect your site&apos;s GitHub repo and each fixable item below gets a{" "}
            <span className="font-medium text-foreground">Fix with AI</span> button that opens a PR.
            You review and merge — nothing ships without you.
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground/80">
            Works for sites in a GitHub repo you own (Next.js). WordPress/Shopify use their own
            connectors.
          </p>
          <div className="mt-3">
            <Button
              type="button"
              size="sm"
              onClick={() => connectMut.mutate()}
              disabled={connectMut.isPending}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              {connectMut.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Github className="size-3.5" />
              )}
              Connect your repo
            </Button>
          </div>
          {notice ? <p className="mt-2 text-xs text-red-400">{notice}</p> : null}
        </div>
      </div>
    </div>
  );
}
