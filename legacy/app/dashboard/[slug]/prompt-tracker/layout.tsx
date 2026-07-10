import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt Tracking · Signalor",
  description: "See how AI models and search engines respond to queries about your brand.",
};

export default function PromptsSectionLayout({ children }: { children: React.ReactNode }) {
  return <div className="w-full px-6 py-6">{children}</div>;
}
