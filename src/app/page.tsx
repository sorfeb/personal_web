'use client';

import styles from "./page.module.css";
import data from './components/XboxDashboard/cardsList';

import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import 'jquery.ripples';

import XboxDashboard from './components/XboxDashboard/XboxDashboard';
import ScrollingMenu from './components/ScrollingMenu/ScrollingMenu';
import ProfileCard from "./components/ProfileCard/ProfileCard";
import VolumeControl from "./components/VolumeControl/VolumeControl";


export default function Home() {
  const menuItems = ["Home", "Misc", "Gallery", "Credits"];
  const [activeIndex, setActiveIndex] = useState(0);
  const waterHolderRef = useRef<HTMLDivElement>(null); 
  
  const handleSelectionChange = (index: number) => {
    setActiveIndex(index);
  };

    // 👇 Add this useEffect to initialize the ripple effect
    useEffect(() => {
      if (waterHolderRef.current) {
        $(waterHolderRef.current).ripples({
          resolution: 512,
          dropRadius: 20,
          perturbance: 0.04,
        });
  
        // Cleanup function to destroy the ripples effect when the component unmounts
        return () => {
          if (waterHolderRef.current) {
            $(waterHolderRef.current).ripples('destroy');
          }
        };
      }
    }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.crt}>
        <div id="waterHolder" ref={waterHolderRef} className={styles.waterCanvasContainer}>
          <div className={styles.container}>
            {/* Background Music */}
            {/* <audio autoPlay loop>
              <source src="/assets/audio/Xbox 360 Initial Setup.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio> */}

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
              
              <div className="VolumeControlContainer">
                <VolumeControl/>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}