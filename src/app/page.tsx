'use client';

import styles from "./page.module.css";
import data from './components/XboxDashboard/data';

import React, { useEffect, useRef, useState } from 'react';
import 'jquery.ripples';

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
        <div id="waterHolder" ref={waterHolderRef} className={styles.waterCanvasContainer}>
          {/* Main Content */}
          <div className={styles.screen}>
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
  );
}