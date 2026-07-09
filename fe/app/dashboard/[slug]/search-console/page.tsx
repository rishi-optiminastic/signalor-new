import type { Metadata } from "next";
import { SearchConsoleShell } from "@fe/components/analyzer/search-console/search-console-shell";

export const metadata: Metadata = {
  title: "Search Console · Signalor",
  description: "Indexing, search performance, sitemaps, and URL inspection from your own crawl.",
};

export default async function SearchConsolePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SearchConsoleShell slug={slug} />;
}
