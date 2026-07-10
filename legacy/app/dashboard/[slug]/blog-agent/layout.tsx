import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Agent · Signalor",
  description: "Draft and publish SEO-ready blog posts with AI.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
