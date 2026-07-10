'use client'

import Link from 'next/link'

import { DataState } from '@/features/catalyst/components/DataState'
import { useActiveProject } from '@/hooks/useActiveProject'
import { useBrandPath } from '@/hooks/useBrandPath'
import { useContentOptimisation, type ContentOptimisation } from '@/hooks/useContentOptimisation'

import { AlertCircle, ExternalLink, FileText, X } from '@legacy/components/icons'
import { BrowserChrome } from '@legacy/components/optimisation/browser-chrome'
import { ElementEditor } from '@legacy/components/optimisation/element-editor'
import { PageIframe } from '@legacy/components/optimisation/page-iframe'
import { RawFilesPanel } from '@legacy/components/optimisation/raw-files-panel'
import type { PreviewElement } from '@legacy/lib/api/content-optimisation'

interface PreviewFields {
  previewImage: string
  previewElements: PreviewElement[]
  viewportWidth: number
  emptyMessage: string | undefined
  selectedElementId: number | null
}

/** Null-safe defaults for the preview iframe, kept out of JSX to stay simple. */
function previewFor(co: ContentOptimisation): PreviewFields {
  const f = co.pageFields
  const emptyMessage = co.pageError ?? undefined
  const selectedElementId = co.selectedElement?.id ?? null
  if (!f) {
    return {
      previewImage: '',
      previewElements: [],
      viewportWidth: 1440,
      emptyMessage,
      selectedElementId,
    }
  }
  return {
    previewImage: f.preview_image,
    previewElements: f.preview_elements,
    viewportWidth: f.preview_viewport_width,
    emptyMessage,
    selectedElementId,
  }
}

function ChromeHeader({ co }: { co: ContentOptimisation }): JSX.Element {
  return (
    <div className="border-border bg-background flex items-center gap-2 border-b pr-2">
      <div className="min-w-0 flex-1">
        <BrowserChrome
          url={co.url}
          baseUrl={co.baseUrl}
          pages={co.pages}
          canGoBack={co.canGoBack}
          canGoForward={co.canGoForward}
          isLoading={co.pageLoading}
          onUrlChange={co.setUrl}
          onBack={co.onBack}
          onForward={co.onForward}
          onRefresh={co.onRefresh}
        />
      </div>
      <button
        type="button"
        onClick={co.toggleRawFiles}
        className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition ${
          co.showRawFiles
            ? 'border-primary/40 bg-primary/10 text-primary'
            : 'border-border bg-background text-foreground hover:bg-muted/40'
        }`}
        title="Crawler & AI files (robots.txt, llms-txt, humans-txt, ads-txt)"
      >
        <FileText className="size-3.5" />
        Crawler files
      </button>
    </div>
  )
}

/** The "how edits apply" banner line — GitHub PR, connect-prompt, or nothing. */
function ModeHint({ co }: { co: ContentOptimisation }): JSX.Element | null {
  const brandPath = useBrandPath()
  if (!co.pageFields || co.applyMode === 'cms') return null
  if (co.applyMode === 'github') {
    return (
      <p className="text-muted-foreground flex items-center gap-2 text-[11px]">
        <AlertCircle className="size-3.5" />
        <span>
          Next.js repo connected ({co.githubRepo}). Edits open a pull request — review &amp; merge
          to apply.
        </span>
      </p>
    )
  }
  return (
    <p className="text-muted-foreground flex items-center gap-2 text-[11px]">
      <AlertCircle className="size-3.5" />
      <span>Click any element to edit. To apply, connect WordPress/Shopify or a GitHub repo.</span>
      <Link
        href={brandPath('integrations')}
        className="text-primary inline-flex items-center gap-0.5 font-semibold hover:underline"
      >
        Connect <ExternalLink className="size-3" />
      </Link>
    </p>
  )
}

function NoticeBar({ co }: { co: ContentOptimisation }): JSX.Element | null {
  const showModeHint = co.applyMode !== 'cms' && co.pageFields
  if (!co.error && !co.notice && !co.prUrl && !showModeHint) return null
  return (
    <div className="border-border bg-muted/15 flex flex-col gap-1 border-b px-3 py-2">
      <ModeHint co={co} />
      {co.error ? <p className="text-destructive text-[11px]">{co.error}</p> : null}
      {co.notice ? <p className="text-success text-[11px]">{co.notice}</p> : null}
      {co.prUrl ? (
        <Link
          href={co.prUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary inline-flex items-center gap-1 text-[11px] font-semibold hover:underline"
        >
          View pull request <ExternalLink className="size-3" />
        </Link>
      ) : null}
    </div>
  )
}

function RightRail({ co, slug }: { co: ContentOptimisation; slug: string }): JSX.Element | null {
  if (co.showRawFiles) {
    return (
      <div className="bg-background w-[380px] min-w-[320px] shrink-0 overflow-y-auto">
        <div className="border-border flex items-center justify-between border-b px-3 py-2">
          <p className="text-foreground text-xs font-semibold">Crawler &amp; AI files</p>
          <button
            type="button"
            onClick={co.toggleRawFiles}
            className="text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-md p-1"
            aria-label="Close"
          >
            <X className="size-3.5" />
          </button>
        </div>
        <RawFilesPanel slug={slug} pluginConnected={co.pluginConnected} />
      </div>
    )
  }
  if (!co.selectedElement) return null
  return (
    <div className="w-[360px] min-w-[300px] shrink-0">
      <ElementEditor
        element={co.selectedElement}
        applyDisabled={co.applyMode === 'none'}
        applyDisabledHint={co.applyDisabledHint}
        applyLabel={co.applyLabel}
        isRewriting={co.rewriting}
        isApplying={co.applying}
        onClose={() => co.setSelectedElement(null)}
        onRewrite={co.onRewrite}
        onApply={co.onApply}
      />
    </div>
  )
}

function PreviewPane({ co, slug }: { co: ContentOptimisation; slug: string }): JSX.Element {
  const railOpen = Boolean(co.selectedElement) || co.showRawFiles
  return (
    <div className="flex min-h-0 flex-1">
      <div className={`min-w-0 flex-1 ${railOpen ? 'border-border border-r' : ''}`}>
        <PageIframe
          {...previewFor(co)}
          isLoading={co.pageLoading}
          onRetry={co.url ? co.onRefresh : undefined}
          onSelectElement={co.setSelectedElement}
        />
      </div>
      <RightRail co={co} slug={slug} />
    </div>
  )
}

export function ContentOptimisationView(): JSX.Element {
  const { slug, run, isLoading } = useActiveProject()
  const co = useContentOptimisation({ slug, runUrl: run?.url })

  if (!slug) {
    return (
      <DataState
        isLoading={isLoading}
        isError={false}
        isEmpty
        emptyTitle="No analysis yet"
        emptyHint="Run an analysis on this brand to edit its pages here."
      >
        <div />
      </DataState>
    )
  }

  return (
    <div className="border-border/60 bg-card flex h-[calc(100dvh-150px)] min-h-0 flex-col overflow-hidden rounded-xl border shadow-sm">
      <ChromeHeader co={co} />
      <NoticeBar co={co} />
      <PreviewPane co={co} slug={slug} />
    </div>
  )
}
