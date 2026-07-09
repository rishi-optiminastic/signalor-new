import type { Metadata } from "next";
import { buildMetadata } from "@fe/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Dashboard",
    description: "Signalor workspace dashboard.",
    noindex: true,
  }),
  title: "Dashboard · Signalor",
};

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
