import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photos",
  description: "Photography gallery by Soros Febriano — capturing moments through the lens.",
  alternates: { canonical: "/photos" },
  openGraph: { url: "/photos" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
