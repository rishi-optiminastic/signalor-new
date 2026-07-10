import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tracker Backlinks · Signalor",
  description: "Backlink opportunities surfaced by prompt tracking.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
