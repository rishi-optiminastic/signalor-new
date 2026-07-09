import Image from 'next/image'
import Link from 'next/link'

import { MarketingShell } from '@/features/landing/components/MarketingShell'

import { ArrowRight, Clock } from '@fe/components/icons'
import { HeroBackgroundGrid } from '@fe/components/landing/hero-background-grid'
import { ScreenHR } from '@fe/components/ui/intersection-diamonds'
import { BLOG_CATEGORIES, BLOG_STATS, type BlogPost } from '@fe/lib/landing-blog-content'
import { cn } from '@fe/lib/utils'
import { client } from '@fe/sanity/lib/client'
import { ALL_POSTS_QUERY, type SanityBlogPost } from '@fe/sanity/lib/queries'

export const revalidate = 60

function formatDate(iso: string) {
  const normalized = iso.length === 10 ? iso + 'T00:00:00' : iso
  return new Date(normalized).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const CATEGORY_TONE: Record<BlogPost['category'], { bg: string; fg: string }> = {
  Playbooks: { bg: 'bg-warning/10', fg: 'text-warning' },
  'AI visibility': { bg: 'bg-info/10', fg: 'text-info' },
  Product: { bg: 'bg-primary/10', fg: 'text-primary' },
  Research: { bg: 'bg-[var(--feature-violet-tint)]', fg: 'text-[var(--feature-violet)]' },
  Guides: { bg: 'bg-success/10', fg: 'text-success' },
}

export default async function BlogPage() {
  const displayPosts = await client
    .fetch<SanityBlogPost[]>(ALL_POSTS_QUERY)
    .catch(() => [] as SanityBlogPost[])

  return (
    <MarketingShell>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-background relative px-6 pt-14 pb-14 lg:px-12 lg:pt-16 lg:pb-16">
        <HeroBackgroundGrid />
        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="text-muted-foreground text-[11px] font-medium tracking-[0.22em] uppercase">
            [ blog · playbooks · research ]
          </p>
          <h1 className="text-foreground mt-4 max-w-3xl text-3xl leading-[1.12] font-bold tracking-tight sm:text-4xl lg:text-[2.65rem] xl:text-5xl">
            Field notes on{' '}
            <span className="text-warning relative whitespace-nowrap">
              AI search visibility
              <span
                className="border-warning/45 absolute right-0 -bottom-1 left-0 border-b-2 border-dashed"
                aria-hidden
              />
            </span>
          </h1>
          <p className="text-accent-foreground mt-5 max-w-2xl text-base leading-relaxed font-light lg:text-lg">
            Playbooks, research, and honest guides on GEO, citation attribution, llms.txt, and the
            schemas that actually move the needle, written by operators shipping Signalor every day.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="text-foreground inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-semibold">
              All posts
            </span>
            {BLOG_CATEGORIES.map(c => (
              <span
                key={c}
                className={cn(
                  'text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-medium transition',
                )}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <ScreenHR />

      {displayPosts.length === 0 ? (
        /* ─── Empty state ──────────────────────────────────────────── */
        <section className="bg-background relative px-6 py-24 lg:px-12">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-foreground text-4xl font-bold tracking-tight">No blogs yet!</p>
            <p className="text-muted-foreground mt-3 text-base font-light">
              Check back soon, posts will appear here once published.
            </p>
          </div>
        </section>
      ) : (
        /* ─── Posts grid ──────────────────────────────────────────── */
        <section className="bg-background relative px-6 py-14 lg:px-12 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <p className="text-muted-foreground text-[11px] font-medium tracking-[0.22em] uppercase">
              [ latest posts ]
            </p>
            <h2 className="text-foreground mt-4 max-w-4xl text-3xl leading-[1.12] font-bold tracking-tight sm:text-4xl lg:text-[2.65rem]">
              Fresh from the{' '}
              <span className="text-warning relative whitespace-nowrap">
                Signalor studio
                <span
                  className="border-warning/45 absolute right-0 -bottom-1 left-0 border-b-2 border-dashed"
                  aria-hidden
                />
              </span>
            </h2>
          </div>
          <div className="bg-black-10 mx-auto mt-10 max-w-7xl">
            <div className="grid grid-cols-1 divide-y divide-black/6 md:grid-cols-3 md:divide-x md:divide-y-0">
              {displayPosts.map(post => (
                <PostCard key={post.slug} post={post as SanityBlogPost} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ScreenHR />

      {/* ─── Blog stats band ─────────────────────────────────────────── */}
      <section className="bg-background relative px-6 py-14 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-muted-foreground text-[11px] font-medium tracking-[0.22em] uppercase">
            [ in numbers ]
          </p>
          <h2 className="text-foreground mt-4 max-w-4xl text-3xl leading-[1.12] font-bold tracking-tight sm:text-4xl lg:text-[2.65rem]">
            Honest output, no{' '}
            <span className="text-warning relative whitespace-nowrap">
              fluff posts
              <span
                className="border-warning/45 absolute right-0 -bottom-1 left-0 border-b-2 border-dashed"
                aria-hidden
              />
            </span>
          </h2>
        </div>

        <div className="bg-black-10 mx-auto mt-10 max-w-7xl">
          <div className="grid grid-cols-1 divide-y divide-black/6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {BLOG_STATS.map(s => (
              <div
                key={s.label}
                className="flex flex-col gap-2 bg-white px-6 py-10 md:px-8 md:py-12 lg:px-10"
              >
                <p className="text-muted-foreground text-[11px] font-semibold tracking-widest uppercase">
                  {s.label}
                </p>
                <p className="text-foreground text-3xl font-bold tracking-tight tabular-nums md:text-4xl">
                  {s.value}
                </p>
                <p className="text-muted-foreground text-sm leading-snug font-light">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}

function PostCard({ post }: { post: SanityBlogPost }) {
  const tone = CATEGORY_TONE[post.category] ?? { bg: 'bg-muted', fg: 'text-foreground' }
  const imgUrl = post.coverImage?.url
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group hover:bg-muted flex flex-col bg-white transition-colors"
    >
      {imgUrl ? (
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <Image
            src={imgUrl}
            alt={post.coverImage?.alt ?? post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : (
        <div className="bg-muted w-full" style={{ aspectRatio: '16/9' }} />
      )}
      <div className="flex flex-1 flex-col gap-4 px-6 py-8 lg:px-10">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase',
              tone.bg,
              tone.fg,
            )}
          >
            {post.category}
          </span>
          <span className="text-muted-foreground inline-flex items-center gap-1 text-[11px]">
            <Clock className="h-3 w-3" />
            {post.readingMinutes} min
          </span>
        </div>
        <h3 className="text-foreground text-lg leading-snug font-semibold tracking-tight md:text-xl">
          {post.title}
        </h3>
        <p className="text-muted-foreground max-w-sm text-sm leading-relaxed font-light md:text-sm">
          {post.excerpt}
        </p>
        <div className="text-muted-foreground mt-auto flex items-center gap-2 pt-2 text-[11px]">
          <span>{formatDate(post.publishedAt)}</span>
          <ArrowRight className="text-warning ml-auto h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  )
}
