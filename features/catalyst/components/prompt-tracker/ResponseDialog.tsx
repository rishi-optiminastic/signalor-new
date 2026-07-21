'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

import { EngineLogo } from '@/features/catalyst/components/EngineLogo'
import { ResponseText } from '@/features/catalyst/components/prompt-tracker/ResponseText'
import type { PromptEngineResult } from '@/features/catalyst/prompt-tracker-data'
import { formatTaskDate } from '@/features/catalyst/tasks-data'

interface ResponseDialogProps {
  result: PromptEngineResult
  onClose: () => void
}

function DialogHeader({ result, onClose }: ResponseDialogProps): JSX.Element {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[var(--cat-border)] p-4">
      <div className="flex items-center gap-2">
        <EngineLogo name={result.engineLabel} size={20} />
        <div>
          <h2 className="text-[14px] font-semibold text-[var(--cat-ink)]">{result.engineLabel}</h2>
          {result.checkedAt && (
            <p className="text-[11px] text-[var(--cat-ink-3)]">
              Checked {formatTaskDate(result.checkedAt)}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-[var(--cat-ink-3)] transition-colors hover:bg-[var(--cat-hover)] hover:text-[var(--cat-ink)]"
      >
        <X size={15} />
      </button>
    </div>
  )
}

/**
 * Full engine answer in a modal — matches the dashboard's existing modal shell.
 *
 * Rendered through a portal on purpose: the prompt row's `cat-rise` animation
 * applies a `transform`, which makes that ancestor the containing block for
 * `position: fixed` children. Without the portal the overlay anchors to the row
 * and gets clipped by its `overflow-hidden` instead of covering the viewport.
 */
function DialogPanel({ result, onClose }: ResponseDialogProps): JSX.Element {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${result.engineLabel} full response`}
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-lg border border-[var(--cat-border)] bg-[var(--cat-card)] shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <DialogHeader result={result} onClose={onClose} />
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {result.snippet ? (
            <ResponseText text={result.snippet} />
          ) : (
            <p className="text-[12px] text-[var(--cat-ink-3)]">
              No answer text captured for this run.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export function ResponseDialog({ result, onClose }: ResponseDialogProps): JSX.Element | null {
  useEffect(() => {
    function onKey(e: KeyboardEvent): void {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  // Only ever rendered from a click handler, so this is a pure SSR guard.
  if (typeof document === 'undefined') return null

  return createPortal(<DialogPanel result={result} onClose={onClose} />, document.body)
}
