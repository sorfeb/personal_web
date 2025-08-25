import { Roboto } from "next/font/google";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import { VolumeProvider } from "../context/VolumeContext";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import RipplesEffect from "../components/RipplesEffect/RipplesEffect";
import ConsoleEasterEgg from "../components/ConsoleEasterEgg/ConsoleEasterEgg";
import TRPCProvider from "../components/Providers/TRPCProvider";
import "./globals.css";

const inter = Roboto({ weight: "300", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Soros Febriano</title>
        <meta name="description" content="Personal website and portfolio of Soros Febriano, a passionate learner about the fusion of technology and art. Explore projects, photos, media and more." />
        {/* Open Graph tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Soros Febriano" />
        <meta property="og:description" content="Personal website and portfolio of Soros Febriano, a passionate learner about the fusion of technology and art. Explore projects, photos, media and more." />
        <meta property="og:image" content="https://www.sorosfebria.co/assets/images/thumbnail-sorOS.jpg" />
        <meta property="og:url" content="https://www.sorosfebria.co/" />
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Soros Febriano" />
        <meta name="twitter:description" content="Personal website and portfolio of Soros Febriano, a passionate learner about the fusion of technology and art. Explore projects, photos, media and more." />
        <meta name="twitter:image" content="https://www.sorosfebria.co/assets/images/thumbnail-sorOS.jpg" />
        <link rel="icon" href="/favicon.svg" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Soros Febriano",
              "url": "https://www.sorosfebria.co",
              "sameAs": [
                "https://www.linkedin.com/in/soros-febriano/",
                "https://github.com/sorfeb"
              ],
              "jobTitle": "Computer Science Student",
              "worksFor": {
                "@type": "Organization",
                "name": "Universitas Indonesia"
              },
              "description": "Computer Science student passionate about the fusion of technology and art."
            }),
          }}
        />
      </head>
      <StackProvider app={stackServerApp}>
        <StackTheme>
          <TRPCProvider>
            <body className={inter.className}>
              <div className="crt">
                <svg className="mountainCurve" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="mountainGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(98, 98, 98, 0.5)" />
                      <stop offset="100%" stopColor="rgb(230, 230, 230)" />
                    </linearGradient>
                  </defs>
                  <path d="M0,8 Q50,2 100,15 V30 H0 Z" fill="url(#mountainGradient)" />
                </svg>
                <RipplesEffect>
                  <VolumeProvider>
                  <ConsoleEasterEgg />
                    {children}
                  </VolumeProvider>
                </RipplesEffect>
              </div>
            </body>
          </TRPCProvider>
        </StackTheme>
      </StackProvider>
      <Analytics />
      <SpeedInsights />
    </html>
  );
}
