import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Asset Credits",
  description: "Attribution and credits for assets used throughout the sorOS portfolio site.",
  alternates: { canonical: "/credits-assets" },
  openGraph: { url: "/credits-assets" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
