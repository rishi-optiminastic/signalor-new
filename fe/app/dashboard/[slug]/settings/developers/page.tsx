"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@fe/lib/auth-client";
import { useOrgStore } from "@fe/lib/stores/org-store";
import {
  createApiKey,
  createWebhook,
  deleteWebhook,
  listApiKeys,
  listNextJsDeployments,
  listWebhooks,
  revokeApiKey,
  type ApiKey,
  type ApiKeyEnvironment,
  type ApiKeyWithSecret,
  type NextJsDeployment,
  type Webhook,
  type WebhookEvent,
  type WebhookWithSecret,
} from "@fe/lib/api/api-keys";
import { AlertTriangle, Check, Code2, Copy, Loader2, Plus, Trash2 } from "@fe/components/icons";
import { DashboardSettingsNav } from "@fe/components/settings/dashboard-settings-nav";
import { Skeleton } from "@fe/components/ui/skeleton";
import { cn } from "@fe/lib/utils";

const INPUT_CLS =
  "w-full rounded-md border border-black/10 bg-white px-3 py-2 text-[13px] text-foreground shadow-sm transition focus:border-border focus:outline-none focus:ring-2 focus:ring-border";

const BTN_PRIMARY =
  "inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold tracking-tight text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50";

const BTN_OUTLINE =
  "inline-flex items-center justify-center gap-1.5 rounded-md border border-black/12 bg-white px-4 py-2 text-xs font-semibold tracking-tight text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function EnvBadge({ env: e }: { env: ApiKeyEnvironment }) {
  const isLive = e === "live";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        isLive
          ? "border border-success/30 bg-success/10 text-success"
          : "border border-warning/30 bg-warning/10 text-warning",
      )}
    >
      {e}
    </span>
  );
}

function DeploymentRow({ deployment: d }: { deployment: NextJsDeployment }) {
  const statusColor =
    d.status === "complete"
      ? "border-success/30 bg-success/10 text-success"
      : d.status === "failed"
        ? "border-destructive/30 bg-destructive/10 text-destructive"
        : "border-border bg-muted text-foreground";
  const envColor =
    d.environment === "production"
      ? "border-border bg-foreground text-white"
      : d.environment === "preview"
        ? "border-warning/30 bg-warning/10 text-warning"
        : "border-border bg-muted text-muted-foreground";

  return (
    <div className="rounded-md border border-black/8 bg-muted/60 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <code className="font-mono text-xs font-semibold text-foreground">
              {d.commit_sha ? d.commit_sha.slice(0, 8) : "no-commit"}
            </code>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                envColor,
              )}
            >
              {d.environment}
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                statusColor,
              )}
            >
              {d.status}
            </span>
            {d.host ? (
              <span className="text-[11px] text-muted-foreground">via {d.host}</span>
            ) : null}
          </div>
          {d.url ? (
            <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground">{d.url}</p>
          ) : null}
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {formatDate(d.deployed_at ?? d.created_at)}
            {d.analysis_score != null ? ` · Score ${d.analysis_score.toFixed(1)}` : ""}
          </p>
          {d.error_message ? (
            <p className="mt-1 text-[11px] text-destructive">{d.error_message}</p>
          ) : null}
        </div>
        {d.analysis_slug ? (
          <a
            href={`/dashboard/run/${d.analysis_slug}`}
            className="shrink-0 rounded-md border border-black/10 bg-white px-3 py-1.5 text-[11px] font-medium text-foreground shadow-sm transition hover:bg-muted"
          >
            View run
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default function DevelopersSettingsPage() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? "";
  const activeOrg = useOrgStore((s) => s.activeOrg);
  const orgId = activeOrg?.id;
  const queryClient = useQueryClient();

  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnv, setNewKeyEnv] = useState<ApiKeyEnvironment>("live");
  const [createdSecret, setCreatedSecret] = useState<ApiKeyWithSecret | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);
  const [secretCopied, setSecretCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCreateWebhook, setShowCreateWebhook] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [createdWebhook, setCreatedWebhook] = useState<WebhookWithSecret | null>(null);
  const [webhookSecretCopied, setWebhookSecretCopied] = useState(false);
  const [deleteWebhookTarget, setDeleteWebhookTarget] = useState<Webhook | null>(null);

  const keysQuery = useQuery({
    queryKey: ["api-keys", email, orgId],
    queryFn: () => listApiKeys({ email, orgId }),
    enabled: !!email,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createApiKey({
        email,
        orgId,
        name: newKeyName.trim(),
        environment: newKeyEnv,
      }),
    onSuccess: (created) => {
      setCreatedSecret(created);
      setShowCreate(false);
      setNewKeyName("");
      setNewKeyEnv("live");
      queryClient.invalidateQueries({ queryKey: ["api-keys", email, orgId] });
    },
    onError: () => setError("Failed to create API key."),
  });

  const revokeMutation = useMutation({
    mutationFn: (id: number) => revokeApiKey({ id, email, orgId }),
    onSuccess: () => {
      setRevokeTarget(null);
      queryClient.invalidateQueries({ queryKey: ["api-keys", email, orgId] });
    },
    onError: () => setError("Failed to revoke key."),
  });

  const webhooksQuery = useQuery({
    queryKey: ["webhooks", email, orgId],
    queryFn: () => listWebhooks({ email, orgId }),
    enabled: !!email,
  });

  const createWebhookMutation = useMutation({
    mutationFn: () =>
      createWebhook({
        email,
        orgId,
        url: newWebhookUrl.trim(),
        events: ["analysis.completed"] as WebhookEvent[],
      }),
    onSuccess: (created) => {
      setCreatedWebhook(created);
      setShowCreateWebhook(false);
      setNewWebhookUrl("");
      queryClient.invalidateQueries({ queryKey: ["webhooks", email, orgId] });
    },
    onError: () => setError("Failed to create webhook."),
  });

  const deleteWebhookMutation = useMutation({
    mutationFn: (id: number) => deleteWebhook({ id, email, orgId }),
    onSuccess: () => {
      setDeleteWebhookTarget(null);
      queryClient.invalidateQueries({ queryKey: ["webhooks", email, orgId] });
    },
    onError: () => setError("Failed to delete webhook."),
  });

  async function handleCopyWebhookSecret() {
    if (!createdWebhook) return;
    try {
      await navigator.clipboard.writeText(createdWebhook.secret);
      setWebhookSecretCopied(true);
      setTimeout(() => setWebhookSecretCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  async function handleCopySecret() {
    if (!createdSecret) return;
    try {
      await navigator.clipboard.writeText(createdSecret.key);
      setSecretCopied(true);
      setTimeout(() => setSecretCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const keys = keysQuery.data ?? [];
  const webhooks = webhooksQuery.data ?? [];

  const deploymentsQuery = useQuery({
    queryKey: ["nextjs-deployments", email, orgId],
    queryFn: () => listNextJsDeployments({ email, orgId }),
    enabled: !!email,
    // Deploys land asynchronously from postbuild hooks — keep this fresh.
    refetchInterval: 60_000,
  });
  const deployments = deploymentsQuery.data ?? [];

  return (
    <div className="px-2 py-2 font-sans">
      <DashboardSettingsNav label="Developers" />

      <div className="mb-6 mt-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Developers</h2>
          <p className="mt-1 max-w-2xl text-[13px] font-light leading-relaxed text-muted-foreground">
            Create API keys to integrate Signalor with Webflow, Framer, or any other tool. Keys are
            scoped to{" "}
            <strong className="font-medium text-foreground">
              {activeOrg?.name ?? "this workspace"}
            </strong>{" "}
            and authenticate calls to{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">/api/v1/public/</code>.
          </p>
        </div>
        <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-primary/5 text-primary md:inline-flex">
          <Code2 className="h-4 w-4" strokeWidth={1.75} />
        </span>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-[13px] font-medium text-destructive">
          {error}
        </div>
      ) : null}

      <div className="rounded-lg border border-black/8 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-black/8 px-6 py-4">
          <div>
            <p className="text-[13px] font-semibold tracking-tight text-foreground">API keys</p>
            <p className="mt-0.5 text-xs font-light text-muted-foreground">
              We only show the full key once at creation time — store it somewhere safe.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setShowCreate(true);
            }}
            disabled={!email || !orgId}
            className={BTN_PRIMARY}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Create key
          </button>
        </div>

        <div className="px-6 py-4">
          {keysQuery.isLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-md" />
              ))}
            </div>
          ) : keys.length === 0 ? (
            <p className="py-8 text-center text-xs font-light text-muted-foreground">
              No API keys yet. Create one to start integrating.
            </p>
          ) : (
            <div className="space-y-2">
              {keys.map((key) => {
                const revoked = key.revoked_at !== null;
                return (
                  <div
                    key={key.id}
                    className={cn(
                      "rounded-md border bg-muted/60 px-4 py-3",
                      revoked ? "border-black/8 opacity-60" : "border-black/8",
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold tracking-tight text-foreground">
                            {key.name}
                          </p>
                          <EnvBadge env={key.environment} />
                          {revoked ? (
                            <span className="inline-flex items-center rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-destructive">
                              Revoked
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                          {key.key_prefix}…{key.key_last4}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          Created {formatDate(key.created_at)} · Last used{" "}
                          {formatDate(key.last_used_at)}
                        </p>
                      </div>
                      {!revoked ? (
                        <button
                          type="button"
                          onClick={() => setRevokeTarget(key)}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-destructive/30 bg-white text-destructive shadow-sm transition hover:bg-destructive/10"
                          aria-label={`Revoke ${key.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Webhooks ────────────────────────────────────────────────────── */}
      <div className="mt-6 rounded-lg border border-black/8 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-black/8 px-6 py-4">
          <div>
            <p className="text-[13px] font-semibold tracking-tight text-foreground">Webhooks</p>
            <p className="mt-0.5 text-xs font-light text-muted-foreground">
              Get a POST when an analysis completes. Signed with HMAC-SHA256 in the{" "}
              <code className="rounded bg-muted px-1 font-mono">X-Signalor-Signature</code> header.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setShowCreateWebhook(true);
            }}
            disabled={!email || !orgId}
            className={BTN_PRIMARY}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Add webhook
          </button>
        </div>

        <div className="px-6 py-4">
          {webhooksQuery.isLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-md" />
              ))}
            </div>
          ) : webhooks.length === 0 ? (
            <p className="py-8 text-center text-xs font-light text-muted-foreground">
              No webhooks configured.
            </p>
          ) : (
            <div className="space-y-2">
              {webhooks.map((hook) => (
                <div
                  key={hook.id}
                  className="rounded-md border border-black/8 bg-muted/60 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs font-semibold text-foreground">
                        {hook.url}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        {hook.events.map((e) => (
                          <span
                            key={e}
                            className="inline-flex items-center rounded-full border border-black/10 bg-white px-2 py-0.5 font-mono text-[10px] text-foreground"
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Secret …{hook.secret_last4} · Created {formatDate(hook.created_at)} · Last
                        delivered {formatDate(hook.last_delivered_at)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeleteWebhookTarget(hook)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-destructive/30 bg-white text-destructive shadow-sm transition hover:bg-destructive/10"
                      aria-label="Delete webhook"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Next.js deployments ───────────────────────────────────────── */}
      <div className="mt-6 rounded-lg border border-black/8 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-black/8 px-6 py-4">
          <div>
            <p className="text-[13px] font-semibold tracking-tight text-foreground">
              Next.js deployments
            </p>
            <p className="mt-0.5 text-xs font-light text-muted-foreground">
              Reported by the{" "}
              <code className="rounded bg-muted px-1 font-mono text-[11px]">signalor-deploy</code>{" "}
              postbuild script on each new build.
            </p>
          </div>
        </div>
        <div className="px-6 py-4">
          {deploymentsQuery.isLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-md" />
              ))}
            </div>
          ) : deployments.length === 0 ? (
            <p className="py-8 text-center text-xs font-light text-muted-foreground">
              No deployments yet. Add{" "}
              <code className="rounded bg-muted px-1 font-mono text-[11px]">signalor-deploy</code>{" "}
              to your <code className="rounded bg-muted px-1 font-mono text-[11px]">postbuild</code>{" "}
              script and your next deploy will appear here.
            </p>
          ) : (
            <div className="space-y-2">
              {deployments.map((d) => (
                <DeploymentRow key={d.id} deployment={d} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Create webhook dialog ─────────────────────────────────────── */}
      {showCreateWebhook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-lg border border-black/8 bg-white p-6 shadow-xl">
            <h3 className="mb-1 text-base font-semibold tracking-tight text-foreground">
              Add webhook
            </h3>
            <p className="mb-5 text-xs font-light text-muted-foreground">
              Signalor will POST to this URL when subscribed events fire.
            </p>

            <label className="mb-1.5 block text-[11px] font-semibold tracking-tight text-muted-foreground">
              Endpoint URL
            </label>
            <input
              type="url"
              value={newWebhookUrl}
              onChange={(e) => setNewWebhookUrl(e.target.value)}
              placeholder="https://yourapp.com/webhooks/signalor"
              autoFocus
              className={cn(INPUT_CLS, "mb-4 font-mono text-xs")}
            />

            <div className="mb-6 rounded-md border border-black/8 bg-muted px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Events
              </p>
              <p className="mt-1 font-mono text-xs text-foreground">analysis.completed</p>
              <p className="mt-1 text-[11px] font-light text-muted-foreground">
                More events coming soon.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => createWebhookMutation.mutate()}
                disabled={createWebhookMutation.isPending || !newWebhookUrl.trim()}
                className={cn(BTN_PRIMARY, "flex-1")}
              >
                {createWebhookMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : null}
                {createWebhookMutation.isPending ? "Creating…" : "Add webhook"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateWebhook(false);
                  setNewWebhookUrl("");
                }}
                className={BTN_OUTLINE}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reveal webhook secret ─────────────────────────────────────── */}
      {createdWebhook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg rounded-lg border border-black/8 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-success/30 bg-success/10 text-success shadow-sm">
                <Check className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  Webhook added
                </h3>
                <p className="text-xs font-light text-muted-foreground">
                  Copy your signing secret — you won&rsquo;t see it again.
                </p>
              </div>
            </div>

            <div className="mb-4 flex items-start gap-2 rounded-md border border-warning/30 bg-warning/10 px-4 py-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" strokeWidth={1.75} />
              <p className="text-xs font-light leading-relaxed text-warning">
                Use this secret to verify the{" "}
                <code className="font-mono">X-Signalor-Signature</code> header on every delivery.
                Format:{" "}
                <code className="font-mono">
                  sha256={"{"}HMAC(secret, timestamp + &quot;.&quot; + body){"}"}
                </code>
                .
              </p>
            </div>

            <div className="mb-5">
              <label className="mb-1.5 block text-[11px] font-semibold tracking-tight text-muted-foreground">
                Signing secret
              </label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={createdWebhook.secret}
                  className={cn(INPUT_CLS, "flex-1 font-mono text-xs")}
                  onFocus={(e) => e.target.select()}
                />
                <button type="button" onClick={handleCopyWebhookSecret} className={BTN_OUTLINE}>
                  {webhookSecretCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5" strokeWidth={2} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" strokeWidth={1.75} /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setCreatedWebhook(null);
                  setWebhookSecretCopied(false);
                }}
                className={BTN_PRIMARY}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete webhook confirm ────────────────────────────────────── */}
      {deleteWebhookTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-lg border border-black/8 bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-black/8 bg-white text-destructive shadow-sm">
              <Trash2 className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h3 className="mb-2 text-base font-semibold tracking-tight text-foreground">
              Delete webhook
            </h3>
            <p className="mb-5 break-all text-left text-[13px] font-light leading-relaxed text-muted-foreground">
              No more deliveries will be sent to{" "}
              <strong className="font-semibold text-foreground">{deleteWebhookTarget.url}</strong>.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => deleteWebhookMutation.mutate(deleteWebhookTarget.id)}
                disabled={deleteWebhookMutation.isPending}
                className="flex-1 rounded-md bg-destructive py-2.5 text-[13px] font-semibold tracking-tight text-white shadow-sm transition hover:bg-destructive disabled:opacity-50"
              >
                {deleteWebhookMutation.isPending ? "Deleting…" : "Delete"}
              </button>
              <button
                type="button"
                onClick={() => setDeleteWebhookTarget(null)}
                className="flex-1 rounded-md border border-black/8 bg-white py-2.5 text-[13px] font-semibold tracking-tight text-foreground shadow-sm transition hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create-key dialog ──────────────────────────────────────────── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-lg border border-black/8 bg-white p-6 shadow-xl">
            <h3 className="mb-1 text-base font-semibold tracking-tight text-foreground">
              Create API key
            </h3>
            <p className="mb-5 text-xs font-light text-muted-foreground">
              The full key is shown only once after creation.
            </p>

            <label className="mb-1.5 block text-[11px] font-semibold tracking-tight text-muted-foreground">
              Name
            </label>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g. Webflow App Production"
              autoFocus
              className={cn(INPUT_CLS, "mb-4")}
            />

            <label className="mb-1.5 block text-[11px] font-semibold tracking-tight text-muted-foreground">
              Environment
            </label>
            <div className="mb-6 grid grid-cols-2 gap-2">
              {(["live", "test"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setNewKeyEnv(opt)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-xs font-semibold tracking-tight transition",
                    newKeyEnv === opt
                      ? "border-border bg-foreground text-white"
                      : "border-black/10 bg-white text-foreground hover:bg-muted",
                  )}
                >
                  {opt === "live" ? "Live" : "Test"}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending || !newKeyName.trim()}
                className={cn(BTN_PRIMARY, "flex-1")}
              >
                {createMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                {createMutation.isPending ? "Creating…" : "Create key"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreate(false);
                  setNewKeyName("");
                  setNewKeyEnv("live");
                }}
                className={BTN_OUTLINE}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reveal dialog: full key shown once ─────────────────────────── */}
      {createdSecret && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg rounded-lg border border-black/8 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-success/30 bg-success/10 text-success shadow-sm">
                <Check className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  Key created
                </h3>
                <p className="text-xs font-light text-muted-foreground">
                  Copy it now — you won&rsquo;t see it again.
                </p>
              </div>
            </div>

            <div className="mb-4 flex items-start gap-2 rounded-md border border-warning/30 bg-warning/10 px-4 py-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" strokeWidth={1.75} />
              <p className="text-xs font-light leading-relaxed text-warning">
                For security, Signalor only stores a hash of this key. If you lose it, you&rsquo;ll
                need to create a new one.
              </p>
            </div>

            <div className="mb-5">
              <label className="mb-1.5 block text-[11px] font-semibold tracking-tight text-muted-foreground">
                Your new {createdSecret.environment} key
              </label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={createdSecret.key}
                  className={cn(INPUT_CLS, "flex-1 font-mono text-xs")}
                  onFocus={(e) => e.target.select()}
                />
                <button type="button" onClick={handleCopySecret} className={BTN_OUTLINE}>
                  {secretCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5" strokeWidth={2} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" strokeWidth={1.75} /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setCreatedSecret(null);
                  setSecretCopied(false);
                }}
                className={BTN_PRIMARY}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Revoke confirm dialog ──────────────────────────────────────── */}
      {revokeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-lg border border-black/8 bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-black/8 bg-white text-destructive shadow-sm">
              <Trash2 className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h3 className="mb-2 text-base font-semibold tracking-tight text-foreground">
              Revoke key
            </h3>
            <p className="mb-5 text-left text-[13px] font-light leading-relaxed text-muted-foreground">
              Any integration using{" "}
              <strong className="font-semibold text-foreground">
                &ldquo;{revokeTarget.name}&rdquo;
              </strong>{" "}
              will stop working immediately. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => revokeMutation.mutate(revokeTarget.id)}
                disabled={revokeMutation.isPending}
                className="flex-1 rounded-md bg-destructive py-2.5 text-[13px] font-semibold tracking-tight text-white shadow-sm transition hover:bg-destructive disabled:opacity-50"
              >
                {revokeMutation.isPending ? "Revoking…" : "Revoke key"}
              </button>
              <button
                type="button"
                onClick={() => setRevokeTarget(null)}
                className="flex-1 rounded-md border border-black/8 bg-white py-2.5 text-[13px] font-semibold tracking-tight text-foreground shadow-sm transition hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
