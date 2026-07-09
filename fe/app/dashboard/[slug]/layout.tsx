"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useSession } from "@fe/lib/auth-client";
import { getOrganizations, type Organization } from "@fe/lib/api/organizations";
import { getRunList } from "@fe/lib/api/analyzer";
import { useOrgStore } from "@fe/lib/stores/org-store";
import { routes } from "@fe/lib/config";
import { RunProvider, useRun } from "./_components/run-context";
import { AnalysisOverlay } from "./_components/analysis-overlay";
import { ScoreBump } from "./_components/score-bump";
import {
  ListChecks,
  User,
  CreditCard,
  ArrowLeft,
  Building2,
  ChevronsUpDown,
  Check,
  Loader2,
  Compass,
  GitFork,
  Gift,
  Code2,
  type LucideIcon,
} from "@fe/components/icons";
import {
  OverviewIcon,
  VisibilityIcon,
  TasksIcon,
  TrackerIcon,
  ContentIcon,
  BacklinksIcon,
} from "@fe/components/icons/nav";
import LogoComp from "@fe/components/LogoComp";
import { AiChat } from "@fe/components/analyzer/ai-chat";
import { cn } from "@fe/lib/utils";
import { DashboardAppFrame, type DashboardAppSection } from "./_components/dashboard-app-frame";
import { DashboardV2Shell } from "@fe/components/dashboard-v2/DashboardV2Shell";
import { VisibilityTabs, VISIBILITY_ROUTES } from "./_components/visibility-tabs";
import { TasksTabs, TASKS_ROUTES } from "./_components/tasks-tabs";
import { CommandPalette } from "@fe/components/ui/command-palette";
import { DashboardTopBarActions } from "./_components/dashboard-top-bar-actions";
import { TourProvider } from "@fe/components/onboarding/tour";
import { ONBOARDING_STEPS } from "@fe/components/onboarding/onboarding-steps";

type MainNavItem = {
  icon: LucideIcon | React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  path: string;
  children?: MainNavItem[];
  /** Extra route prefixes that should mark this item active (e.g. tabs folded under it). */
  match?: string[];
};
type MainNavGroup = { heading?: string; items: MainNavItem[] };

const MAIN_NAV_GROUPS: MainNavGroup[] = [
  {
    items: [
      { icon: OverviewIcon, label: "Overview", path: "" },
      // Tasks owns the "Blogs & Articles" tab (rendered by TasksTabs); Blog Agent
      // is no longer a standalone sidebar item.
      { icon: TasksIcon, label: "Tasks", path: "/recommendations", match: TASKS_ROUTES },
    ],
  },
  {
    heading: "Monitoring",
    // Visibility now owns Search Console, Competitors, and Prompts as tabs
    // (rendered by VisibilityTabs), and Sitemap folds into Search Console.
    items: [
      {
        icon: VisibilityIcon,
        label: "Visibility",
        path: "/visibility",
        match: VISIBILITY_ROUTES,
      },
    ],
  },
  {
    heading: "Prompts",
    items: [{ icon: TrackerIcon, label: "Tracker", path: "/prompt-tracker" }],
  },
  {
    heading: "Optimisation",
    items: [
      { icon: ContentIcon, label: "Content", path: "/optimisation/content" },
      { icon: BacklinksIcon, label: "Backlinks", path: "/backlinks" },
    ],
  },
];

const SETTINGS_NAV = [
  { icon: User, label: "Profile", path: "/settings/profile" },
  { icon: CreditCard, label: "Billing", path: "/settings/billing" },
  { icon: Gift, label: "Referrals", path: "/settings/referrals" },
  { icon: Code2, label: "Developers", path: "/settings/developers" },
];

function sectionForDashboardPath(pathname: string, basePath: string): DashboardAppSection {
  const rel = pathname === basePath ? "/" : pathname.slice(basePath.length) || "/";

  if (rel === "/") {
    return {
      title: "Overview",
      hint: "Scores, quick actions, and your latest GEO snapshot.",
    };
  }
  if (rel.startsWith("/recommendations")) {
    return {
      title: "Tasks",
      hint: "Prioritized tasks to improve AI visibility and citations.",
    };
  }
  if (rel.startsWith("/visibility/explorer")) {
    return {
      title: "Explorer",
      hint: "Explore suggested prompt sets for your properties.",
    };
  }
  if (rel.startsWith("/visibility")) {
    return {
      title: "Visibility",
      hint: "How models and search surfaces see your brand.",
    };
  }
  if (rel.startsWith("/prompts")) {
    return {
      title: "Prompts",
      hint: "AI-generated prompts where competitor brands appear in responses.",
    };
  }
  if (rel.startsWith("/competitors")) {
    return {
      title: "Competitors",
      hint: "Benchmark rival brands across AI surfaces.",
    };
  }
  if (rel.startsWith("/sitemap")) {
    return {
      title: "Sitemap",
      hint: "Page-level audit of speed, structure, and AI readiness.",
    };
  }
  if (rel.startsWith("/search-console")) {
    return {
      title: "Search Console",
      hint: "Indexing, search performance, sitemaps, and URL inspection — from your own crawl.",
    };
  }
  if (rel.startsWith("/optimisation/content")) {
    return {
      title: "Content",
      hint: "Generate, refine, and ship AI-optimised content for your brand.",
    };
  }
  if (rel.startsWith("/blog-agent")) {
    return {
      title: "Blog Agent",
      hint: "Generate AI drafts or write yourself, then publish to your connected CMS.",
    };
  }
  if (rel.startsWith("/backlinks")) {
    return {
      title: "Backlinks",
      hint: "Earn citations on the open web, free submission targets and paid placements.",
      docsUrl: "https://docs.signalor.ai/backlinks",
    };
  }
  if (rel.startsWith("/prompt-tracker/backlinks")) {
    return {
      title: "Backlinks",
      hint: "Free submission targets and paid placements via backlink providers.",
    };
  }
  if (rel.startsWith("/prompt-tracker/actions")) {
    return {
      title: "Prompt actions",
      hint: "Tune prompts and automated follow-ups.",
    };
  }
  if (rel.startsWith("/prompt-tracker/ranking")) {
    return {
      title: "Ranking",
      hint: "What's ranking in Google, Reddit, and Quora for queries tailored to your brand.",
    };
  }
  if (rel.startsWith("/prompt-tracker/history")) {
    return {
      title: "Prompt history",
      hint: "Past runs and responses for this workspace.",
    };
  }
  if (rel.startsWith("/prompt-tracker/engine")) {
    return {
      title: "Prompt engine",
      hint: "Engine configuration and routing.",
    };
  }
  if (rel.startsWith("/prompt-tracker")) {
    return {
      title: "Prompts",
      hint: "Actions, recommendations, and history for AI prompts.",
    };
  }
  if (rel.startsWith("/analytics")) {
    return {
      title: "Analytics",
      hint: "Traffic, conversions, and visibility trends.",
    };
  }
  if (rel.startsWith("/integrations")) {
    return {
      title: "Integrations",
      hint: "Connect data sources and publishing tools.",
    };
  }
  if (rel.startsWith("/settings/profile")) {
    return {
      title: "Profile",
      hint: "Your name, email, and account basics.",
    };
  }
  if (rel.startsWith("/settings/billing")) {
    return {
      title: "Billing",
      hint: "Plan, invoices, and payment method.",
    };
  }
  if (rel.startsWith("/settings/referrals")) {
    return {
      title: "Referrals",
      hint: "Refer friends and earn discounts on your subscription.",
    };
  }
  if (rel.startsWith("/settings/developers")) {
    return {
      title: "Developers",
      hint: "API keys and webhooks for Webflow, Framer, and custom integrations.",
    };
  }
  if (rel.startsWith("/settings")) {
    return {
      title: "Settings",
      hint: "Manage your workspace and account.",
    };
  }
  return { title: "Dashboard", hint: "" };
}

function AnalysisGate({ children }: { children: React.ReactNode }) {
  const { run, loading } = useRun();
  const isRunning = !!run && run.status !== "complete" && run.status !== "failed";

  if (!loading && isRunning) {
    return <AnalysisOverlay />;
  }

  return <>{children}</>;
}

export default function DashboardSlugLayout({ children }: { children: React.ReactNode }) {
  const { slug } = useParams<{ slug: string }>();
  const pathname = usePathname();
  const { data: session } = useSession();

  const router = useRouter();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Listen for "open-ai-chat" events from child components
  useEffect(() => {
    function handleOpenChat(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail?.message) setChatInitialMessage(detail.message);
      setChatOpen(true);
    }
    window.addEventListener("open-ai-chat", handleOpenChat);
    return () => window.removeEventListener("open-ai-chat", handleOpenChat);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [switchingOrg, setSwitchingOrg] = useState(false);
  const orgRef = useRef<HTMLDivElement>(null);
  const { organizations, activeOrg, setOrganizations, setActiveOrg } = useOrgStore();

  const userEmail = session?.user?.email || "";

  const basePath = `/dashboard/${slug}`;

  // Load orgs
  useEffect(() => {
    if (!userEmail) return;
    getOrganizations(userEmail)
      .then((orgs) => setOrganizations(orgs))
      .catch(() => {});
  }, [userEmail, setOrganizations]);

  // Close org dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (orgRef.current && !orgRef.current.contains(e.target as Node)) {
        setOrgDropdownOpen(false);
      }
    }
    if (orgDropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [orgDropdownOpen]);

  async function handleSwitchOrg(org: Organization) {
    setOrgDropdownOpen(false);
    if (org.id === activeOrg?.id) return;
    setSwitchingOrg(true);
    setActiveOrg(org);
    try {
      const runs = await getRunList(userEmail, org.id);
      const latestRun = runs.find((r) => r.status !== "failed") ?? runs[0];
      if (latestRun) {
        router.push(routes.dashboardProject(latestRun.slug));
      } else {
        router.push(routes.dashboard);
      }
    } catch {
      router.push(routes.dashboard);
    } finally {
      setSwitchingOrg(false);
    }
  }

  const isSettingsPage = pathname.startsWith(basePath + "/settings");

  const allNavPaths = MAIN_NAV_GROUPS.flatMap((g) =>
    g.items.flatMap((i) => [i.path, ...(i.children ?? []).map((c) => c.path)]),
  );

  function isActive(navPath: string) {
    if (navPath === "") return pathname === basePath;
    const full = basePath + navPath;
    const matches = pathname === full || pathname.startsWith(`${full}/`);
    if (!matches) return false;
    // Defer to a more-specific sibling that also matches (e.g. /visibility vs /visibility/explorer).
    const moreSpecific = allNavPaths.some(
      (p) =>
        p !== navPath &&
        p.startsWith(navPath + "/") &&
        (pathname === basePath + p || pathname.startsWith(`${basePath + p}/`)),
    );
    return !moreSpecific;
  }

  const section = sectionForDashboardPath(pathname, basePath);

  // The 4-tab Visibility bar shows across its consolidated routes (Visibility,
  // Search Console, Competitors, Prompts — and Sitemap, which folds in).
  const showVisibilityTabs = VISIBILITY_ROUTES.some(
    (r) => pathname === basePath + r || pathname.startsWith(`${basePath + r}/`),
  );

  // The Tasks bar (Tasks | Blogs & Articles) shows across its routes.
  const showTasksTabs = TASKS_ROUTES.some(
    (r) => pathname === basePath + r || pathname.startsWith(`${basePath + r}/`),
  );

  const sidebarBrand = (
    <Link href="/" className="flex items-center">
      <LogoComp
        size={22}
        compact
        animated={false}
        className="text-sm font-bold tracking-tight text-foreground"
      />
    </Link>
  );

  const sidebarBelowHeaderRow =
    organizations.length > 0 ? (
      <div className="relative" ref={orgRef}>
        <button
          type="button"
          onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
          disabled={switchingOrg}
          className={cn(
            "flex w-full h-11 items-center gap-2 rounded-md border border-border/60 bg-muted/25 px-2 py-1.5 text-left transition-colors",
            "hover:border-border hover:bg-muted/45",
            "disabled:pointer-events-none disabled:opacity-60",
            "dark:bg-muted/15 dark:hover:bg-muted/30",
          )}
        >
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white">
            <Building2 className="size-3.5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight tracking-tight text-foreground capitalize">
              {switchingOrg
                ? "Switching…"
                : activeOrg?.name || organizations[0]?.name || "Select org"}
            </p>
            {/* <p className="truncate text-[10px] leading-tight text-muted-foreground">
              {activeOrg?.url || organizations[0]?.url || ""}
            </p> */}
          </div>
          {switchingOrg ? (
            <Loader2 className="size-3.5 shrink-0 animate-spin text-muted-foreground" />
          ) : (
            <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground opacity-70" />
          )}
        </button>

        {orgDropdownOpen ? (
          <div className="absolute left-0 top-full z-[120] mt-1 w-64 max-h-60 overflow-y-auto rounded-md border border-border/60 bg-white py-1 shadow-lg ring-1 ring-black/5">
            {organizations.map((org) => {
              const orgSelected = org.id === activeOrg?.id;
              return (
                <button
                  key={org.id}
                  type="button"
                  onClick={() => handleSwitchOrg(org)}
                  className={cn(
                    "flex w-full items-center gap-2 px-2.5 py-2 text-left transition-colors",
                    orgSelected
                      ? "bg-muted/60 dark:bg-muted/20"
                      : "hover:bg-muted/40 dark:hover:bg-muted/15",
                  )}
                >
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted/50 dark:bg-muted/30">
                    <Building2 className="size-3 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground capitalize">
                      {org.name}
                    </p>
                    {/* <p className="truncate text-[10px] text-muted-foreground">{org.url || "No URL"}</p> */}
                  </div>
                  {orgSelected ? <Check className="size-3.5 shrink-0 text-foreground" /> : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    ) : null;

  const sidebarNav = (
    <div className="flex flex-col gap-1 p-2">
      {/* {isSettingsPage ? (
        <Link
          href={basePath}
          className="mb-1 flex items-center gap-2 rounded-md px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 shrink-0" />
          Back to Dashboard
        </Link>
      ) : null} */}

      {isSettingsPage ? (
        <>
          <p className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Settings
          </p>
          <nav className="flex flex-col gap-0.5">
            {SETTINGS_NAV.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={basePath + item.path}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-[18px] shrink-0 opacity-90" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </>
      ) : (
        <nav className="flex flex-col gap-2.5">
          {MAIN_NAV_GROUPS.map((group, gi) => (
            <div key={group.heading ?? `group-${gi}`} className="flex flex-col gap-0.5">
              {group.heading ? (
                <p className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {group.heading}
                </p>
              ) : null}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = (item.match ?? [item.path]).some((p) => isActive(p));
                const childActive = (item.children ?? []).some((c) => isActive(c.path));
                const showChildren = !!item.children?.length && (active || childActive);
                return (
                  <div key={item.label} className="flex flex-col gap-0.5">
                    <Link
                      href={basePath + item.path}
                      data-tour={`nav-${item.label.toLowerCase()}`}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-foreground font-semibold"
                          : childActive
                            ? "text-foreground hover:bg-muted"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className="size-[18px] shrink-0 opacity-90" aria-hidden />
                      {item.label}
                    </Link>

                    {showChildren ? (
                      <div className="ml-4 flex flex-col gap-0.5 border-l border-border/60 pl-2">
                        {item.children!.map((child) => {
                          const ChildIcon = child.icon;
                          const childIsActive = isActive(child.path);
                          return (
                            <Link
                              key={child.label}
                              href={basePath + child.path}
                              className={cn(
                                "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                                childIsActive
                                  ? "bg-primary/10 text-foreground font-semibold"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                              )}
                            >
                              <ChildIcon className="size-[15px] shrink-0 opacity-90" aria-hidden />
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
      )}
    </div>
  );

  const svUserName = session?.user?.name || userEmail?.split("@")[0] || "there";
  const svUserInitial = (svUserName.trim()[0] || "S").toUpperCase();

  return (
    <RunProvider slug={slug}>
      <AnalysisGate>
        <TourProvider steps={ONBOARDING_STEPS} basePath={basePath}>
          <DashboardV2Shell
            basePath={basePath}
            userName={svUserName}
            userInitial={svUserInitial}
            onOpenSearch={() => setCommandPaletteOpen(true)}
          >
            <div className="animate-enter">
              {showVisibilityTabs ? <VisibilityTabs /> : null}
              {showTasksTabs ? <TasksTabs /> : null}
              {children}
            </div>
          </DashboardV2Shell>

          {/* <AiChat
            slug={slug}
            brandName={activeOrg?.name || organizations[0]?.name}
            open={chatOpen}
            onClose={() => {
              setChatOpen(false);
              setChatInitialMessage(undefined);
            }}
            initialMessage={chatInitialMessage}
          /> */}

          {/* {!chatOpen ? (
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
            >
              <Compass className="size-4" />
              <span className="text-xs font-semibold">AI Assistant</span>
            </button>
          ) : null} */}

          <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
          <ScoreBump />
        </TourProvider>
      </AnalysisGate>
    </RunProvider>
  );
}
