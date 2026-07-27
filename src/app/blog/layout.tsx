import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles and thoughts on technology, art, and everything in between by Soros Febriano.",
  alternates: { canonical: "/blog" },
  openGraph: { url: "/blog" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Blog — sorOS",
            "description": "Articles and thoughts on technology, art, and everything in between by Soros Febriano.",
            "url": "https://www.sorosfebria.co/blog",
            "author": {
              "@type": "Person",
              "name": "Soros Febriano",
              "url": "https://www.sorosfebria.co",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
