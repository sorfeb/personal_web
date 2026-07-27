import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Soros Febriano — background, interests, and the story behind sorOS.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
