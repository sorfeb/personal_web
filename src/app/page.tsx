'use client';

import styles from "./page.module.css";
import data from './components/XboxDashboard/data';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'jquery.ripples';

// const ProfileCard = dynamic(() => import("./components/ProfileCard/ProfileCard"), { ssr: false });
// const VolumeControl = dynamic(() => import("./components/VolumeControl/VolumeControl"), { ssr: false });
import XboxDashboard from "./components/XboxDashboard/XboxDashboard";
import ScrollingMenu from "./components/ScrollingMenu/ScrollingMenu";
import ProfileCard from "./components/ProfileCard/ProfileCard";
import VolumeControl from "./components/VolumeControl/VolumeControl";

export default function Home() {
  const menuItems = ["Home", "Misc", "Gallery", "Credits"];
  const [activeIndex, setActiveIndex] = useState(0);
  const waterHolderRef = useRef<HTMLDivElement>(null); 
  
  const handleSelectionChange = (index: number) => {
    setActiveIndex(index);
  };

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
    <div className={styles.backgroundWrapper}>
      <div className={styles.crt}>
        <div id="waterHolder" ref={waterHolderRef} className={styles.waterCanvasContainer}>
            {/* Main Content */}
          <div className={styles.screen}>
            {/* Add the SVG mountain curve */}
            <svg className={styles.mountainCurve} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mountainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="rgba(98, 98, 98, 0.5)" />
                  <stop offset="100%" stop-color="rgb(230, 230, 230)" />
                </linearGradient>
              </defs>
              <path d="M0,8 Q50,2 100,15 V30 H0 Z" fill="url(#mountainGradient)" />
            </svg>
            <div className={styles.topContainer}>
              <div className={styles.ScrollingMenuContainer}>
                <ScrollingMenu 
                  items={menuItems}
                  onSelectionChange={handleSelectionChange}
                  />
              </div>
              <div className={styles.ProfileCardContainer}>
                <ProfileCard 
                  name="John Doe"
                  level="10"
                  gamerscore={1000}
                />
              </div>
            </div>
            <div className={styles.DashboardContainer}>
              <XboxDashboard activeIndex={activeIndex} data={data} />
            </div>
            <div className={styles.VolumeControlContainer}>
              <VolumeControl/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}