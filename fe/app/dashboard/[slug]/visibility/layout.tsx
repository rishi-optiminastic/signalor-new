import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visibility · Signalor",
  description: "Track how AI engines surface and cite your brand.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
