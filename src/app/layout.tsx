import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { VolumeProvider } from './context/VolumeContext';

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SorOS",
};


export default function RootLayout({children,}: { children: React.ReactNode }) {
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
          <VolumeProvider>
            {children}
          </VolumeProvider>
        </div>
      </body>
    </html>
  );
}
