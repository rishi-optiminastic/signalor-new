'use client'

import { ArrowLeft, ArrowRight, Loader2, Pencil, Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { suggestPrompts } from '@/services/onboarding.service'
import { useOnboardingWizardStore } from '@/stores/useOnboardingWizardStore'

const MAX_PROMPTS = 15

/** Step 5: review/edit the prompts we'll track across AI engines. */
export function PromptsStep(): JSX.Element {
  const { companyName, siteUrl, prompts, setPrompts, setStep } = useOnboardingWizardStore()
  const [loading, setLoading] = useState(prompts.length === 0)
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    if (prompts.length > 0) return
    let active = true
    void suggestPrompts({ brandName: companyName, brandUrl: siteUrl }).then(suggested => {
      if (active) {
        setPrompts(suggested)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const removeAt = (idx: number): void => {
    setPrompts(prompts.filter((_, i) => i !== idx))
  }

  const startEdit = (idx: number): void => {
    setEditingIdx(idx)
    setEditText(prompts[idx])
  }

  const saveEdit = (idx: number): void => {
    const next = [...prompts]
    next[idx] = editText.trim()
    setPrompts(next.filter(Boolean))
    setEditingIdx(null)
  }

  const addPrompt = (): void => {
    if (prompts.length >= MAX_PROMPTS) return
    setPrompts([...prompts, ''])
    setEditingIdx(prompts.length)
    setEditText('')
  }

  const validCount = prompts.filter(Boolean).length

  return (
    <div className="space-y-3">
      <p className="text-center text-xs font-light text-neutral-400">
        Brand <span className="text-foreground font-medium">{companyName || 'your brand'}</span>
      </p>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-12">
          <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
          <p className="text-xs text-neutral-500">Generating prompts…</p>
        </div>
      ) : (
        <>
          <div className="shadow-input overflow-hidden rounded-xl border border-neutral-200 bg-white">
            {prompts.map((prompt, idx) => (
              <div key={idx} className={idx > 0 ? 'border-t border-neutral-200' : ''}>
                {editingIdx === idx ? (
                  <div className="flex items-center gap-2 px-3 py-2">
                    <input
                      value={editText}
                      autoFocus
                      onChange={e => setEditText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveEdit(idx)
                        if (e.key === 'Escape') setEditingIdx(null)
                      }}
                      className="text-foreground focus:border-primary focus:ring-ring/50 h-8 flex-1 rounded-md border border-neutral-200 bg-white px-2 text-[13px] outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white"
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(idx)}
                      className="text-foreground px-2 text-xs font-medium hover:underline"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="group flex items-center gap-3 px-3 py-2.5">
                    <span className="w-4 shrink-0 text-right font-mono text-[11px] text-neutral-400">
                      {idx + 1}
                    </span>
                    <span className="text-foreground min-w-0 flex-1 truncate text-[13px]">
                      {prompt}
                    </span>
                    <div className="flex shrink-0 gap-0.5 opacity-0 transition group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => startEdit(idx)}
                        className="rounded p-1 transition hover:bg-neutral-100"
                        aria-label="Edit prompt"
                      >
                        <Pencil className="h-3 w-3 text-neutral-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeAt(idx)}
                        className="hover:bg-destructive/10 rounded p-1 transition"
                        aria-label="Remove prompt"
                      >
                        <X className="h-3 w-3 text-neutral-500" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addPrompt}
            disabled={prompts.length >= MAX_PROMPTS}
            className="hover:text-foreground flex h-9 w-full items-center justify-center gap-2 rounded-md border border-dashed border-neutral-300 bg-white text-[13px] text-neutral-500 transition disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
            Add prompt
          </button>
        </>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setStep('install')}
          className="shadow-input text-foreground flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border border-neutral-200 bg-white text-[13px] font-medium transition hover:bg-neutral-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep('analytics')}
          disabled={loading || validCount === 0}
          className="auth-cta-btn flex h-10 flex-[2] items-center justify-center gap-1.5 rounded-md text-[15px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
