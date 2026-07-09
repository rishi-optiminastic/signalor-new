"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Globe, XCircle } from "@fe/components/icons";

import { getGSCSitemaps, type GSCSitemapEntry } from "@fe/lib/api/integrations";
import { Skeleton } from "@fe/components/ui/skeleton";
import { fmtDate, fmtNum, prettyUrl } from "./gsc-utils";

export function GscSitemapsLive({ email }: { email: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["gsc-sitemaps-live", email],
    enabled: !!email,
    retry: false,
    queryFn: () => getGSCSitemaps(email),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  if (error || !data) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center text-[13px] text-muted-foreground">
        Couldn&apos;t load sitemaps from Google. Retry in a moment.
      </div>
    );
  }

  if (!data.sitemaps.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
        <p className="text-[14px] font-semibold text-foreground">No sitemaps submitted</p>
        <p className="mx-auto mt-1 max-w-sm text-[12px] text-muted-foreground">
          This property has no sitemaps in Google Search Console yet. Submit a sitemap in Search
          Console and it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-[15px] font-semibold text-foreground">Sitemaps</h3>
        <p className="text-[12px] text-muted-foreground">
          Sitemaps submitted to Google Search Console for this property.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Sitemaps" value={fmtNum(data.sitemaps.length)} />
        <Tile label="URLs submitted" value={fmtNum(data.submitted)} />
        <Tile label="URLs indexed" value={fmtNum(data.indexed)} />
        <Tile
          label="With errors"
          value={fmtNum(data.sitemaps.filter((s) => s.errors > 0).length)}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left">
              <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Sitemap
              </th>
              <th className="w-24 px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Submitted
              </th>
              <th className="w-24 px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Indexed
              </th>
              <th className="w-32 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Last read
              </th>
              <th className="w-24 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data.sitemaps.map((sm) => (
              <SitemapRow key={sm.path} sm={sm} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SitemapRow({ sm }: { sm: GSCSitemapEntry }) {
  return (
    <tr className="border-b border-border/60 last:border-0 hover:bg-muted/40">
      <td className="max-w-0 px-3 py-2.5">
        <a
          href={sm.path}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 truncate text-[13px] font-medium text-foreground hover:underline"
        >
          <Globe className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{prettyUrl(sm.path)}</span>
        </a>
      </td>
      <td className="px-3 py-2.5 text-right font-mono text-[12px] text-foreground">
        {fmtNum(sm.submitted)}
      </td>
      <td className="px-3 py-2.5 text-right font-mono text-[12px] text-foreground">
        {fmtNum(sm.indexed)}
      </td>
      <td className="px-3 py-2.5 text-[12px] text-muted-foreground">
        {sm.last_downloaded ? fmtDate(sm.last_downloaded) : "—"}
      </td>
      <td className="px-3 py-2.5">
        <SitemapStatus sm={sm} />
      </td>
    </tr>
  );
}

function SitemapStatus({ sm }: { sm: GSCSitemapEntry }) {
  if (sm.errors > 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-500">
        <XCircle className="size-3" />
        {fmtNum(sm.errors)} error{sm.errors === 1 ? "" : "s"}
      </span>
    );
  }
  if (sm.is_pending) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
        Pending
      </span>
    );
  }
  if (sm.warnings > 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
        <AlertTriangle className="size-3" />
        {fmtNum(sm.warnings)} warning{sm.warnings === 1 ? "" : "s"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
      <CheckCircle2 className="size-3" />
      Success
    </span>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}
