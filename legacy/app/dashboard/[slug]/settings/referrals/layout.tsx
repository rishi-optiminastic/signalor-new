import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referrals · Signalor",
  description: "Invite others and track your referral rewards.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
