import { BRAND } from '@/features/catalyst/constants'

export type Relation = 'mine' | 'direct' | 'indirect'

/** UI shape a CompetitorCard renders — adapted from the API by `useCompetitors`. */
export interface Competitor {
  name: string
  initial: string
  color: string
  domain: string
  score: number
  relation: Relation
}

export const RELATION_META: Record<Relation, { label: string; color: string }> = {
  mine: { label: 'My brand', color: BRAND },
  direct: { label: 'Direct competitors', color: '#D97706' },
  indirect: { label: 'Indirect competitors', color: 'var(--cat-ink-2)' },
}
