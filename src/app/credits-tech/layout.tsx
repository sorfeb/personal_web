import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Credits",
  description: "Technologies, libraries, and tools powering the sorOS portfolio site.",
  alternates: { canonical: "/credits-tech" },
  openGraph: { url: "/credits-tech" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
