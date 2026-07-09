import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tracker Actions · Signalor",
  description: "Recommended actions from prompt tracking.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
