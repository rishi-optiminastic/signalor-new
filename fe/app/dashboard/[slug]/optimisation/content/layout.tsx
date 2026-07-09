import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Optimisation · Signalor",
  description: "Optimize page content for AI search visibility.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
