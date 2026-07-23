'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { CheckCircle2, Loader2, Unlink2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { disconnectOrgGithub, getOrgGithubInstallUrl, getOrgGithubStatus } from '@/lib/api/github'
import { useOnboardingWizardStore } from '@/stores/useOnboardingWizardStore'

const CARD = 'shadow-input rounded-xl border border-black/8 bg-white p-5'
// How often to check whether the user closed the GitHub popup themselves.
const POPUP_POLL_MS = 700

/** The official GitHub "Invertocat" mark — the real logo (lucide's is a stylised
 *  outline). `currentColor` so it inherits the surrounding text colour. */
function GithubMark({ size = 18 }: { size?: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.2 11.16.6.11.82-.26.82-.58 0-.28-.01-1.02-.02-2-3.34.73-4.04-1.6-4.04-1.6-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.12-.31-.54-1.53.12-3.19 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.19.77.84 1.24 1.91 1.24 3.23 0 4.63-2.81 5.65-5.49 5.95.43.37.82 1.1.82 2.22 0 1.61-.02 2.9-.02 3.29 0 .32.22.7.82.58A12.02 12.02 0 0024 12.29C24 5.78 18.63.5 12 .5z" />
    </svg>
  )
}

/** Open the GitHub install flow centred over the current window. */
function openCenteredPopup(url: string): Window | null {
  const w = 1000
  const h = 720
  const left = window.screenX + Math.max(0, (window.outerWidth - w) / 2)
  const top = window.screenY + Math.max(0, (window.outerHeight - h) / 2)
  return window.open(
    url,
    'signalor-github',
    `popup=yes,width=${w},height=${h},left=${Math.round(left)},top=${Math.round(top)}`,
  )
}

interface GithubConnectState {
  loading: boolean
  connected: boolean
  repo: string
  notConfigured: boolean
  connecting: boolean
  error: boolean
  connect: () => void
  cancel: () => void
  unlink: () => void
  unlinking: boolean
}

/** Connect flow: poll org status, open the install in a popup, and auto-close it
 *  the moment the backend links the installation (or the user closes it). */
function useGithubConnect(email: string): GithubConnectState {
  const setAppInstalled = useOnboardingWizardStore(s => s.setAppInstalled)
  const [connecting, setConnecting] = useState(false)
  const popupRef = useRef<Window | null>(null)
  const watchRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const status = useQuery({
    queryKey: ['onboarding-github', email],
    queryFn: () => getOrgGithubStatus(email),
    enabled: Boolean(email),
    refetchInterval: q => (q.state.data?.connected ? false : connecting ? 2000 : 5000),
  })
  const connected = status.data?.connected ?? false

  const stopWatch = useCallback(() => {
    if (watchRef.current) clearInterval(watchRef.current)
    watchRef.current = null
  }, [])

  const cancel = useCallback(() => {
    popupRef.current?.close()
    popupRef.current = null
    stopWatch()
    setConnecting(false)
  }, [stopWatch])

  // Already connected (incl. "already installed" on load) → close the popup and
  // mark the step done; never prompt to install again.
  useEffect(() => {
    if (!connected) return
    setAppInstalled(true)
    setConnecting(false)
    stopWatch()
    popupRef.current?.close()
    popupRef.current = null
  }, [connected, setAppInstalled, stopWatch])

  useEffect(() => stopWatch, [stopWatch])

  const mutation = useMutation({
    mutationFn: () => getOrgGithubInstallUrl(email),
    onMutate: () => setConnecting(true),
    onSuccess: (url: string) => {
      const popup = openCenteredPopup(url)
      if (!popup) {
        window.location.href = url // popup blocked → fall back to a full redirect
        return
      }
      popupRef.current = popup
      stopWatch()
      watchRef.current = setInterval(() => {
        if (!popup.closed) return
        stopWatch()
        setConnecting(false)
        void status.refetch()
      }, POPUP_POLL_MS)
    },
    onError: () => setConnecting(false),
  })

  const unlinkMutation = useMutation({
    mutationFn: () => disconnectOrgGithub(email),
    onSuccess: () => {
      setAppInstalled(false)
      void status.refetch()
    },
  })

  return {
    loading: status.isLoading,
    connected,
    repo: status.data?.repo_full_name ?? '',
    notConfigured: Boolean(status.data && !status.data.configured),
    connecting: connecting || mutation.isPending,
    error: mutation.isError,
    connect: () => mutation.mutate(),
    cancel,
    unlink: () => unlinkMutation.mutate(),
    unlinking: unlinkMutation.isPending,
  }
}

function LoadingCard(): JSX.Element {
  return (
    <div className={`${CARD} flex items-center justify-center gap-2 py-6`}>
      <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
      <span className="text-xs text-neutral-500">Checking GitHub connection…</span>
    </div>
  )
}

interface ConnectedCardProps {
  repo: string
  onUnlink: () => void
  unlinking: boolean
}

function ConnectedCard({ repo, onUnlink, unlinking }: ConnectedCardProps): JSX.Element {
  return (
    <div className={`${CARD} flex items-start gap-3`}>
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#047857]" />
      <div className="min-w-0 flex-1">
        <p className="text-foreground text-[13px] font-semibold">GitHub repo connected</p>
        <p className="mt-0.5 truncate text-xs text-neutral-500">
          {repo || 'SignalorAI can now open fix PRs on your repo.'}
        </p>
        <button
          type="button"
          onClick={onUnlink}
          disabled={unlinking}
          className="hover:text-foreground mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 transition disabled:opacity-60"
        >
          {unlinking ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Unlink2 className="h-3 w-3" />
          )}
          Wrong repo? Disconnect &amp; reconnect
        </button>
      </div>
    </div>
  )
}

function ConnectingCard({ onCancel }: { onCancel: () => void }): JSX.Element {
  return (
    <div className={`${CARD} space-y-2.5`}>
      <div className="flex items-center gap-2.5">
        <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />
        <p className="text-foreground text-[13px] font-medium">
          Finishing up in the GitHub window…
        </p>
      </div>
      <p className="text-xs leading-relaxed text-neutral-500">
        Pick your repository and approve access. This closes automatically once you&apos;re
        connected.
      </p>
      <button
        type="button"
        onClick={onCancel}
        className="hover:text-foreground text-xs font-medium text-neutral-500 transition"
      >
        Cancel
      </button>
    </div>
  )
}

interface ConnectCardProps {
  onConnect: () => void
  error: boolean
  notConfigured: boolean
}

function ConnectCard({ onConnect, error, notConfigured }: ConnectCardProps): JSX.Element {
  return (
    <div className={`${CARD} space-y-3`}>
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#1f2328] text-white">
          <GithubMark size={18} />
        </span>
        <div>
          <p className="text-foreground text-[13px] font-semibold">Connect your GitHub repo</p>
          <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">
            Install the SignalorAI GitHub App
          </p>
        </div>
      </div>
      {notConfigured ? (
        <p className="rounded-md bg-neutral-50 px-3 py-2 text-[11px] text-neutral-500">
          GitHub connect isn&apos;t enabled on this server yet — you can skip for now.
        </p>
      ) : (
        <button
          type="button"
          onClick={onConnect}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#1f2328] text-[13px] font-medium text-white transition hover:bg-[#32383f]"
        >
          <GithubMark size={16} />
          Connect GitHub
        </button>
      )}
      {error && (
        <p className="text-xs font-medium text-[#E5484D]">
          Couldn&apos;t start the GitHub connection. You can skip and connect later.
        </p>
      )}
    </div>
  )
}

/** Next.js → connect the GitHub App (in a popup) so SignalorAI can open fix PRs. */
export function GithubConnector({ email }: { email: string }): JSX.Element {
  const s = useGithubConnect(email)
  if (s.loading) return <LoadingCard />
  if (s.connected)
    return <ConnectedCard repo={s.repo} onUnlink={s.unlink} unlinking={s.unlinking} />
  if (s.connecting) return <ConnectingCard onCancel={s.cancel} />
  return <ConnectCard onConnect={s.connect} error={s.error} notConfigured={s.notConfigured} />
}
