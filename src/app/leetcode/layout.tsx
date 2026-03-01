import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LeetCode",
  description: "LeetCode problem-solving progress and statistics by Soros Febriano.",
  alternates: { canonical: "/leetcode" },
  openGraph: { url: "/leetcode" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
