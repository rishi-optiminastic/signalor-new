'use client'

import { useState } from 'react'

import {
  CITATIONS_RANK,
  INSIGHT_TABS,
  PERSONAS_RANK,
  PLATFORMS,
  PLATFORMS_RANK,
  PROMPTS_RANK,
  REGIONS_RANK,
  SENTIMENT,
  SHARE_OF_VOICE,
  SHARE_OF_VOICE_RANK,
  VISIBILITY_RANK,
} from '@/features/catalyst/agent-insights-data'
import type { InsightTab, RankRow } from '@/features/catalyst/agent-insights-data'
import { AllocationBlock } from '@/features/catalyst/components/agent/insights/AllocationBlock'
import { InsightCard } from '@/features/catalyst/components/agent/insights/InsightCard'
import { RankTable } from '@/features/catalyst/components/agent/insights/RankTable'
import { VisibilityScoreCard } from '@/features/catalyst/components/agent/insights/VisibilityScoreCard'

const RANK_TABS: Record<
  string,
  { rows: RankRow[]; nameHeader: string; valueHeader: string; caption: string }
> = {
  Prompts: {
    rows: PROMPTS_RANK,
    nameHeader: 'Prompt',
    valueHeader: 'Visibility',
    caption: 'Prompts where you show up most',
  },
  Regions: {
    rows: REGIONS_RANK,
    nameHeader: 'Region',
    valueHeader: 'Visibility',
    caption: 'Visibility by market',
  },
  Personas: {
    rows: PERSONAS_RANK,
    nameHeader: 'Persona',
    valueHeader: 'Visibility',
    caption: 'Who sees you cited',
  },
  Citations: {
    rows: CITATIONS_RANK,
    nameHeader: 'Source',
    valueHeader: 'Cited',
    caption: 'Sources AI engines cite you from',
  },
}

function ExpandButton(): JSX.Element {
  return (
    <button className="rounded-md border border-[var(--cat-border)] px-2 py-1 text-[11px] font-medium text-[var(--cat-ink-2)] transition-colors hover:bg-[var(--cat-hover)]">
      Expand
    </button>
  )
}

function VisibilityTab(): JSX.Element {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <VisibilityScoreCard />
      <InsightCard
        title="Visibility score rank"
        subtitle="14 brands tracked"
        right={<ExpandButton />}
      >
        <RankTable rows={VISIBILITY_RANK} nameHeader="Brand" valueHeader="Score" />
      </InsightCard>
      <InsightCard title="Share of voice" subtitle="Your mentions vs competitors in AI answers">
        <AllocationBlock
          items={SHARE_OF_VOICE.items}
          headline={SHARE_OF_VOICE.headline}
          delta={SHARE_OF_VOICE.delta}
          positive={SHARE_OF_VOICE.positive}
          note="last 4 days"
        />
      </InsightCard>
      <InsightCard
        title="Share of voice rank"
        subtitle="14 assets tracked"
        right={<ExpandButton />}
      >
        <RankTable rows={SHARE_OF_VOICE_RANK} nameHeader="Asset" valueHeader="Share" />
      </InsightCard>
    </div>
  )
}

function TabContent({ tab }: { tab: InsightTab }): JSX.Element {
  if (tab === 'Visibility') return <VisibilityTab />
  if (tab === 'Platforms') {
    return (
      <div className="grid gap-3 lg:grid-cols-2">
        <InsightCard title="Answer engines" subtitle="Which AI engines cite you">
          <AllocationBlock items={PLATFORMS} />
        </InsightCard>
        <InsightCard
          title="Engine rank"
          subtitle="Citation share by platform"
          right={<ExpandButton />}
        >
          <RankTable rows={PLATFORMS_RANK} nameHeader="Platform" valueHeader="Share" />
        </InsightCard>
      </div>
    )
  }
  if (tab === 'Sentiment') {
    return (
      <InsightCard title="Sentiment" subtitle="How AI answers frame your brand">
        <AllocationBlock items={SENTIMENT} headline="68%" delta="+4%" note="positive" />
      </InsightCard>
    )
  }
  const cfg = RANK_TABS[tab]
  return (
    <InsightCard title={`${tab} rank`} subtitle={cfg.caption} right={<ExpandButton />}>
      <RankTable rows={cfg.rows} nameHeader={cfg.nameHeader} valueHeader={cfg.valueHeader} />
    </InsightCard>
  )
}

function TabBar({
  active,
  onSelect,
}: {
  active: InsightTab
  onSelect: (t: InsightTab) => void
}): JSX.Element {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-[var(--cat-border)]">
      {INSIGHT_TABS.map(t => (
        <button
          key={t}
          type="button"
          onClick={() => onSelect(t)}
          className={`shrink-0 border-b-2 px-3 py-2 text-[12px] font-medium transition-colors ${active === t ? 'border-[#e04a3d] text-[var(--cat-ink)]' : 'border-transparent text-[var(--cat-ink-3)] hover:text-[var(--cat-ink)]'}`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

export function AnswerEngineInsights(): JSX.Element {
  const [tab, setTab] = useState<InsightTab>('Visibility')
  return (
    <section>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-[15px] font-semibold text-[var(--cat-ink)]">
            Answer Engine Insights
          </h2>
          <p className="text-[11px] text-[var(--cat-ink-3)]">
            How your brand shows up across AI answers
          </p>
        </div>
        <span className="hidden rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] px-2.5 py-1 text-[11px] font-medium text-[var(--cat-ink-2)] sm:inline">
          Last 30 days
        </span>
      </div>
      <TabBar active={tab} onSelect={setTab} />
      <div className="mt-3">
        <TabContent tab={tab} />
      </div>
    </section>
  )
}
