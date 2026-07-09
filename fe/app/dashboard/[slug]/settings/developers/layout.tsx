import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developers · Signalor",
  description: "API keys and developer settings for your workspace.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
