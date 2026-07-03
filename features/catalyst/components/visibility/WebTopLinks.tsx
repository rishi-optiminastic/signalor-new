import { ExternalLink } from 'lucide-react'

import { WEB } from '@/features/catalyst/visibility-data'

export function WebTopLinks(): JSX.Element {
  return (
    <div className="flex flex-col">
      {WEB.topLinks.map(link => (
        <div
          key={link.domain}
          className="flex items-start gap-2.5 border-t border-[var(--cat-border-soft)] py-2.5 first:border-t-0"
        >
          <ExternalLink size={15} className="mt-0.5 shrink-0 text-[var(--cat-ink-3)]" />
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium text-[var(--cat-ink)]">
              {link.title}
            </div>
            <div className="text-[12px] text-[var(--cat-ink-3)]">{link.domain}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
