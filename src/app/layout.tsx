import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { VolumeProvider } from './context/VolumeContext';

import "./globals.css";
import Head from "next/head";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SorOS",
};


export default function RootLayout({children,}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Script src ="https://cdnjs.cloudflare.com/ajax/libs/jquery.ripples/0.5.3/jquery.ripples.min.js"></Script>
      </Head>
      <body className={inter.className}>
          <VolumeProvider>
            {children}
          </VolumeProvider>
        </body>
    </html>
  );
}
