'use client'

import { LayoutGrid, List, Plus, Search } from 'lucide-react'
import { useState } from 'react'

import { DataState } from '@/features/catalyst/components/DataState'
import { PrimaryButton } from '@/features/catalyst/components/PrimaryButton'
import { useBrands } from '@/hooks/useBrands'

import { BrandCard } from './BrandCard'
import { BrandsTable } from './BrandsTable'

type View = 'table' | 'card'

function ViewToggle({ view, setView }: { view: View; setView: (v: View) => void }): JSX.Element {
  const seg = (v: View): string =>
    `grid h-8 w-8 place-items-center rounded-md transition-colors ${view === v ? 'bg-[var(--cat-card)] text-[var(--cat-ink)] shadow-sm' : 'text-[var(--cat-ink-3)]'}`
  return (
    <div className="flex items-center gap-1 rounded-md border border-[var(--cat-border)] bg-[var(--cat-bg)] p-1">
      <button
        type="button"
        onClick={() => setView('table')}
        className={seg('table')}
        aria-label="Table view"
      >
        <List size={16} />
      </button>
      <button
        type="button"
        onClick={() => setView('card')}
        className={seg('card')}
        aria-label="Card view"
      >
        <LayoutGrid size={16} />
      </button>
    </div>
  )
}

function Toolbar({
  view,
  setView,
  query,
  setQuery,
}: {
  view: View
  setView: (v: View) => void
  query: string
  setQuery: (q: string) => void
}): JSX.Element {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex h-9 items-center gap-2 rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] px-3">
        <Search size={15} className="text-[var(--cat-ink-3)]" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search brands…"
          className="w-40 bg-transparent text-[13px] text-[var(--cat-ink)] outline-none placeholder:text-[var(--cat-ink-3)] sm:w-56"
        />
      </div>
      <ViewToggle view={view} setView={setView} />
    </div>
  )
}

export function BrandsView(): JSX.Element {
  const [view, setView] = useState<View>('table')
  const [query, setQuery] = useState('')
  const { data, isLoading, isError } = useBrands()

  const q = query.trim().toLowerCase()
  const all = data ?? []
  const brands = all.filter(b => b.name.toLowerCase().includes(q) || b.url.includes(q))

  return (
    <div className="w-full">
      <header className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[var(--cat-ink)]">Brands</h1>
          <p className="mt-1 text-[13px] text-[var(--cat-ink-3)]">
            {all.length} {all.length === 1 ? 'brand' : 'brands'} in your workspace.
          </p>
        </div>
        <PrimaryButton icon={Plus}>New brand</PrimaryButton>
      </header>

      <Toolbar view={view} setView={setView} query={query} setQuery={setQuery} />

      <DataState
        isLoading={isLoading}
        isError={isError}
        isEmpty={all.length === 0}
        emptyTitle="No brands yet"
        emptyHint="Add a brand and run its first analysis to see it here."
      >
        {view === 'table' ? (
          <BrandsTable brands={brands} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map(b => (
              <BrandCard key={b.slug} brand={b} />
            ))}
          </div>
        )}
      </DataState>
    </div>
  )
}
