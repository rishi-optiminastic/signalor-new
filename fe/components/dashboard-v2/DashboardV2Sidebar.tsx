"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronsUpDown,
  Eye,
  FileText,
  HelpCircle,
  LayoutGrid,
  Link2,
  ListTodo,
  MessageSquare,
  Search,
  Settings,
  type LucideIcon,
} from "lucide-react";
import LogoComp from "@fe/components/LogoComp";
import { cn } from "@fe/lib/utils";

type Item = { label: string; icon: LucideIcon; path: string; matchPrefix?: string };

const groups: { label: string | null; items: Item[] }[] = [
  {
    label: null,
    items: [
      { label: "Overview", icon: LayoutGrid, path: "" },
      { label: "Tasks", icon: ListTodo, path: "/recommendations" },
    ],
  },
  {
    label: "Monitoring",
    items: [{ label: "Visibility", icon: Eye, path: "/visibility" }],
  },
  {
    label: "Prompts",
    items: [{ label: "Tracker", icon: MessageSquare, path: "/prompt-tracker" }],
  },
  {
    label: "Optimisation",
    items: [
      { label: "Content", icon: FileText, path: "/optimisation/content" },
      { label: "Backlinks", icon: Link2, path: "/backlinks" },
    ],
  },
];

export function DashboardV2Sidebar({
  basePath,
  userName,
  userInitial,
  onOpenSearch,
}: {
  basePath: string;
  userName: string;
  userInitial: string;
  onOpenSearch?: () => void;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    const full = basePath + path;
    if (path === "") return pathname === basePath || pathname === basePath + "/";
    return pathname === full || pathname.startsWith(full + "/");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col px-3 py-3 lg:flex">
      {/* Brand — actual Signalor logo */}
      <Link href={basePath} className="flex items-center py-1 pl-1.5 pr-1">
        <LogoComp size={28} compact animated={false} className="!text-sv-ink" />
      </Link>

      {/* Search */}
      <button
        onClick={onOpenSearch}
        className="sv-focus-ring mt-3 flex items-center gap-2 rounded-xl border border-sv-hair bg-sv-card-2 px-3 py-2 text-sm text-sv-faint transition-colors hover:border-sv-hair-strong hover:text-sv-muted"
      >
        <Search className="size-4" />
        <span>Search...</span>
        <kbd className="ml-auto rounded-md border border-sv-hair bg-sv-bg px-1.5 py-0.5 text-[10px] font-medium text-sv-faint">
          ⌘K
        </kbd>
      </button>

      {/* Menu */}
      <nav className="mt-3 flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {groups.map((group, gi) => (
          <div key={group.label ?? `g${gi}`} className="flex flex-col gap-0.5">
            {group.label && (
              <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-sv-faint">
                {group.label}
              </p>
            )}
            {group.items.map((item) => (
              <NavItem
                key={item.label}
                href={basePath + item.path}
                icon={item.icon}
                label={item.label}
                active={isActive(item.path)}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom: settings, help, user */}
      <div className="mt-2 flex flex-col gap-0.5">
        <NavItem
          href={basePath + "/settings/profile"}
          icon={Settings}
          label="Settings"
          active={isActive("/settings")}
        />
        <NavItem
          href={basePath + "/settings/developers"}
          icon={HelpCircle}
          label="Help & Center"
          active={false}
        />

        <div className="mt-2 border-t border-sv-hair pt-2">
          <Link
            href={basePath + "/settings/profile"}
            className="sv-focus-ring flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-[var(--sv-hover)]"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#f97316] to-[#fdba74] text-sm font-semibold text-white ring-2 ring-[var(--color-sv-card)]">
              {userInitial}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{userName}</span>
            <ChevronsUpDown className="size-4 shrink-0 text-sv-faint" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "sv-focus-ring flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-[var(--sv-active)] font-medium text-sv-ink"
          : "text-sv-muted hover:bg-[var(--sv-hover)] hover:text-sv-ink",
      )}
    >
      <Icon
        className={cn("size-[18px]", active ? "text-sv-brand" : "text-sv-faint")}
        strokeWidth={2}
      />
      {label}
    </Link>
  );
}
