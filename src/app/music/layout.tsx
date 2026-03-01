import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music",
  description: "What I'm listening to — music taste and currently playing tracks.",
  alternates: { canonical: "/music" },
  openGraph: { url: "/music" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
