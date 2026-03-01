import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media",
  description: "Videos, recordings, and media content by Soros Febriano.",
  alternates: { canonical: "/media" },
  openGraph: { url: "/media" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
