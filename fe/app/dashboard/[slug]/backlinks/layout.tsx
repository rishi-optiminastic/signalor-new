import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backlinks · Signalor",
  description: "Backlink profile and referring domains for your site.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
