"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useSession } from "@fe/lib/auth-client";
import {
  deleteOrganization,
  getOrganizations,
  updateOrganization,
  type Organization,
} from "@fe/lib/api/organizations";
import { useOrgStore } from "@fe/lib/stores/org-store";
import {
  Loader2,
  Pencil,
  Trash2,
  Plus,
  AlertTriangle,
  ShieldX,
  Clock,
  LogOut,
} from "@fe/components/icons";
import { Skeleton } from "@fe/components/ui/skeleton";
import { UserAvatar } from "@fe/components/ui/user-avatar";
import { terminateAccount, cancelTermination, deleteAccount } from "@fe/lib/api/payments";
import { getProfile, updateProfile, type ProfileData } from "@fe/lib/api/profile";
import { authClient, signOut } from "@fe/lib/auth-client";
import { routes } from "@fe/lib/config";
import { DashboardSettingsNav } from "@fe/components/settings/dashboard-settings-nav";
import { AnalysisHistoryCard } from "@fe/components/dashboard/analysis-history-card";
import { useProjectUsage } from "@fe/lib/hooks/use-project-usage";
import { cn } from "@fe/lib/utils";
import {
  SettingsCard,
  FieldRow,
  INPUT_CLS,
  BTN_PRIMARY,
  BTN_OUTLINE,
  BTN_DANGER,
} from "@fe/components/settings/settings-card";

/** Renders children into document.body so modals escape ancestor transforms (which
 * otherwise become the containing block for position: fixed). */
function ModalPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  // Lock background scroll while a modal is open so the page doesn't scroll
  // behind (and drag) the dialog. Restores the prior overflow on unmount.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

export default function ProfileSettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const email = session?.user?.email ?? "";
  const sessionImage = (session?.user as Record<string, unknown>)?.image as string | undefined;
  const { setOrganizations } = useOrgStore();
  const projectUsage = useProjectUsage(email);
  const canUpgradeProjects =
    projectUsage.isActive && (projectUsage.plan === "starter" || projectUsage.plan === "pro");

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [organizations, setLocalOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showTerminateDialog, setShowTerminateDialog] = useState(false);
  const [terminateStep, setTerminateStep] = useState<"idle" | "done">("idle");
  const [terminating, setTerminating] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [deleteStep, setDeleteStep] = useState<0 | 1 | 2>(0);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteOrgId, setDeleteOrgId] = useState<number | null>(null);
  const [deleteOrgName, setDeleteOrgName] = useState("");
  const [deleteOrgConfirmText, setDeleteOrgConfirmText] = useState("");
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Derived display name + initials. Uses the editable fields once loaded
  // so the avatar fallback stays in sync as the user types.
  const userName =
    [firstName, lastName].filter(Boolean).join(" ").trim() ||
    session?.user?.name ||
    email.split("@")[0] ||
    "User";
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  // B2 photo > Google OAuth photo. We never show a stale upload — once the
  // user removes it, `photo_url` is null and we fall back to Google again.
  const photoSrc = profile?.photo_url || sessionImage || undefined;

  const loadOrgs = useCallback(async () => {
    if (!email) return;
    try {
      setLoading(true);
      const data = await getOrganizations(email);
      setLocalOrgs(data);
      setOrganizations(data);
    } catch {
      setError("Failed to load organizations.");
    } finally {
      setLoading(false);
    }
  }, [email, setOrganizations]);

  const loadProfile = useCallback(async () => {
    if (!email) return;
    // Google / better-auth accounts start with empty first/last name in the
    // backend — their name only exists on the session. Fall back to it so the
    // form prefills instead of showing blank inputs (issue #22).
    const [sessFirst = "", ...sessRest] = (session?.user?.name ?? "").trim().split(/\s+/);
    const sessLast = sessRest.join(" ");
    try {
      setProfileLoading(true);
      const data = await getProfile(email);
      setProfile(data);
      setFirstName(data.first_name || sessFirst);
      setLastName(data.last_name || sessLast);
      setPhone(data.phone_number);
    } catch {
      // Even if the profile fetch fails, still prefill the name from the session.
      setFirstName((f) => f || sessFirst);
      setLastName((l) => l || sessLast);
    } finally {
      setProfileLoading(false);
    }
  }, [email, session?.user?.name]);

  useEffect(() => {
    loadOrgs();
    loadProfile();
  }, [loadOrgs, loadProfile]);

  async function handleSaveProfile() {
    if (!email) return;
    setSavingProfile(true);
    setError(null);
    setNotice(null);
    try {
      await updateProfile(email, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: phone.trim(),
      });
      setNotice("Profile updated.");
    } catch {
      setError("Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSave(id: number) {
    if (!editName.trim()) return;
    setSavingId(id);
    setError(null);
    setNotice(null);
    try {
      const updated = await updateOrganization(id, { name: editName.trim(), url: editUrl.trim() });
      const next = organizations.map((o) => (o.id === id ? updated : o));
      setLocalOrgs(next);
      setOrganizations(next);
      setEditingId(null);
      setNotice("Project updated.");
    } catch {
      setError("Failed to update.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    setError(null);
    setNotice(null);
    try {
      await deleteOrganization(id);
      const next = organizations.filter((o) => o.id !== id);
      setLocalOrgs(next);
      setOrganizations(next);
      if (editingId === id) setEditingId(null);
      setNotice("Project deleted.");
    } catch {
      setError("Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleTerminate() {
    if (!email) return;
    setTerminating(true);
    setError(null);
    try {
      await terminateAccount(email);
      setTerminateStep("done");
      setShowTerminateDialog(false);
      setNotice("Account scheduled for deactivation in 24 hours.");
    } catch {
      setError("Failed to terminate account.");
    } finally {
      setTerminating(false);
    }
  }

  async function handleCancelTermination() {
    if (!email) return;
    setCancelling(true);
    setError(null);
    try {
      await cancelTermination(email);
      setTerminateStep("idle");
      setNotice("Termination cancelled. Your account is active.");
    } catch {
      setError("Failed to cancel termination.");
    } finally {
      setCancelling(false);
    }
  }

  async function handleDeleteAccount() {
    if (!email || deleteConfirmText !== "delete my account") return;
    setDeleting(true);
    setError(null);
    // Django side FIRST. If this fails, we haven't touched better-auth yet —
    // user can retry. Doing it the other way around strands orphaned orgs +
    // analysis runs in the DB when the second call fails.
    try {
      await deleteAccount(email, deleteConfirmText);
    } catch {
      setError("Failed to delete account. Make sure the backend is running and try again.");
      setDeleting(false);
      return;
    }
    // Then wipe the better-auth user/session/account rows so signing in
    // again with the same Google account can't silently restore access.
    try {
      await authClient.deleteUser();
    } catch {
      // Non-fatal — Django data is already gone, fall through to sign-out.
    }
    try {
      await signOut();
    } catch {
      // ignore
    }
    // Hard navigation, NOT router.push. Soft nav leaves Zustand stores
    // (org-store, analyzer-store) and the TanStack Query cache populated
    // with the just-deleted org list, so the dashboard kept showing the
    // old projects and the redirect didn't visually happen until a manual
    // refresh. window.location.replace tears down the whole React tree.
    window.location.replace(routes.signIn);
  }

  async function handleSignOut() {
    setSigningOut(true);
    setError(null);
    try {
      await signOut();
    } catch {
      // ignore
    } finally {
      setSigningOut(false);
    }
    router.push(routes.signIn);
  }

  const profileDirty =
    profile !== null &&
    (firstName.trim() !== profile.first_name ||
      lastName.trim() !== profile.last_name ||
      phone.trim() !== profile.phone_number);

  return (
    <div className="px-2 py-2 font-sans">
      <DashboardSettingsNav label="Profile" />

      <div className="mt-4 mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Profile</h2>
        <p className="mt-1 text-[13px] font-light leading-relaxed text-muted-foreground">
          Manage your account details, photo, and organizations.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-[13px] font-medium text-destructive">
          {error}
        </div>
      ) : null}
      {notice ? (
        <div className="mb-4 rounded-md border border-success/30 bg-success/10 px-4 py-3 text-[13px] font-medium text-success">
          {notice}
        </div>
      ) : null}

      {/* ── Personal Information ──────────────────────────────────────── */}
      <SettingsCard>
        <SettingsCard.Header title="Personal Information" />
        <SettingsCard.Body divided>
          {/* Avatar in the left column, name fields in the right column. */}
          <div className="grid grid-cols-1 gap-3 py-6 md:grid-cols-[260px_1fr] md:gap-10">
            <div>
              <UserAvatar src={photoSrc} initials={userInitials} size={64} />
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                  First name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={INPUT_CLS}
                  disabled={profileLoading}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                  Last name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={INPUT_CLS}
                  disabled={profileLoading}
                />
              </div>
            </div>
          </div>

          <FieldRow
            label="Email address"
            helper="The address you signed in with. Used for billing receipts and notifications."
          >
            <input
              type="email"
              value={email}
              readOnly
              className={cn(INPUT_CLS, "bg-muted text-muted-foreground")}
            />
            <p className="text-[11px] text-muted-foreground">
              Email changes aren&rsquo;t available yet. Contact support if you need to migrate.
            </p>
          </FieldRow>

          <FieldRow
            label="Phone number"
            helper="Optional — used only for account recovery and high-priority alerts."
          >
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={INPUT_CLS}
              placeholder="+1 555 000 0000"
              disabled={profileLoading}
            />
          </FieldRow>
        </SettingsCard.Body>

        <SettingsCard.Footer>
          <span />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (!profile) return;
                setFirstName(profile.first_name);
                setLastName(profile.last_name);
                setPhone(profile.phone_number);
              }}
              disabled={!profileDirty || savingProfile}
              className={BTN_OUTLINE}
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={!profileDirty || savingProfile}
              className={BTN_PRIMARY}
            >
              {savingProfile ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {savingProfile ? "Saving…" : "Save changes"}
            </button>
          </div>
        </SettingsCard.Footer>
      </SettingsCard>

      {/* ── Projects ──────────────────────────────────────────────────── */}
      <SettingsCard className="mt-6">
        <SettingsCard.Header
          title="Projects"
          description={
            projectUsage.loaded
              ? `Using ${projectUsage.count} of ${projectUsage.max} project${
                  projectUsage.max === 1 ? "" : "s"
                }${projectUsage.atLimit ? " — limit reached" : ""}.`
              : "Add, edit, or remove your projects."
          }
          action={
            <button
              onClick={() => router.push("/onboarding/company-info")}
              disabled={projectUsage.atLimit}
              className={cn(BTN_PRIMARY, "disabled:cursor-not-allowed disabled:opacity-50")}
              title={
                projectUsage.atLimit ? "You've reached your project limit" : "Add a new project"
              }
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              Add project
            </button>
          }
        />
        {projectUsage.atLimit ? (
          <div className="border-b border-black/8 bg-warning/60 px-6 py-2.5 text-xs leading-relaxed text-warning">
            You&rsquo;ve reached the maximum projects for your {projectUsage.planLabel || "current"}{" "}
            plan.{" "}
            {canUpgradeProjects ? (
              <>
                <button
                  type="button"
                  onClick={() => router.push("/pricing")}
                  className="font-semibold underline hover:no-underline"
                >
                  Upgrade for more
                </button>{" "}
                or remove a project below.
              </>
            ) : (
              <>Remove a project below, or contact support to raise your cap.</>
            )}
          </div>
        ) : null}

        <SettingsCard.Body>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border border-black/8 bg-muted px-4 py-3"
                >
                  <div className="space-y-1">
                    <Skeleton className="h-[14px] w-32 rounded" />
                    <Skeleton className="h-[12px] w-44 rounded" />
                  </div>
                  <div className="flex gap-1.5">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : organizations.length === 0 ? (
            <p className="py-6 text-center text-xs font-light text-muted-foreground">
              No projects yet.
            </p>
          ) : (
            <div className="space-y-2">
              {organizations.map((org) => {
                const isEditing = editingId === org.id;
                return (
                  <div
                    key={org.id}
                    className="rounded-md border border-black/8 bg-muted/60 px-4 py-3"
                  >
                    {isEditing ? (
                      <div className="flex flex-wrap gap-2">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className={cn(INPUT_CLS, "flex-1 min-w-[160px]")}
                        />
                        <input
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          className={cn(INPUT_CLS, "flex-1 min-w-[200px]")}
                        />
                        <button
                          onClick={() => handleSave(org.id)}
                          disabled={savingId === org.id}
                          className={BTN_PRIMARY}
                        >
                          {savingId === org.id ? "…" : "Save"}
                        </button>
                        <button onClick={() => setEditingId(null)} className={BTN_OUTLINE}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold tracking-tight text-foreground">
                            {org.name}
                          </p>
                          <p className="text-xs font-light text-muted-foreground">
                            {org.url || "No URL"}
                          </p>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                              setEditingId(org.id);
                              setEditName(org.name);
                              setEditUrl(org.url ?? "");
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-black/10 bg-white text-foreground shadow-sm transition hover:bg-muted"
                          >
                            <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteOrgId(org.id);
                              setDeleteOrgName(org.name);
                              setDeleteOrgConfirmText("");
                            }}
                            disabled={deletingId === org.id}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-destructive/30 bg-white text-destructive shadow-sm transition hover:bg-destructive/10 disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </SettingsCard.Body>
      </SettingsCard>

      {/* ── Analysis History ─────────────────────────────────────────── */}
      <AnalysisHistoryCard email={email} />

      {/* ── Danger Zone ──────────────────────────────────────────────── */}
      <SettingsCard className="mt-6 border-destructive/30 bg-destructive/40">
        <div className="flex items-center gap-2 border-b border-destructive/30 px-6 py-5">
          <AlertTriangle className="h-4 w-4 text-destructive" strokeWidth={1.75} />
          <p className="text-sm font-semibold tracking-tight text-destructive">Danger zone</p>
        </div>

        <SettingsCard.Body className="space-y-2">
          <div className="flex items-center justify-between rounded-md border border-black/8 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-black/8 bg-white text-warning shadow-sm">
                <Clock className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight text-foreground">
                  Pause account
                </p>
                <p className="text-[11px] font-light text-muted-foreground">
                  Temporarily pause your account. You can resume any time.
                </p>
              </div>
            </div>
            {terminateStep === "idle" ? (
              <button
                onClick={() => setShowTerminateDialog(true)}
                className="rounded-md border border-warning/40 bg-white px-4 py-2 text-xs font-semibold tracking-tight text-warning shadow-sm transition hover:bg-warning/10"
              >
                Pause
              </button>
            ) : (
              <button
                onClick={handleCancelTermination}
                disabled={cancelling}
                className="rounded-md border border-success/40 bg-white px-4 py-2 text-xs font-semibold tracking-tight text-success shadow-sm transition hover:bg-success/10 disabled:opacity-50"
              >
                {cancelling ? "Resuming…" : "Resume account"}
              </button>
            )}
          </div>

          <div className="flex items-center justify-between rounded-md border border-black/8 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-black/8 bg-white text-destructive shadow-sm">
                <ShieldX className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight text-foreground">
                  Delete account
                </p>
                <p className="text-[11px] font-light text-muted-foreground">
                  Permanently delete all data. This cannot be undone.
                </p>
              </div>
            </div>
            <button onClick={() => setDeleteStep(1)} className={BTN_DANGER}>
              Delete account
            </button>
          </div>

          <div className="flex items-center justify-between rounded-md border border-black/8 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-black/8 bg-white text-foreground shadow-sm">
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight text-foreground">Sign out</p>
                <p className="text-[11px] font-light text-muted-foreground">
                  End your session on this device.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className={BTN_OUTLINE}
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </SettingsCard.Body>
      </SettingsCard>

      {/* ── Modal dialogs (unchanged behavior) ───────────────────────── */}
      {deleteOrgId !== null && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-sm rounded-lg border border-black/8 bg-white p-6 text-center shadow-xl">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-black/8 bg-white text-destructive shadow-sm">
                <Trash2 className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mb-2 text-base font-semibold tracking-tight text-foreground">
                Delete project
              </h3>
              <p className="mb-4 text-left text-[13px] font-light leading-relaxed text-muted-foreground">
                This will remove all analysis runs and data for this project. Type the project name{" "}
                <strong className="font-semibold text-foreground">
                  &ldquo;{deleteOrgName}&rdquo;
                </strong>{" "}
                to confirm.
              </p>
              <label className="mb-1.5 block text-left text-[11px] font-semibold tracking-tight text-muted-foreground">
                Project name
              </label>
              <input
                type="text"
                value={deleteOrgConfirmText}
                onChange={(e) => setDeleteOrgConfirmText(e.target.value)}
                autoComplete="off"
                placeholder={deleteOrgName}
                className={cn(INPUT_CLS, "mb-4")}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (
                      deleteOrgId === null ||
                      deleteOrgConfirmText.trim() !== deleteOrgName.trim()
                    )
                      return;
                    handleDelete(deleteOrgId);
                    setDeleteOrgId(null);
                    setDeleteOrgName("");
                    setDeleteOrgConfirmText("");
                  }}
                  disabled={
                    deletingId === deleteOrgId ||
                    deleteOrgConfirmText.trim() !== deleteOrgName.trim()
                  }
                  className="flex-1 rounded-md bg-destructive py-2.5 text-[13px] font-semibold tracking-tight text-white shadow-sm transition hover:bg-destructive disabled:opacity-50"
                >
                  {deletingId === deleteOrgId ? "Deleting…" : "Delete project"}
                </button>
                <button
                  onClick={() => {
                    setDeleteOrgId(null);
                    setDeleteOrgName("");
                    setDeleteOrgConfirmText("");
                  }}
                  className="flex-1 rounded-md border border-black/8 bg-white py-2.5 text-[13px] font-semibold tracking-tight text-foreground shadow-sm transition hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {showTerminateDialog && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-md rounded-lg border border-black/8 bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-black/8 bg-white text-warning shadow-sm">
                  <Clock className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-foreground">
                    Pause account
                  </h3>
                  <p className="text-xs font-light text-muted-foreground">
                    Temporarily pause your account
                  </p>
                </div>
              </div>

              <div className="mb-5 rounded-md border border-warning/20 bg-warning/10 p-4">
                <p className="text-xs font-light leading-relaxed text-warning">
                  Your account will be paused. You can{" "}
                  <span className="font-semibold">resume anytime</span> from this settings page.
                  While paused, scheduled analyses and integrations will be disabled.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleTerminate}
                  disabled={terminating}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-warning py-2.5 text-[13px] font-semibold tracking-tight text-white shadow-sm transition hover:bg-warning disabled:opacity-50"
                >
                  {terminating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Clock className="h-4 w-4" strokeWidth={1.75} />
                  )}
                  {terminating ? "Pausing…" : "Pause account"}
                </button>
                <button
                  onClick={() => setShowTerminateDialog(false)}
                  className="rounded-md border border-black/8 bg-white px-5 py-2.5 text-[13px] font-semibold tracking-tight text-foreground shadow-sm transition hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {deleteStep === 1 && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-sm rounded-lg border border-black/8 bg-white p-6 text-center shadow-xl">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-black/8 bg-white text-destructive shadow-sm">
                <ShieldX className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mb-2 text-base font-semibold tracking-tight text-foreground">
                Are you sure?
              </h3>
              <p className="mb-6 text-[13px] font-light leading-relaxed text-muted-foreground">
                You&apos;re about to delete your account. This will remove all your data
                permanently.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteStep(2)}
                  className="flex-1 rounded-md bg-destructive py-2.5 text-[13px] font-semibold tracking-tight text-white shadow-sm transition hover:bg-destructive"
                >
                  Yes, continue
                </button>
                <button
                  onClick={() => setDeleteStep(0)}
                  className="flex-1 rounded-md border border-black/8 bg-white py-2.5 text-[13px] font-semibold tracking-tight text-foreground shadow-sm transition hover:bg-muted"
                >
                  No, go back
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {deleteStep === 2 && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-md rounded-lg border border-black/8 bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-black/8 bg-white text-destructive shadow-sm">
                  <ShieldX className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-foreground">
                    Delete account permanently
                  </h3>
                  <p className="text-xs font-light text-muted-foreground">
                    This action is irreversible
                  </p>
                </div>
              </div>

              <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3">
                <p className="text-xs font-light leading-relaxed text-destructive">
                  This will permanently delete your account, all analysis runs, organizations,
                  subscription data, and everything associated with{" "}
                  <span className="font-semibold">{email}</span>. This cannot be undone.
                </p>
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-[11px] font-semibold tracking-tight text-muted-foreground">
                  Type{" "}
                  <span className="font-mono font-semibold text-foreground">delete my account</span>{" "}
                  to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="delete my account"
                  autoFocus
                  className={cn(INPUT_CLS, "font-mono")}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting || deleteConfirmText !== "delete my account"}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-destructive py-2.5 text-[13px] font-semibold tracking-tight text-white shadow-sm transition hover:bg-destructive disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  )}
                  {deleting ? "Deleting…" : "Delete forever"}
                </button>
                <button
                  onClick={() => {
                    setDeleteStep(0);
                    setDeleteConfirmText("");
                  }}
                  className="rounded-md border border-black/8 bg-white px-5 py-2.5 text-[13px] font-semibold tracking-tight text-foreground shadow-sm transition hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
