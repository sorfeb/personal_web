'use client';

import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { VolumeProvider } from '../context/VolumeContext';
import { useEffect, useRef } from "react";

import "./globals.css";
import 'jquery.ripples';

const inter = Roboto({weight: "300", subsets: ["latin"]});


export default function RootLayout({children,}: { children: React.ReactNode }) {
  const waterHolderRef = useRef<HTMLDivElement>(null); 
  
  useEffect(() => {
    if (typeof window !== 'undefined' && waterHolderRef.current) {
      // Dynamically import jQuery and jQuery Ripples
      import('jquery').then(({ default: $ }) => {
        import('jquery.ripples').then(() => {
          // Initialize ripples effect
          $(waterHolderRef.current!).ripples({
            resolution: 256,
            dropRadius: 20,
            perturbance: 0.04,
          });
          
          const createRainDrop = () => {
            if (waterHolderRef.current) {
              const $ripple = $(waterHolderRef.current);

              const containerWidth = waterHolderRef.current.clientWidth; 
              const containerHeight = waterHolderRef.current.clientHeight;

              const x = Math.random() * containerWidth; 
              const y = Math.random() * containerHeight; 
              const dropRadius = 20;
              const strength = 0.04 + Math.random() * 0.04;

              $ripple.ripples('drop', x, y, dropRadius, strength);
            }
          };

          const rainInterval = setInterval(createRainDrop, 600); 

          // Cleanup function
          return () => {
            clearInterval(rainInterval);
            if (waterHolderRef.current) {
              $(waterHolderRef.current).ripples('destroy');
            }
          };
        });
      });
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <div className='crt'>
            {/* Add the SVG mountain curve */}
            <svg className='mountainCurve' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mountainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="rgba(98, 98, 98, 0.5)" />
                  <stop offset="100%" stop-color="rgb(230, 230, 230)" />
                </linearGradient>
              </defs>
              <path d="M0,8 Q50,2 100,15 V30 H0 Z" fill="url(#mountainGradient)" />
            </svg>
          <div id="waterHolder" ref={waterHolderRef} className='waterCanvasContainer'>
            <VolumeProvider>
              {children}
            </VolumeProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
