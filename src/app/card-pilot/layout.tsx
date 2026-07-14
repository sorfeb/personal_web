import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Card Pilot",
  description: "Design pilot for the Gamercard business card.",
  // Development pilot — keep out of search indexes
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
