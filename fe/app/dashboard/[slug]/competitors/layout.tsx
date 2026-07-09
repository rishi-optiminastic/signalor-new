import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competitors · Signalor",
  description: "Benchmark your GEO score against competitors.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
