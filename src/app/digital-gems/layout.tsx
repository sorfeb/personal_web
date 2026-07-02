import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Gems",
  description: "A curated collection of interesting websites and digital discoveries by Soros Febriano.",
  alternates: { canonical: "/digital-gems" },
  openGraph: { url: "/digital-gems" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
