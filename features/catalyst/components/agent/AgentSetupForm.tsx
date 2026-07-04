'use client'

import { X } from 'lucide-react'
import { useState } from 'react'

import type { AgentBrief } from '@/features/catalyst/agent-data'
import { PrimaryButton } from '@/features/catalyst/components/PrimaryButton'

const INPUT =
  'w-full rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] px-3 py-2 text-[13px] text-[var(--cat-ink)] placeholder:text-[var(--cat-ink-3)] focus:border-[#e04a3d] focus:outline-none'

interface AgentSetupFormProps {
  brief: AgentBrief
  onSave: (brief: AgentBrief) => void
  onClose: () => void
}

function Field({ label, children }: { label: string; children: React.ReactNode }): JSX.Element {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-medium text-[var(--cat-ink-2)]">{label}</span>
      {children}
    </label>
  )
}

interface FieldsProps {
  website: string
  product: string
  goals: string
  onWebsite: (v: string) => void
  onProduct: (v: string) => void
  onGoals: (v: string) => void
}

function FormFields(p: FieldsProps): JSX.Element {
  return (
    <div className="mt-4 space-y-3">
      <Field label="Website">
        <input value={p.website} onChange={e => p.onWebsite(e.target.value)} className={INPUT} />
      </Field>
      <Field label="Product">
        <textarea
          value={p.product}
          onChange={e => p.onProduct(e.target.value)}
          rows={3}
          className={INPUT}
        />
      </Field>
      <Field label="Goals — one per line">
        <textarea
          value={p.goals}
          onChange={e => p.onGoals(e.target.value)}
          rows={3}
          className={INPUT}
        />
      </Field>
    </div>
  )
}

function ModalHead({ onClose }: { onClose: () => void }): JSX.Element {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-[15px] font-semibold text-[var(--cat-ink)]">Agent brief</h3>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="grid h-7 w-7 place-items-center rounded-md text-[var(--cat-ink-3)] transition-colors hover:bg-[var(--cat-hover)]"
      >
        <X size={16} />
      </button>
    </div>
  )
}

function ModalFooter({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: () => void
}): JSX.Element {
  return (
    <div className="mt-5 flex justify-end gap-2">
      <button
        type="button"
        onClick={onClose}
        className="inline-flex h-9 items-center rounded-md border border-[var(--cat-border)] px-3.5 text-[13px] font-medium text-[var(--cat-ink-2)] transition-colors hover:bg-[var(--cat-hover)]"
      >
        Cancel
      </button>
      <PrimaryButton onClick={onSave} className="h-9">
        Save brief
      </PrimaryButton>
    </div>
  )
}

function buildBrief(website: string, product: string, goals: string): AgentBrief {
  return {
    website: website.trim(),
    product: product.trim(),
    goals: goals
      .split('\n')
      .map(g => g.trim())
      .filter(Boolean),
  }
}

export function AgentSetupForm({ brief, onSave, onClose }: AgentSetupFormProps): JSX.Element {
  const [website, setWebsite] = useState(brief.website)
  const [product, setProduct] = useState(brief.product)
  const [goals, setGoals] = useState(brief.goals.join('\n'))

  const save = (): void => {
    onSave(buildBrief(website, product, goals))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div className="relative w-full max-w-md rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] p-5 shadow-xl">
        <ModalHead onClose={onClose} />
        <p className="mt-1 text-[12px] text-[var(--cat-ink-3)]">
          Signalor plans each day from these.
        </p>
        <FormFields
          website={website}
          product={product}
          goals={goals}
          onWebsite={setWebsite}
          onProduct={setProduct}
          onGoals={setGoals}
        />
        <ModalFooter onClose={onClose} onSave={save} />
      </div>
    </div>
  )
}
