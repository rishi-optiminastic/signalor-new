'use client'

import { useCallback, useEffect, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'

import {
  PopoverForm,
  PopoverFormButton,
  PopoverFormSeparator,
  PopoverFormSuccess,
} from '@/components/ui/popover-form'
import { ICON_TILE } from '@/features/catalyst/components/control-styles'
import { MessageSquare } from '@/lib/icons'

/** How long the success state holds before the popover closes itself. */
const SUCCESS_DISMISS_MS = 2400

const PANEL_WIDTH = '340px'
const PANEL_HEIGHT = '188px'
/** Matches `rounded-md` on the neighbouring top-bar tiles. */
const TRIGGER_RADIUS = 6

const TRIGGER_ICON = <MessageSquare size={17} strokeWidth={1.8} />
const SUCCESS_CHILD = (
  <PopoverFormSuccess title="Thanks for the note" description="We read every piece of feedback." />
)

interface FeedbackFormProps {
  note: string
  onNoteChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function FeedbackForm({ note, onNoteChange, onSubmit }: FeedbackFormProps): JSX.Element {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex h-full flex-col">
      <label htmlFor="feedback-note" className="sr-only">
        Your feedback
      </label>
      <textarea
        id="feedback-note"
        autoFocus
        value={note}
        onChange={event => onNoteChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What's working, what isn't?"
        className="h-full w-full resize-none rounded-[10px] bg-transparent p-3 text-[13px] text-[var(--cat-ink)] outline-none placeholder:text-[var(--cat-ink-3)]"
      />
      <div className="relative flex h-12 shrink-0 items-center px-3">
        <PopoverFormSeparator />
        <PopoverFormButton loading={false} text="Send" />
      </div>
    </form>
  )
}

/** Holds the success state briefly, then hands back to the caller to reset. */
function useAutoDismiss(active: boolean, onDismiss: () => void): void {
  useEffect(() => {
    if (!active) return undefined
    const timer = setTimeout(onDismiss, SUCCESS_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [active, onDismiss])
}

/**
 * Feedback capture in the global top bar.
 *
 * The note is intentionally not sent anywhere yet — there is no feedback
 * endpoint in this app or the backend. This is the UI half only; point
 * `handleSubmit` at a service call once a destination exists.
 */
export function FeedbackPopover(): JSX.Element {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const reset = useCallback((): void => {
    setOpen(false)
    setShowSuccess(false)
    setNote('')
  }, [])

  useAutoDismiss(showSuccess, reset)

  // Click-away and Esc discard an unsent draft rather than resurface it later.
  const handleOpenChange = (next: boolean): void => (next ? setOpen(true) : reset())

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    if (note.trim()) setShowSuccess(true)
  }

  return (
    <PopoverForm
      title="Feedback"
      open={open}
      setOpen={handleOpenChange}
      showSuccess={showSuccess}
      width={PANEL_WIDTH}
      height={PANEL_HEIGHT}
      className="relative shrink-0"
      panelClassName="top-full right-0 z-50 mt-2"
      triggerClassName={ICON_TILE}
      triggerLabel="Send feedback"
      triggerRadius={TRIGGER_RADIUS}
      triggerChild={TRIGGER_ICON}
      successChild={SUCCESS_CHILD}
      openChild={<FeedbackForm note={note} onNoteChange={setNote} onSubmit={handleSubmit} />}
    />
  )
}
