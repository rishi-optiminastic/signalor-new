import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visibility Explorer · Signalor",
  description: "Explore AI visibility results prompt by prompt.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
