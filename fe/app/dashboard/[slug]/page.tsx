import type { Metadata } from "next";
import { OverviewV2 } from "./_components/overview-v2";

export const metadata: Metadata = {
  title: "Overview · Signalor",
  description: "GEO score, visibility, and insights for your brand.",
};

export default function OverviewPage() {
  return <OverviewV2 />;
}
