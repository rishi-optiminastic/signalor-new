import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "@fe/components/icons";

import { LandingFooter } from "@fe/components/landing/landing-footer";
import { LandingMarketingShell } from "@fe/components/landing/landing-marketing-shell";
import { HeroBackgroundGrid } from "@fe/components/landing/hero-background-grid";
import { ScreenHR } from "@fe/components/ui/intersection-diamonds";
import { BLOG_CATEGORIES, BLOG_STATS, type BlogPost } from "@fe/lib/landing-blog-content";
import { client } from "@fe/sanity/lib/client";
import { ALL_POSTS_QUERY, type SanityBlogPost } from "@fe/sanity/lib/queries";
import { cn } from "@fe/lib/utils";

export const revalidate = 60;

function formatDate(iso: string) {
  const normalized = iso.length === 10 ? iso + "T00:00:00" : iso;
  return new Date(normalized).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const CATEGORY_TONE: Record<BlogPost["category"], { bg: string; fg: string }> = {
  Playbooks: { bg: "bg-warning/10", fg: "text-warning" },
  "AI visibility": { bg: "bg-info/10", fg: "text-info" },
  Product: { bg: "bg-primary/10", fg: "text-primary" },
  Research: { bg: "bg-[var(--feature-violet-tint)]", fg: "text-[var(--feature-violet)]" },
  Guides: { bg: "bg-success/10", fg: "text-success" },
};

export default async function BlogPage() {
  const displayPosts = await client
    .fetch<SanityBlogPost[]>(ALL_POSTS_QUERY)
    .catch(() => [] as SanityBlogPost[]);

  return (
    <LandingMarketingShell>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative bg-background px-6 pb-14 pt-14 lg:px-12 lg:pb-16 lg:pt-16">
        <HeroBackgroundGrid />
        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            [ blog · playbooks · research ]
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem] xl:text-5xl">
            Field notes on{" "}
            <span className="relative whitespace-nowrap text-warning">
              AI search visibility
              <span
                className="absolute -bottom-1 left-0 right-0 border-b-2 border-dashed border-warning/45"
                aria-hidden
              />
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-accent-foreground lg:text-lg">
            Playbooks, research, and honest guides on GEO, citation attribution, llms.txt, and the
            schemas that actually move the needle, written by operators shipping Signalor every day.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-semibold text-foreground">
              All posts
            </span>
            {BLOG_CATEGORIES.map((c) => (
              <span
                key={c}
                className={cn(
                  "inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
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
        <section className="relative bg-background px-6 py-24 lg:px-12">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-4xl font-bold tracking-tight text-foreground">No blogs yet!</p>
            <p className="mt-3 text-base font-light text-muted-foreground">
              Check back soon, posts will appear here once published.
            </p>
          </div>
        </section>
      ) : (
        /* ─── Posts grid ──────────────────────────────────────────── */
        <section className="relative bg-background px-6 py-14 lg:px-12 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              [ latest posts ]
            </p>
            <h2 className="mt-4 max-w-4xl text-3xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem]">
              Fresh from the{" "}
              <span className="relative whitespace-nowrap text-warning">
                Signalor studio
                <span
                  className="absolute -bottom-1 left-0 right-0 border-b-2 border-dashed border-warning/45"
                  aria-hidden
                />
              </span>
            </h2>
          </div>
          <div className="mx-auto mt-10 max-w-7xl bg-black-10">
            <div className="grid grid-cols-1 divide-y divide-black/6 md:grid-cols-3 md:divide-x md:divide-y-0">
              {displayPosts.map((post) => (
                <PostCard key={post.slug} post={post as SanityBlogPost} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ScreenHR />

      {/* ─── Blog stats band ─────────────────────────────────────────── */}
      <section className="relative bg-background px-6 py-14 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            [ in numbers ]
          </p>
          <h2 className="mt-4 max-w-4xl text-3xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem]">
            Honest output, no{" "}
            <span className="relative whitespace-nowrap text-warning">
              fluff posts
              <span
                className="absolute -bottom-1 left-0 right-0 border-b-2 border-dashed border-warning/45"
                aria-hidden
              />
            </span>
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-7xl bg-black-10">
          <div className="grid grid-cols-1 divide-y divide-black/6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {BLOG_STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col gap-2 bg-white px-6 py-10 md:px-8 md:py-12 lg:px-10"
              >
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </p>
                <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground md:text-4xl">
                  {s.value}
                </p>
                <p className="text-sm font-light leading-snug text-muted-foreground">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </LandingMarketingShell>
  );
}

function PostCard({ post }: { post: SanityBlogPost }) {
  const tone = CATEGORY_TONE[post.category] ?? { bg: "bg-muted", fg: "text-foreground" };
  const imgUrl = post.coverImage?.url;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white transition-colors hover:bg-muted"
    >
      {imgUrl ? (
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <Image
            src={imgUrl}
            alt={post.coverImage?.alt ?? post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : (
        <div className="w-full bg-muted" style={{ aspectRatio: "16/9" }} />
      )}
      <div className="flex flex-1 flex-col gap-4 px-6 py-8 lg:px-10">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              tone.bg,
              tone.fg,
            )}
          >
            {post.category}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {post.readingMinutes} min
          </span>
        </div>
        <h3 className="text-lg font-semibold leading-snug tracking-tight text-foreground md:text-xl">
          {post.title}
        </h3>
        <p className="max-w-sm text-sm font-light leading-relaxed text-muted-foreground md:text-sm">
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center gap-2 pt-2 text-[11px] text-muted-foreground">
          <span>{formatDate(post.publishedAt)}</span>
          <ArrowRight className="ml-auto h-3.5 w-3.5 text-warning opacity-0 transition group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  );
}
