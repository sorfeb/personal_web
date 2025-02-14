'use client';

import { useEffect, useRef } from "react";

declare global {
  interface JQuery {
    ripples(options?: any): JQuery;
    ripples(method: string, ...args: any[]): any;
  }
}

export default function RipplesEffect() {
  const waterHolderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      Promise.all([
        import("jquery"),
        import("jquery.ripples")
      ]).then(([{ default: $ }]) => {
        if (waterHolderRef.current) {
          $(waterHolderRef.current).ripples({
            resolution: 256,
            dropRadius: 20,
            perturbance: 0.04,
          });

          const createRainDrop = () => {
            if (waterHolderRef.current) {
              const $ripple = $(waterHolderRef.current);
              const x = Math.random() * waterHolderRef.current.clientWidth;
              const y = Math.random() * waterHolderRef.current.clientHeight;
              $ripple.ripples("drop", x, y, 20, 0.04 + Math.random() * 0.04);
            }
          };

          const rainInterval = setInterval(createRainDrop, 600);

          return () => {
            clearInterval(rainInterval);
            if (waterHolderRef.current) {
              $(waterHolderRef.current).ripples("destroy");
            }
          };
        }
      }).catch((err) => {
        console.error("Error loading jQuery Ripples:", err);
      });
    }
  }, []);

  return <div ref={waterHolderRef} className="waterCanvasContainer" />;
}
