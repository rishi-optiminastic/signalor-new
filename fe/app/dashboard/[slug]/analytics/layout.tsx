import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics · Signalor",
  description: "Traffic and engagement analytics for your workspace.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
