"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { AlertCircle, ExternalLink, FileText, X } from "@fe/components/icons";
import { BrowserChrome } from "@fe/components/optimisation/browser-chrome";
import { PageIframe } from "@fe/components/optimisation/page-iframe";
import { ElementEditor } from "@fe/components/optimisation/element-editor";
import { RawFilesPanel } from "@fe/components/optimisation/raw-files-panel";
import { useRun } from "../../_components/run-context";
import {
  applyElementEdit,
  getContentPageFields,
  getContentPages,
  rewriteElement,
  type ContentPage,
  type ContentPageFields,
  type PreviewElement,
} from "@fe/lib/api/content-optimisation";
import { getGithubJobs, getGithubStatus, openContentPr } from "@fe/lib/api/github";

export default function ContentOptimisationPage() {
  const { slug } = useParams<{ slug: string }>();
  const { run } = useRun();

  const [url, setUrl] = useState("");
  const [pageFields, setPageFields] = useState<ContentPageFields | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // PR link surfaced after a successful GitHub content PR.
  const [prUrl, setPrUrl] = useState<string | null>(null);

  // Cursor-style element-level edit. The right rail only mounts while an
  // element is selected; otherwise the preview fills the full width.
  const [selectedElement, setSelectedElement] = useState<PreviewElement | null>(null);
  const [rewritingElement, setRewritingElement] = useState(false);
  const [applyingElement, setApplyingElement] = useState(false);

  // Raw crawler/AI files panel toggle (robots.txt, llms-txt, etc.). The
  // toggle replaces the element editor when active — there's only one
  // right rail and these two are mutually exclusive editing surfaces.
  const [showRawFiles, setShowRawFiles] = useState(false);

  // browser-style history for back/forward
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const navigatingFromHistory = useRef(false);

  // Cached across tab switches via QueryClient (5min staleTime, 30min gcTime).
  const { data: pages = [] as ContentPage[] } = useQuery({
    queryKey: ["content-pages", slug],
    enabled: !!slug,
    queryFn: () => getContentPages(slug).catch(() => [] as ContentPage[]),
  });

  // Is a GitHub (Next.js) repo connected? Drives the auto-switch: CMS plugin →
  // "Apply to live"; else GitHub repo → "Open PR".
  const { data: github } = useQuery({
    queryKey: ["github-status", slug],
    enabled: !!slug,
    queryFn: () => getGithubStatus(slug).catch(() => null),
    staleTime: 60_000,
  });

  // Lock the domain from the run's base URL so users can only edit the path.
  const baseUrl = useMemo(() => {
    const raw = run?.url ?? "";
    if (!raw) return "";
    try {
      return new URL(raw.includes("://") ? raw : `https://${raw}`).origin;
    } catch {
      return "";
    }
  }, [run?.url]);

  // Set URL immediately from run?.url without waiting for pages to load.
  // Normalize to include protocol so getPath() can strip the domain correctly.
  const didInitUrl = useRef(false);
  useEffect(() => {
    if (didInitUrl.current || !run?.url) return;
    didInitUrl.current = true;
    const raw = run.url.trim();
    setUrl(raw.includes("://") ? raw : `https://${raw}`);
  }, [run?.url]);

  // Seed the URL once pages arrive (fallback if run?.url arrives late).
  useEffect(() => {
    if (url) return;
    const initial = pages[0]?.url || run?.url || "";
    if (initial) setUrl(initial);
  }, [pages, run?.url, url]);

  const loadPage = useCallback(
    async (target: string) => {
      if (!slug || !target) return;
      setPageLoading(true);
      setPageError(null);
      setError(null);
      setNotice(null);
      setSelectedElement(null);
      try {
        const data = await getContentPageFields(slug, target);
        setPageFields(data);
        if (!data.preview_image) {
          setPageError(
            "Couldn't generate a visual preview for this page. Try again, or pick a different page.",
          );
        }
      } catch (err: unknown) {
        const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail;
        setPageError(detail || "Couldn't load this page.");
        setPageFields(null);
      } finally {
        setPageLoading(false);
      }
    },
    [slug],
  );

  async function handleRewriteElement(instruction: string): Promise<string> {
    if (!selectedElement) return "";
    setRewritingElement(true);
    setError(null);
    try {
      return await rewriteElement(slug, selectedElement.tag, selectedElement.text, instruction);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(detail || "Couldn't rewrite this element.");
      return "";
    } finally {
      setRewritingElement(false);
    }
  }

  async function handleApplyElementViaGithub(originalText: string, newText: string) {
    setApplyingElement(true);
    setError(null);
    setNotice(null);
    setPrUrl(null);
    try {
      const { job_id } = await openContentPr(slug, url, [
        { kind: "text", original: originalText, new: newText },
      ]);
      // The old text is gone from our draft now; clear selection.
      setSelectedElement(null);
      setNotice("Opening a pull request — the agent is editing your repo and type-checking it…");

      // The agent loop + sandbox build-verify can take a couple of minutes; poll
      // the job until it opens the PR or fails. The job keeps running server-side
      // even if we stop polling.
      const maxAttempts = 50;
      const delayMs = 3500;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        await new Promise((r) => setTimeout(r, delayMs));
        try {
          const jobs = await getGithubJobs(slug);
          const job = jobs.find((j) => j.id === job_id);
          if (!job) continue;
          if (job.status === "open" && job.pr_url) {
            setPrUrl(job.pr_url);
            setNotice("Pull request opened — review and merge it on GitHub.");
            return;
          }
          if (job.status === "failed") {
            setError(job.error_message || "Couldn't open a pull request for this change.");
            return;
          }
          setNotice(`Preparing the pull request… (${job.status})`);
        } catch {
          // Network blip — keep polling.
        }
      }
      setNotice("The pull request is still being prepared — check back on the Fixes page shortly.");
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(detail || "Couldn't open a pull request for this change.");
    } finally {
      setApplyingElement(false);
    }
  }

  async function handleApplyElement(newText: string) {
    if (!selectedElement || !url) return;
    if (applyMode === "github") {
      await handleApplyElementViaGithub(selectedElement.text, newText);
      return;
    }
    setApplyingElement(true);
    setError(null);
    setNotice(null);
    try {
      const result = await applyElementEdit(slug, url, selectedElement.text, newText);
      const ok = (result.saved?.length || 0) > 0 && (result.failed?.length || 0) === 0;
      if (ok) {
        // Clear selection immediately — the old text the user clicked is
        // gone now; leaving it around makes the next Apply send stale
        // original_text and get a 400 back.
        setSelectedElement(null);
        setNotice("Applied to live site. Refreshing preview…");

        // Poll for fresh content. Shopify's storefront CDN can take 5–15s
        // to invalidate after a theme-asset / body_html change, so we
        // retry up to ~20s until the new text appears, then stop.
        //
        // Detection covers both edit paths:
        //   - body_html edits: new text appears in pageFields.body_html
        //   - theme-asset edits: new text appears in preview_elements (the
        //     fresh Playwright screenshot's clickable text list)
        const maxAttempts = 8;
        const delayMs = 2500;
        let refreshed = false;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          await new Promise((r) => setTimeout(r, delayMs));
          try {
            const fresh = await getContentPageFields(slug, url);
            const inBody = (fresh.body_html || "").includes(newText);
            const inElements = (fresh.preview_elements || []).some((el) =>
              (el.text || "").includes(newText),
            );
            if (inBody || inElements) {
              setPageFields(fresh);
              setNotice("Preview refreshed.");
              refreshed = true;
              break;
            }
            // Still stale — keep the latest screenshot regardless so the
            // user gets visual progress, but keep polling.
            setPageFields(fresh);
            setNotice(`Refreshing preview… (attempt ${attempt}/${maxAttempts})`);
          } catch {
            // Network blip — keep trying.
          }
        }
        if (!refreshed) {
          setNotice(
            "Edit applied. Shopify's CDN is still serving cached content — click the refresh button in a moment to see the change.",
          );
        }
      } else {
        const msg = result.failed?.[0]?.message || "Plugin returned an error.";
        setError(`Couldn't apply edit: ${msg}`);
      }
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      if (status === 503) {
        setError(detail || "Connect WordPress or Shopify to apply this change.");
      } else {
        setError(detail || "Couldn't apply this edit.");
      }
    } finally {
      setApplyingElement(false);
    }
  }

  useEffect(() => {
    if (!url) return;
    loadPage(url);
    if (!navigatingFromHistory.current) {
      setHistory((h) => {
        const next = h.slice(0, historyIdx + 1);
        next.push(url);
        return next;
      });
      setHistoryIdx((idx) => idx + 1);
    }
    navigatingFromHistory.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  function handleBack() {
    if (historyIdx <= 0) return;
    navigatingFromHistory.current = true;
    setHistoryIdx(historyIdx - 1);
    setUrl(history[historyIdx - 1]);
  }

  function handleForward() {
    if (historyIdx >= history.length - 1) return;
    navigatingFromHistory.current = true;
    setHistoryIdx(historyIdx + 1);
    setUrl(history[historyIdx + 1]);
  }

  function handleRefresh() {
    if (url) loadPage(url);
  }

  const pluginConnected = !!pageFields?.plugin_connected;
  const githubConnected = !!github?.connected;
  // CMS plugin wins (direct live edit); else a GitHub repo opens a PR; else nothing.
  const applyMode: "cms" | "github" | "none" = pluginConnected
    ? "cms"
    : githubConnected
      ? "github"
      : "none";
  const applyLabel = applyMode === "github" ? "Open PR" : "Apply to live site";
  const applyDisabledHint =
    applyMode === "none"
      ? "Connect WordPress/Shopify, or a GitHub repo, to apply changes."
      : applyMode === "github"
        ? `Opens a pull request on ${github?.repo_full_name || "your repo"} with this change.`
        : undefined;

  return (
    <div className="flex h-[calc(100dvh-124px)] min-h-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
      <div
        className="flex items-center gap-2 border-b border-border bg-background pr-2"
        data-tour-card="content-chrome"
      >
        <div className="min-w-0 flex-1">
          <BrowserChrome
            url={url}
            baseUrl={baseUrl}
            pages={pages}
            canGoBack={historyIdx > 0}
            canGoForward={historyIdx >= 0 && historyIdx < history.length - 1}
            isLoading={pageLoading}
            onUrlChange={(next) => setUrl(next)}
            onBack={handleBack}
            onForward={handleForward}
            onRefresh={handleRefresh}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setShowRawFiles((v) => !v);
            if (!showRawFiles) setSelectedElement(null);
          }}
          className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition ${
            showRawFiles
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border bg-background text-foreground hover:bg-muted/40"
          }`}
          title="Crawler & AI files (robots.txt, llms-txt, humans-txt, ads-txt)"
        >
          <FileText className="size-3.5" />
          Crawler files
        </button>
      </div>

      {(error || notice || prUrl || (applyMode !== "cms" && pageFields)) && (
        <div className="flex flex-col gap-1 border-b border-border bg-muted/15 px-3 py-2">
          {applyMode === "github" && pageFields ? (
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <AlertCircle className="size-3.5" />
              <span>
                Next.js repo connected ({github?.repo_full_name}). Edits open a pull request —
                review &amp; merge to apply.
              </span>
            </div>
          ) : applyMode === "none" && pageFields ? (
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <AlertCircle className="size-3.5" />
              <span>
                Click any element to edit. To apply, connect WordPress/Shopify or a GitHub repo.
              </span>
              <Link
                href={`/dashboard/${slug}/settings/integrations`}
                className="inline-flex items-center gap-0.5 font-semibold text-primary hover:underline"
              >
                Connect <ExternalLink className="size-3" />
              </Link>
            </div>
          ) : null}
          {error ? (
            <p className="text-[11px] text-destructive dark:text-destructive">{error}</p>
          ) : null}
          {notice ? <p className="text-[11px] text-success dark:text-success">{notice}</p> : null}
          {prUrl ? (
            <Link
              href={prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
            >
              View pull request <ExternalLink className="size-3" />
            </Link>
          ) : null}
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <div
          className={`flex-1 min-w-0 ${selectedElement || showRawFiles ? "border-r border-border" : ""}`}
          data-tour-card="content-iframe"
        >
          <PageIframe
            previewImage={pageFields?.preview_image || ""}
            previewElements={pageFields?.preview_elements || []}
            viewportWidth={pageFields?.preview_viewport_width || 1440}
            isLoading={pageLoading}
            emptyMessage={pageError || undefined}
            onRetry={url ? () => loadPage(url) : undefined}
            selectedElementId={selectedElement?.id ?? null}
            onSelectElement={setSelectedElement}
          />
        </div>

        {showRawFiles ? (
          <div className="w-[380px] min-w-[320px] shrink-0 overflow-y-auto bg-background">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <p className="text-xs font-semibold text-foreground">Crawler & AI files</p>
              <button
                type="button"
                onClick={() => setShowRawFiles(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                aria-label="Close"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <RawFilesPanel slug={slug} pluginConnected={pluginConnected} />
          </div>
        ) : selectedElement ? (
          <div className="w-[360px] min-w-[300px] shrink-0">
            <ElementEditor
              element={selectedElement}
              applyDisabled={applyMode === "none"}
              applyDisabledHint={applyDisabledHint}
              applyLabel={applyLabel}
              isRewriting={rewritingElement}
              isApplying={applyingElement}
              onClose={() => setSelectedElement(null)}
              onRewrite={handleRewriteElement}
              onApply={handleApplyElement}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
