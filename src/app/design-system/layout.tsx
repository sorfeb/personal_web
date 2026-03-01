import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design System",
  description: "Component library and design system used to build the sorOS portfolio.",
  alternates: { canonical: "/design-system" },
  openGraph: { url: "/design-system" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
