import { BRAND } from '@/features/catalyst/constants'

export type Relation = 'mine' | 'direct' | 'indirect'

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

export const COMPETITORS: Competitor[] = [
  {
    name: 'Signalor',
    initial: 'S',
    color: BRAND,
    domain: 'signalor.ai',
    score: 55,
    relation: 'mine',
  },
  {
    name: 'Surfer SEO',
    initial: 'S',
    color: '#111827',
    domain: 'surferseo.com',
    score: 71,
    relation: 'indirect',
  },
  {
    name: 'Frase.io',
    initial: 'F',
    color: '#0EA5A4',
    domain: 'frase.io',
    score: 68,
    relation: 'indirect',
  },
  {
    name: 'MarketMuse',
    initial: 'M',
    color: '#6366F1',
    domain: 'marketmuse.com',
    score: 65,
    relation: 'indirect',
  },
  {
    name: 'Lindy',
    initial: 'L',
    color: '#F59E0B',
    domain: 'lindy.ai',
    score: 55,
    relation: 'direct',
  },
  {
    name: 'Clearscope',
    initial: 'C',
    color: '#2563EB',
    domain: 'clearscope.io',
    score: 46,
    relation: 'indirect',
  },
]
