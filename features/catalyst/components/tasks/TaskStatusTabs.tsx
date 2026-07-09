import { BRAND, BRAND_SOFT, BRAND_STRONG } from '@/features/catalyst/constants'
import type { StatusTab } from '@/features/catalyst/tasks-data'

export function TaskStatusTabs({ tabs }: { tabs: StatusTab[] }): JSX.Element {
  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.label}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors"
          style={
            tab.active
              ? { background: BRAND_SOFT, color: BRAND_STRONG }
              : { color: 'var(--cat-ink-2)' }
          }
        >
          {tab.label}
          <span
            className="grid h-[18px] min-w-[18px] place-items-center rounded-sm px-1 text-[10px] font-semibold"
            style={
              tab.active
                ? { background: BRAND, color: '#fff' }
                : { background: 'var(--cat-track)', color: 'var(--cat-ink-2)' }
            }
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  )
}
