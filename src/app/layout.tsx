import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import Script from "next/script";
import { VolumeProvider } from "../context/VolumeContext";
import { GamepadProvider } from "../context/GamepadContext";
import { BackgroundProvider } from "../context/BackgroundContext";
import { CRTFilterProvider } from "../context/CRTFilterContext";
import { ToastProvider } from "../context/ToastContext";
import { WMPPlayerProvider } from "../context/WMPPlayerContext";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { BackgroundComposer } from "../components/Background";
import ConsoleEasterEgg from "../components/ConsoleEasterEgg/ConsoleEasterEgg";
import ImageDragGuard from "../components/ImageDragGuard";
import TRPCProvider from "../components/Providers/TRPCProvider";
import CRTOverlay from "../components/CRTOverlay/CRTOverlay";
import ToastContainer from "../components/ToastNotification/ToastContainer";
import { GlobalWMPPlayer } from "../components/WMPPlayer/GlobalWMPPlayer";
import GamepadDebugOverlay from "../components/GamepadDebugOverlay/GamepadDebugOverlay";
import "./globals.css";

const siteUrl = "https://www.sorosfebria.co";
const siteDescription = "Personal website and portfolio of Soros Febriano, a passionate learner about the fusion of technology and art. Explore projects, photos, media and more.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "sorOS",
    template: "%s | sorOS",
  },
  description: siteDescription,
  authors: [{ name: "Soros Febriano", url: siteUrl }],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Soros Febriano",
    description: siteDescription,
    url: siteUrl,
    siteName: "sorOS",
    images: [{ url: "/assets/images/thumbnail-sorOS.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Soros Febriano",
    description: siteDescription,
    images: ["/assets/images/thumbnail-sorOS.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#101510",
};

const inter = Roboto({ weight: "300", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/@react-grab/mcp/dist/client.global.js"
            strategy="lazyOnload"
          />
        )}
        {/* Title, description, OG, Twitter, favicon & viewport now handled by the Metadata API above. */}
        <link rel="preconnect" href="https://mosaic.scdn.co" />
        <link rel="preconnect" href="https://i.scdn.co" />
        <link rel="dns-prefetch" href="https://img.shields.io" />
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
        <body className={inter.className}>
          <BackgroundProvider>
            <CRTFilterProvider>
              <div className="crt">
                {/* Layered background system: base image + animation overlays */}
                <BackgroundComposer />
                <CRTOverlay />
                <svg className="mountainCurve" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="mountainGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(98, 98, 98, 0.5)" />
                      <stop offset="100%" stopColor="rgb(230, 230, 230)" />
                    </linearGradient>
                  </defs>
                  <path d="M0,8 Q50,2 100,15 V30 H0 Z" fill="url(#mountainGradient)" />
                </svg>
                <TRPCProvider>
                  <VolumeProvider>
                    <GamepadProvider>
                      <WMPPlayerProvider>
                        <ToastProvider>
                          <ConsoleEasterEgg />
                          <ImageDragGuard />
                          {children}
                          <GlobalWMPPlayer />
                          <ToastContainer />
                          <GamepadDebugOverlay />
                        </ToastProvider>
                      </WMPPlayerProvider>
                    </GamepadProvider>
                  </VolumeProvider>
                </TRPCProvider>
              </div>
            </CRTFilterProvider>
          </BackgroundProvider>
        </body>
      <Analytics />
      <SpeedInsights />
    </html>
  );
}
