import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chatroom",
  description: "Join the live chatroom on sorOS — chat with visitors in real time.",
  alternates: { canonical: "/chatroom" },
  openGraph: { url: "/chatroom" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
