import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Soros Febriano's profile — skills, experience, and contact information.",
  alternates: { canonical: "/profile" },
  openGraph: { url: "/profile" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
