import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompts · Signalor",
  description: "Manage the prompts tracked for your brand.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
