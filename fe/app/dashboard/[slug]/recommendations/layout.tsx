import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recommendations · Signalor",
  description: "Prioritized GEO fixes generated for your site.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
