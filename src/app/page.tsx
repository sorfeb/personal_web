'use client';

import styles from "./page.module.css";
import data from '../data/cardsList';

import React, {useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import XboxDashboard from "../components/XboxDashboard/XboxDashboard";
import ScrollingMenu from "../components/ScrollingMenu/ScrollingMenu";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import VolumeControl from "../components/VolumeControl/VolumeControl";
import { ShepherdTourProvider } from "../context/ShepherdTourContext";

export default function Home() {
  const menuItems = ["Home", "Misc", "Gallery", "Credits"];
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handleSelectionChange = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <ShepherdTourProvider>
      <div className={styles.backgroundWrapper}>
        <AnimatePresence>
          <motion.div
            key="home"
            initial={{ opacity: 0 }} // Fade in
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} // Fade out when leaving
            transition={{ duration: 1.5 }}
          >
            {/* Main Content */}
            <div className={styles.screen}>
              <div className={styles.topContainer}>
                <div id="scrolling-menu-container" className={styles.ScrollingMenuContainer}>
                  <ScrollingMenu
                    items={menuItems}
                    onSelectionChange={handleSelectionChange}
                    />
                </div>
                <div className={styles.ProfileCardContainer}>
                  <ProfileCard
                    name="Soros F"
                    level="20"
                    gamerscore={1000}
                  />
                </div>
              </div>
              <div className={styles.DashboardContainer}>
                <XboxDashboard activeIndex={activeIndex} data={data} />
              </div>
              <div id="volume-control-container" className={styles.VolumeControlContainer}>
                <VolumeControl/>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </ShepherdTourProvider>
  );
}