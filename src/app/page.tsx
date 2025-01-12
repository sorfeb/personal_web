'use client';

import styles from "./page.module.css";
import data from './components/XboxDashboard/cards';

import type { GetStaticProps, NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';

import XboxDashboard from './components/XboxDashboard/XboxDashboard';
import ScrollingMenu from './components/ScrollingMenu/ScrollingMenu';
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import ProfileCard from "./components/ProfileCard/ProfileCard";
import SpotifyProfile from "./components/SpotifyProfile/SpotifyProfile";
import SlideshowXboxCard from "./components/SlideshowXboxCard/SlideshowXboxCard";
import XboxCardPopUp from "./components/XboxCard/XboxCardPopUp";
import VolumeControl from "./components/VolumeControl/VolumeControl";
import XboxCard from "./components/XboxCard/XboxCard";

export default function Home() {
  const menuItems = ["Home", "Misc", "Gallery", "Credits"];
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelectionChange = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className={styles.crt}>
      <div className={styles.container}>
        {/* Background Music */}
        <audio autoPlay loop>
          <source src="/assets/audio/Xbox 360 Initial Setup.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

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
  );
}