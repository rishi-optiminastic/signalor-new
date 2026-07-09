import type { Metadata } from "next";
import { buildMetadata } from "@fe/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Authentication",
  description: "Signalor auth callback.",
  noindex: true,
});

export default function AuthCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
