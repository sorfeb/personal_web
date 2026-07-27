import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Playlists",
  description: "Curated Spotify playlists by Soros Febriano — discover new music.",
  alternates: { canonical: "/my-playlists" },
  openGraph: { url: "/my-playlists" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
