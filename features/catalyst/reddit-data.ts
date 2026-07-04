export type DayStatus = 'done' | 'active' | 'locked'

export interface RoadDay {
  day: number
  task: string
  status: DayStatus
}

/** 20-day Reddit warm-up → visibility plan. Distinct, specific tasks per day. */
const TASKS: string[] = [
  'Browse trending posts and upvote 3 — warm up the account so it reads like a real Reddit user.',
  'Browse rising posts and upvote 5 to build an activity history and basic trust.',
  'Join r/SEO, r/marketing and r/bigseo — lurk and upvote 4 threads.',
  'Leave 2 genuine comments in r/LifeProTips — no links, no pitch.',
  'Answer one "how do I show up in AI answers" question in r/SEO with real advice.',
  'Save 5 threads about ChatGPT and Perplexity citing sources for later reference.',
  'Comment on 3 discussions in r/artificial about how LLMs pick their sources.',
  'Post your first text question in r/SEO about GEO — ask, don’t promote.',
  'Reply to 2 threads mentioning competitors; add value without naming Signalor.',
  'Share a non-promo insight in r/marketing on structuring content for AI search.',
  'Join r/ChatGPT and r/PerplexityAI; upvote and comment on 2 threads in each.',
  'Answer a "why isn’t my site cited" post with one concrete, testable fix.',
  'Post a short results-style thread in r/bigseo — numbers, no product link.',
  'Answer 3 questions across r/SEO and r/marketing to build comment karma.',
  'Cross-post a genuinely useful resource to r/content_marketing.',
  'Mention Signalor for the first time — only where it directly answers the question.',
  'Run an "ask me about AI search visibility" thread in r/SEO.',
  'Reply to everyone in that thread within 24 hours — keep it human.',
  'Drop a soft Signalor link in a thread that explicitly asks for tools.',
  'Review your karma and flagged posts — you’re ready to promote at scale.',
]

export const WARMUP_DAYS: RoadDay[] = TASKS.map((task, i) => ({
  day: i + 1,
  task,
  status: i === 0 ? 'active' : 'locked',
}))

export const WARMUP = {
  total: 20,
  completed: 0,
  currentDay: 1,
  readyDate: 'Jul 24, 2026',
  handle: 'u/signalor_ai',
}
