"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  AlertCircle,
  Check,
  ExternalLink,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
  Target,
  Trash2,
  X,
} from "@fe/components/icons";
import { useRun } from "../_components/run-context";
import { RichEditor } from "@fe/components/editor/rich-editor";
import {
  getBlogPosts,
  getBlogTopics,
  generateBlogDraft,
  publishBlogDraft,
  deleteBlogPost,
  uploadBlogImage,
  type BlogDraft,
  type BlogPostsResponse,
} from "@fe/lib/api/integrations";
import { cn } from "@fe/lib/utils";

type Step = "generate" | "preview";
type Tone = "informative" | "conversational" | "authoritative" | "educational";

function formatDate(iso: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function extractErrorMessage(err: unknown): string {
  const e = err as { response?: { data?: { error?: string } }; message?: string };
  return e?.response?.data?.error ?? e?.message ?? "Something went wrong. Please try again.";
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-black/[0.07] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function ErrorNote({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-red-50 px-3 py-2.5 text-xs text-red-700">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      {message}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
      {children}
    </label>
  );
}

// ─── Auto topics panel (AI-generated, keyword-driven) ────────────────────────

function AutoTopicsPanel({
  runSlug,
  onGenerate,
}: {
  runSlug: string;
  onGenerate: (topic: string, tone: Tone, wordCount: number) => Promise<void>;
}) {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["blog-topics", runSlug],
    enabled: !!runSlug,
    queryFn: () => getBlogTopics(runSlug),
  });

  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  const topics = data?.topics ?? [];

  async function handleRefresh() {
    setRefreshing(true);
    try {
      const fresh = await getBlogTopics(runSlug, { refresh: true });
      queryClient.setQueryData(["blog-topics", runSlug], fresh);
    } catch {
      // keep existing topics
    } finally {
      setRefreshing(false);
    }
  }

  async function runGenerate(topic: string) {
    setGenError(null);
    setGenerating(topic);
    try {
      await onGenerate(topic, "informative", 800);
    } catch (err) {
      setGenError(extractErrorMessage(err));
    } finally {
      setGenerating(null);
    }
  }

  const busy = !!generating;

  return (
    <SectionCard>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">AI blog topics</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Picked from your Search Console keywords, Analytics &amp; tracked prompts.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing || isLoading || busy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-black/[0.1] bg-white px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground disabled:opacity-50"
        >
          {refreshing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Suggest new
        </button>
      </div>

      {data && !data.has_gsc && !data.has_ga ? (
        <Link
          href={`/dashboard/${runSlug}/settings/integrations`}
          className="mb-3 flex items-center gap-1.5 rounded-md border border-dashed border-black/[0.12] bg-neutral-50 px-3 py-2 text-[11px] text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          Connect Search Console / Analytics for sharper, keyword-targeted topics →
        </Link>
      ) : null}

      {genError ? (
        <div className="mb-3">
          <ErrorNote message={genError} />
        </div>
      ) : null}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-md bg-neutral-100" />
          ))}
        </div>
      ) : error || topics.length === 0 ? (
        <div className="rounded-md border border-dashed border-black/[0.12] bg-neutral-50 px-4 py-8 text-center">
          <p className="text-xs text-muted-foreground">
            Couldn&apos;t generate topics yet. Try again in a moment.
          </p>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:opacity-90 disabled:opacity-50"
          >
            {refreshing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Generate topics
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => runGenerate(topics[0].title)}
            disabled={busy}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
          >
            {generating === topics[0].title ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {busy ? "Writing your post — this may take 20–40 s…" : "Generate a post"}
          </button>

          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Or pick a topic
          </p>
          <div className="space-y-2">
            {topics.map((t) => (
              <div
                key={t.title}
                className="flex items-start justify-between gap-3 rounded-md border border-black/[0.07] bg-white p-3"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold leading-snug text-foreground">
                    {t.title}
                  </p>
                  {t.angle ? (
                    <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                      {t.angle}
                    </p>
                  ) : null}
                  {t.target_keyword ? (
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      <Target className="h-2.5 w-2.5" />
                      {t.target_keyword}
                    </span>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => runGenerate(t.title)}
                  disabled={busy}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-black/[0.1] bg-white px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-neutral-50 disabled:opacity-50"
                >
                  {generating === t.title ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  Generate
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </SectionCard>
  );
}

function PreviewPanel({
  draft,
  runSlug,
  onPublished,
  onDiscard,
}: {
  draft: BlogDraft;
  runSlug: string;
  onPublished: (result: { post_url: string; edit_url: string; status: string }) => void;
  onDiscard: () => void;
}) {
  const [title, setTitle] = useState(draft.title);
  const [metaDescription, setMetaDescription] = useState(draft.meta_description);
  const [slug, setSlug] = useState(draft.slug);
  const [tags, setTags] = useState<string[]>(draft.tags);
  const [tagInput, setTagInput] = useState("");
  const [contentHtml, setContentHtml] = useState(draft.content_html);
  const [publishStatus, setPublishStatus] = useState<"draft" | "publish">("draft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploadImage = (file: File) => uploadBlogImage(runSlug, file).then((r) => r.url);

  function addTag() {
    const t = tagInput.trim().replace(/,+$/, "");
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  }

  async function handlePublish() {
    setError(null);
    setLoading(true);
    try {
      const result = await publishBlogDraft(runSlug, {
        title,
        slug,
        meta_description: metaDescription,
        tags,
        content_html: contentHtml,
        status: publishStatus,
      });
      onPublished(result);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <SectionCard>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Review &amp; publish</p>
          <button
            onClick={onDiscard}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← Generate new
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <FieldLabel>Title</FieldLabel>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-black/[0.1] bg-white px-3 py-2 text-sm font-medium outline-none ring-offset-2 focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <FieldLabel>URL slug</FieldLabel>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-md border border-black/[0.1] bg-neutral-50 px-3 py-2 font-mono text-xs outline-none ring-offset-2 focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <FieldLabel>Meta description</FieldLabel>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-md border border-black/[0.1] bg-white px-3 py-2 text-xs outline-none ring-offset-2 focus:ring-2 focus:ring-ring"
            />
            <p
              className={cn(
                "mt-0.5 text-[10px]",
                metaDescription.length > 155 ? "text-red-500" : "text-muted-foreground",
              )}
            >
              {metaDescription.length} / 155 chars
            </p>
          </div>

          <div>
            <FieldLabel>Tags</FieldLabel>
            <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-black/[0.1] bg-white p-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
                    className="ml-0.5 text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag();
                  }
                  if (e.key === "Backspace" && !tagInput && tags.length) {
                    setTags((prev) => prev.slice(0, -1));
                  }
                }}
                placeholder={tags.length === 0 ? "Add tags…" : ""}
                className="min-w-[70px] flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        {/* Publish mode toggle */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {(["draft", "publish"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setPublishStatus(s)}
              className={cn(
                "rounded-md border py-2 text-xs font-medium transition-colors",
                publishStatus === s
                  ? "border-foreground bg-foreground text-background"
                  : "border-black/[0.1] bg-white text-muted-foreground hover:border-black/20",
              )}
            >
              {s === "draft" ? "Save as draft" : "Publish live"}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-3">
            <ErrorNote message={error} />
          </div>
        )}

        <button
          type="button"
          onClick={handlePublish}
          disabled={loading || !title}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {loading
            ? "Publishing…"
            : `${publishStatus === "publish" ? "Publish" : "Save draft"} to WordPress`}
        </button>
      </SectionCard>

      {/* Content editor */}
      <SectionCard>
        <p className="mb-3 text-sm font-semibold text-foreground">Content</p>
        <RichEditor
          value={contentHtml}
          onChange={setContentHtml}
          placeholder="Edit your post — headings, bold, lists, links, and images…"
          minHeight={460}
          onUploadImage={uploadImage}
        />
      </SectionCard>
    </div>
  );
}

// ─── Recent posts sidebar ─────────────────────────────────────────────────────

function RecentPostsSidebar({
  wpData,
  runSlug,
  onPostDeleted,
}: {
  wpData: BlogPostsResponse;
  runSlug: string;
  onPostDeleted: (postId: number) => void;
}) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(postId: number) {
    setDeletingId(postId);
    try {
      await deleteBlogPost(runSlug, postId);
      onPostDeleted(postId);
    } catch {
      // silently ignore, post remains in list
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <SectionCard>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          Stats, last 30 days
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {wpData.total_posts ?? 0}
            </p>
            <p className="text-[11px] text-muted-foreground">Total posts</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {wpData.published_posts_30d ?? 0}
            </p>
            <p className="text-[11px] text-muted-foreground">Published</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Recent posts
          </p>
          {wpData.site_url && (
            <a
              href={wpData.site_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
        {wpData.posts.length === 0 ? (
          <p className="text-xs text-muted-foreground">No posts found yet.</p>
        ) : (
          <ul className="space-y-2.5">
            {wpData.posts.map((post) => (
              <li key={post.id} className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-foreground">{post.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatDate(post.published_at)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {post.url && (
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
                    className="text-muted-foreground hover:text-red-500 disabled:opacity-40"
                  >
                    {deletingId === post.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}

function HowItWorksSidebar() {
  const steps = [
    "Connect your WordPress site using an Application Password.",
    "AI reads your Search Console keywords, Analytics, and tracked prompts.",
    "It suggests blog topics that target real ranking opportunities.",
    "Pick a topic (or hit Generate) — AI writes the full SEO-optimised post.",
    "Review, tweak if needed, then publish live or save as a draft.",
  ];
  return (
    <SectionCard>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
        How it works
      </p>
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-500">
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
    </SectionCard>
  );
}

export default function BlogAgentPage() {
  const { slug } = useParams<{ slug: string }>();
  useRun();

  const [step, setStep] = useState<Step>("generate");

  const [draft, setDraft] = useState<BlogDraft | null>(null);
  const [publishResult, setPublishResult] = useState<{
    post_url: string;
    edit_url: string;
    status: string;
  } | null>(null);

  const queryClient = useQueryClient();

  // Blog posts list cached by slug — survives tab switches via QueryClient.
  const { data: wpData, isLoading: wpLoading } = useQuery({
    queryKey: ["blog-posts", slug],
    enabled: !!slug,
    queryFn: () =>
      getBlogPosts(slug).catch(() => ({ connected: false, posts: [] }) as BlogPostsResponse),
  });

  const loadWpStatus = () => queryClient.invalidateQueries({ queryKey: ["blog-posts", slug] });

  const setWpData = (
    updater: (prev: BlogPostsResponse | null | undefined) => BlogPostsResponse | undefined,
  ) =>
    queryClient.setQueryData<BlogPostsResponse | undefined>(
      ["blog-posts", slug],
      (prev) => updater(prev) ?? prev,
    );

  async function handleGenerate(topic: string, tone: Tone, wordCount: number) {
    setPublishResult(null);
    const result = await generateBlogDraft(slug, topic, tone, wordCount);
    setDraft(result);
    setStep("preview");
  }

  function handlePostDeleted(postId: number) {
    setWpData((prev) => {
      if (!prev) return undefined;
      return {
        ...prev,
        posts: prev.posts.filter((p) => p.id !== postId),
        total_posts: Math.max(0, (prev.total_posts ?? 1) - 1),
      };
    });
  }

  if (wpLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isConnected = !!wpData?.connected;

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-5 lg:p-7">
      <div className="flex items-center justify-between rounded-lg border border-black/[0.07] bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              isConnected ? "bg-emerald-500" : "bg-neutral-300",
            )}
          />
          <span className="text-sm font-medium text-foreground">
            {isConnected ? wpData?.site_name || "WordPress" : "WordPress not connected"}
          </span>
          {isConnected && wpData?.site_url && (
            <a
              href={wpData.site_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-[11px] text-muted-foreground hover:text-foreground sm:inline"
            >
              {wpData.site_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isConnected && (
            <button
              type="button"
              onClick={loadWpStatus}
              title="Refresh"
              className="rounded p-1 text-muted-foreground hover:bg-neutral-50 hover:text-foreground"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {publishResult && (
        <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <div className="flex-1 text-sm text-emerald-800">
            <span className="font-semibold">
              {publishResult.status === "publish" ? "Published!" : "Saved as draft!"}
            </span>{" "}
            Your post is now on WordPress.
          </div>
          <div className="flex items-center gap-3 text-xs font-medium">
            {publishResult.post_url && (
              <a
                href={publishResult.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline hover:text-emerald-900"
              >
                View post
              </a>
            )}
            {publishResult.edit_url && (
              <a
                href={publishResult.edit_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline hover:text-emerald-900"
              >
                Edit in WP
              </a>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setPublishResult(null);
              setDraft(null);
              setStep("generate");
            }}
            className="text-emerald-600 hover:text-emerald-800"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_272px]">
        <div className="min-w-0 space-y-4">
          {step === "generate" && <AutoTopicsPanel runSlug={slug} onGenerate={handleGenerate} />}

          {step === "preview" && draft && (
            <PreviewPanel
              draft={draft}
              runSlug={slug}
              onPublished={(result) => {
                setPublishResult(result);
                setDraft(null);
                setStep("generate");
                loadWpStatus();
              }}
              onDiscard={() => {
                setDraft(null);
                setStep("generate");
              }}
            />
          )}
        </div>

        <div>
          {isConnected && wpData ? (
            <RecentPostsSidebar wpData={wpData} runSlug={slug} onPostDeleted={handlePostDeleted} />
          ) : (
            <HowItWorksSidebar />
          )}
        </div>
      </div>
    </div>
  );
}
