'use client';

import { useEffect, useRef } from "react";

declare global {
  interface JQuery {
    ripples(options?: any): JQuery;
    ripples(method: string, ...args: any[]): any;
  }
}

interface RipplesEffectProps {
  children: React.ReactNode;
}

export default function RipplesEffect({ children }: RipplesEffectProps) {
  const waterHolderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let rainInterval: NodeJS.Timeout;

    Promise.all([
      import("jquery"),
      import("jquery.ripples")
    ]).then(([{ default: $ }]) => {
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

      rainInterval = setInterval(createRainDrop, 300);
    }).catch((err) => {
      console.error("Error loading jQuery Ripples:", err);
    });

    return () => {
      if (rainInterval) {
        clearInterval(rainInterval);
      }
      if (waterHolderRef.current) {
        // Use dynamic import to avoid SSR issues
        import("jquery").then(({ default: $ }) => {
          if (waterHolderRef.current) {
            $(waterHolderRef.current).ripples("destroy");
          }
        }).catch(() => {
          // Ignore cleanup errors
        });
      }
    };
  }, []);

  return (
    <div id="waterHolder" ref={waterHolderRef} className="waterCanvasContainer">
      {children}
    </div>
  );
}