import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Portfolio of software projects and creative work by Soros Febriano.",
  alternates: { canonical: "/projects" },
  openGraph: { url: "/projects" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
