import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certifications",
  description: "Professional certifications and credentials earned by Soros Febriano.",
  alternates: { canonical: "/certifications" },
  openGraph: { url: "/certifications" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
