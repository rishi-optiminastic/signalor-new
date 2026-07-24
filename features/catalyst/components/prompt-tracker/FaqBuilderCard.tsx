'use client'

import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { PrimaryButton } from '@/features/catalyst/components/PrimaryButton'
import { generateAnswerGapFaq, type AnswerGapFaq } from '@/lib/api/prompts'
import { Check, Copy, Loader2, Sparkles } from '@/lib/icons'

function toMarkdown(faq: AnswerGapFaq): string {
  return faq.items.map(i => `### ${i.question}\n\n${i.answer}`).join('\n\n')
}

function CopyChip({ label, text }: { label: string; text: string }): JSX.Element {
  const [copied, setCopied] = useState(false)
  const copy = (): void => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    })
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--cat-border)] px-3 text-[12px] font-medium text-[var(--cat-ink-2)] transition-colors hover:bg-[var(--cat-hover)] hover:text-[var(--cat-ink)]"
    >
      {copied ? <Check size={13} className="text-[#2FBE7E]" /> : <Copy size={13} />}
      {copied ? 'Copied' : label}
    </button>
  )
}

function FaqResult({ faq }: { faq: AnswerGapFaq }): JSX.Element {
  return (
    <>
      <div className="flex flex-col divide-y divide-[var(--cat-border-soft)]">
        {faq.items.map(item => (
          <div key={item.question} className="py-2.5 first:pt-0 last:pb-0">
            <p className="text-[13px] font-semibold text-[var(--cat-ink)]">{item.question}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-[var(--cat-ink-2)]">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--cat-border-soft)] pt-3">
        <CopyChip label="Copy FAQ (Markdown)" text={toMarkdown(faq)} />
        <CopyChip label="Copy FAQPage JSON-LD" text={faq.jsonld} />
        <span className="text-[11px] text-[var(--cat-ink-3)]">
          Publish both on the page your buyers land on, then re-run the analysis.
        </span>
      </div>
    </>
  )
}

/**
 * Answer-gap FAQ builder — turns the run's weakest tracked prompts (the
 * questions AI answers without you) into publishable FAQ copy + FAQPage
 * schema, written for this brand.
 */
export function FaqBuilderCard({ slug }: { slug: string }): JSX.Element {
  const mutation = useMutation({
    mutationFn: () => generateAnswerGapFaq(slug),
    onError: () => toast.error('Could not generate the FAQ. Please try again.'),
  })

  return (
    <Card className="mt-3">
      <CardHead title="Answer-gap FAQ" />
      <p className="mb-3 text-[12px] leading-relaxed text-[var(--cat-ink-3)]">
        Your weakest tracked prompts are questions AI engines answer without mentioning you.
        Generate an FAQ section that answers them on your site — the content format LLMs extract
        most readily.
      </p>
      {mutation.data ? (
        <FaqResult faq={mutation.data} />
      ) : (
        <div>
          <PrimaryButton
            icon={mutation.isPending ? Loader2 : Sparkles}
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? 'Writing your FAQ…' : 'Generate FAQ from gaps'}
          </PrimaryButton>
        </div>
      )}
    </Card>
  )
}
