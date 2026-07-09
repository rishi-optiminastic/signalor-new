'use client'

import { Check, Loader2, Trash2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { deleteOrganization } from '@/lib/api/organizations'

interface DeleteProjectButtonProps {
  id: number
  name: string
}

/** Trash action on a project/brand row — inline confirm, deletes the org, refreshes. */
export function DeleteProjectButton({ id, name }: DeleteProjectButtonProps): JSX.Element {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)

  const handleDelete = async (): Promise<void> => {
    setBusy(true)
    try {
      await deleteOrganization(id)
      router.refresh()
    } catch {
      setBusy(false)
      setConfirming(false)
    }
  }

  if (busy) {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[#E5484D]">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    )
  }

  if (confirming) {
    return (
      <span className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={handleDelete}
          aria-label={`Confirm delete ${name}`}
          className="flex h-8 w-8 items-center justify-center rounded-md bg-[#E5484D] text-white transition hover:bg-[#d13b40]"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          aria-label="Cancel delete"
          className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--cat-ink-3)] transition hover:bg-[var(--cat-hover)] hover:text-[var(--cat-ink)]"
        >
          <X className="h-4 w-4" />
        </button>
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      aria-label={`Delete ${name}`}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[var(--cat-ink-3)] transition hover:bg-[rgba(229,72,77,0.1)] hover:text-[#E5484D]"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
