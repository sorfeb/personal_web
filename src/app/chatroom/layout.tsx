import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chatroom",
  description: "Leave a message for other visitors on sorOS.",
  alternates: { canonical: "/chatroom" },
  openGraph: { url: "/chatroom" },
  // Visitor-authored content. Nothing anyone else writes here should rank for
  // this site, so the page stays out of the index and out of the sitemap.
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
