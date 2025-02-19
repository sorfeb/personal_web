'use client';

import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { VolumeProvider } from "../context/VolumeContext";
import { useEffect, useRef } from "react";

import "./globals.css";

const inter = Roboto({ weight: "300", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const waterHolderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // Prevents SSR issues

    import("jquery")
      .then(({ default: $ }) => import("jquery.ripples").then(() => $))
      .then(($) => {
        if (!waterHolderRef.current) return;
        
        $(waterHolderRef.current).ripples({
          resolution: 256,
          dropRadius: 20,
          perturbance: 0.04,
          interactive: true,
        });

        const createRainDrop = () => {
          if (waterHolderRef.current) {
            const $ripple = $(waterHolderRef.current);
            const x = Math.random() * waterHolderRef.current.clientWidth;
            const y = Math.random() * waterHolderRef.current.clientHeight;
            $ripple.ripples("drop", x, y, 20, 0.04 + Math.random() * 0.04);
          }
        };

        const rainInterval = setInterval(createRainDrop, 300);

        return () => {
          clearInterval(rainInterval);
          if (waterHolderRef.current) {
            $(waterHolderRef.current).ripples("destroy");
          }
        };
      })
      .catch((err) => console.error("Error loading jQuery Ripples:", err));
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
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

          {/* Water Ripple Effect (Lazy Loaded) */}
          <div id="waterHolder" ref={waterHolderRef} className="waterCanvasContainer">
            <VolumeProvider>{children}</VolumeProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
