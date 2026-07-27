import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books",
  description: "Books I've read and recommend — a curated reading list by Soros Febriano.",
  alternates: { canonical: "/books" },
  openGraph: { url: "/books" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
