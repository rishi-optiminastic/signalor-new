import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tracker History · Signalor",
  description: "History of prompt tracking checks over time.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
