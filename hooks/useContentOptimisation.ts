'use client'

import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  errField,
  errStatus,
  pollCmsRefresh,
  pollGithubJob,
} from '@/features/catalyst/components/optimisation/apply-helpers'

import {
  applyElementEdit,
  getContentPageFields,
  getContentPages,
  rewriteElement,
  type ContentPage,
  type ContentPageFields,
  type PreviewElement,
} from '@fe/lib/api/content-optimisation'
import { getGithubStatus, openContentPr } from '@fe/lib/api/github'

export type ApplyMode = 'cms' | 'github' | 'none'

export interface ContentOptimisation {
  url: string
  baseUrl: string
  pages: ContentPage[]
  pageFields: ContentPageFields | null
  pageLoading: boolean
  pageError: string | null
  notice: string | null
  error: string | null
  prUrl: string | null
  selectedElement: PreviewElement | null
  showRawFiles: boolean
  rewriting: boolean
  applying: boolean
  canGoBack: boolean
  canGoForward: boolean
  pluginConnected: boolean
  githubRepo: string
  applyMode: ApplyMode
  applyLabel: string
  applyDisabledHint: string | undefined
  setUrl: (next: string) => void
  setSelectedElement: (element: PreviewElement | null) => void
  toggleRawFiles: () => void
  onBack: () => void
  onForward: () => void
  onRefresh: () => void
  onRewrite: (instruction: string) => Promise<string>
  onApply: (newText: string) => Promise<void>
}

function toOrigin(raw: string): string {
  if (!raw) return ''
  try {
    return new URL(raw.includes('://') ? raw : `https://${raw}`).origin
  } catch {
    return ''
  }
}

/** Cursor-style content editor state for the active project's latest run. */
export function useContentOptimisation({
  slug,
  runUrl,
}: {
  slug: string | undefined
  runUrl: string | undefined
}): ContentOptimisation {
  const [url, setUrl] = useState('')
  const [pageFields, setPageFields] = useState<ContentPageFields | null>(null)
  const [pageLoading, setPageLoading] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [prUrl, setPrUrl] = useState<string | null>(null)
  const [selectedElement, setSelectedElement] = useState<PreviewElement | null>(null)
  const [rewriting, setRewriting] = useState(false)
  const [applying, setApplying] = useState(false)
  const [showRawFiles, setShowRawFiles] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const fromHistory = useRef(false)
  const didInit = useRef(false)

  const { data: pages = [] as ContentPage[] } = useQuery({
    queryKey: ['content', 'pages', slug],
    enabled: Boolean(slug),
    queryFn: () => getContentPages(slug as string).catch(() => [] as ContentPage[]),
  })

  const { data: github } = useQuery({
    queryKey: ['content', 'github-status', slug],
    enabled: Boolean(slug),
    staleTime: 60_000,
    queryFn: () => getGithubStatus(slug as string).catch(() => null),
  })

  const baseUrl = useMemo(() => toOrigin(runUrl ?? ''), [runUrl])

  useEffect(() => {
    if (didInit.current || !runUrl) return
    didInit.current = true
    const raw = runUrl.trim()
    setUrl(raw.includes('://') ? raw : `https://${raw}`)
  }, [runUrl])

  useEffect(() => {
    if (url) return
    const initial = pages[0]?.url || runUrl || ''
    if (initial) setUrl(initial)
  }, [pages, runUrl, url])

  const loadPage = useCallback(
    async (target: string) => {
      if (!slug || !target) return
      setPageLoading(true)
      setPageError(null)
      setError(null)
      setNotice(null)
      setSelectedElement(null)
      try {
        const data = await getContentPageFields(slug, target)
        setPageFields(data)
        if (!data.preview_image) {
          setPageError("Couldn't generate a visual preview for this page. Try a different page.")
        }
      } catch (err) {
        setPageError(errField(err) || "Couldn't load this page.")
        setPageFields(null)
      } finally {
        setPageLoading(false)
      }
    },
    [slug],
  )

  useEffect(() => {
    if (!url) return
    void loadPage(url)
    if (!fromHistory.current) {
      setHistory(h => [...h.slice(0, historyIdx + 1), url])
      setHistoryIdx(idx => idx + 1)
    }
    fromHistory.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  const onRewrite = useCallback(
    async (instruction: string): Promise<string> => {
      if (!slug || !selectedElement) return ''
      setRewriting(true)
      setError(null)
      try {
        return await rewriteElement(slug, selectedElement.tag, selectedElement.text, instruction)
      } catch (err) {
        setError(errField(err) || "Couldn't rewrite this element.")
        return ''
      } finally {
        setRewriting(false)
      }
    },
    [slug, selectedElement],
  )

  const pluginConnected = Boolean(pageFields?.plugin_connected)
  const githubConnected = Boolean(github?.connected)
  const applyMode: ApplyMode = pluginConnected ? 'cms' : githubConnected ? 'github' : 'none'

  const applyViaGithub = useCallback(
    async (originalText: string, newText: string) => {
      if (!slug) return
      setApplying(true)
      setError(null)
      setNotice(null)
      setPrUrl(null)
      try {
        const { job_id } = await openContentPr(slug, url, [
          { kind: 'text', original: originalText, new: newText },
        ])
        setSelectedElement(null)
        setNotice('Opening a pull request — the agent is editing your repo and type-checking it…')
        await pollGithubJob(slug, job_id, {
          onOpen: pr => {
            setPrUrl(pr)
            setNotice('Pull request opened — review and merge it on GitHub.')
          },
          onFail: msg => setError(msg),
          onProgress: status => setNotice(`Preparing the pull request… (${status})`),
          onTimeout: () =>
            setNotice('The pull request is still being prepared — check the Fixes page shortly.'),
        })
      } catch (err) {
        setError(errField(err, 'error') || "Couldn't open a pull request for this change.")
      } finally {
        setApplying(false)
      }
    },
    [slug, url],
  )

  const applyViaCms = useCallback(
    async (originalText: string, newText: string) => {
      if (!slug) return
      setApplying(true)
      setError(null)
      setNotice(null)
      try {
        const result = await applyElementEdit(slug, url, originalText, newText)
        const ok = (result.saved?.length || 0) > 0 && (result.failed?.length || 0) === 0
        if (!ok) {
          setError(
            `Couldn't apply edit: ${result.failed?.[0]?.message || 'Plugin returned an error.'}`,
          )
          return
        }
        setSelectedElement(null)
        setNotice('Applied to live site. Refreshing preview…')
        const refreshed = await pollCmsRefresh(
          { slug, url, newText },
          {
            onFields: setPageFields,
            onProgress: (a, t) => setNotice(`Refreshing preview… (attempt ${a}/${t})`),
          },
        )
        setNotice(
          refreshed
            ? 'Preview refreshed.'
            : 'Edit applied. The CDN is still serving cached content — refresh in a moment.',
        )
      } catch (err) {
        const hint =
          errStatus(err) === 503 ? 'Connect WordPress or Shopify to apply this change.' : undefined
        setError(errField(err) || hint || "Couldn't apply this edit.")
      } finally {
        setApplying(false)
      }
    },
    [slug, url],
  )

  const onApply = useCallback(
    async (newText: string) => {
      if (!selectedElement || !url) return
      if (applyMode === 'github') return applyViaGithub(selectedElement.text, newText)
      return applyViaCms(selectedElement.text, newText)
    },
    [selectedElement, url, applyMode, applyViaGithub, applyViaCms],
  )

  const goto = useCallback(
    (nextIdx: number) => {
      fromHistory.current = true
      setHistoryIdx(nextIdx)
      setUrl(history[nextIdx])
    },
    [history],
  )

  const applyLabel = applyMode === 'github' ? 'Open PR' : 'Apply to live site'
  const applyDisabledHint =
    applyMode === 'none'
      ? 'Connect WordPress/Shopify, or a GitHub repo, to apply changes.'
      : applyMode === 'github'
        ? `Opens a pull request on ${github?.repo_full_name || 'your repo'} with this change.`
        : undefined

  return {
    url,
    baseUrl,
    pages,
    pageFields,
    pageLoading,
    pageError,
    notice,
    error,
    prUrl,
    selectedElement,
    showRawFiles,
    rewriting,
    applying,
    canGoBack: historyIdx > 0,
    canGoForward: historyIdx >= 0 && historyIdx < history.length - 1,
    pluginConnected,
    githubRepo: github?.repo_full_name ?? '',
    applyMode,
    applyLabel,
    applyDisabledHint,
    setUrl,
    setSelectedElement,
    toggleRawFiles: () => {
      setShowRawFiles(v => !v)
      setSelectedElement(null)
    },
    onBack: () => historyIdx > 0 && goto(historyIdx - 1),
    onForward: () => historyIdx < history.length - 1 && goto(historyIdx + 1),
    onRefresh: () => url && void loadPage(url),
    onRewrite,
    onApply,
  }
}
