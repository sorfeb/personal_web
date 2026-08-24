'use client';

import "./globals.css";
import styles from "./Home.module.css";
import dashboardDataList from '../data/cardsList';

import React, {useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import XboxDashboard from "../components/XboxDashboard/XboxDashboard";
import ScrollingMenu from "../components/ScrollingMenu/ScrollingMenu";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import VolumeControl from "../components/VolumeControl/VolumeControl";
// TODO: Re-enable when tour feature is reimplemented (shepherd.js requires commercial license)
// import HelpButton from "../components/HelpButton";
import { ShepherdTourProvider } from "../context/ShepherdTourContext";
import ProfileModal from "../components/ProfileModal/ProfileModal";
import { WMPGuideButton } from "../components/WMPPlayer/WMPGuideButton";
import { useAchievements } from "../hooks/useAchievements";

export default function Home() {

  const menuItems = useMemo(() => 
    Object.keys(dashboardDataList).map(key => 
      key.charAt(0).toUpperCase() + key.slice(1)
    ), 
    []
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const { recordProgress } = useAchievements();

  const handleSelectionChange = (index: number) => {
    // Record both the blade being left and the one entered — the initial
    // blade never fires a selection change of its own.
    const bladeKeys = Object.keys(dashboardDataList);
    const previousKey = bladeKeys[activeIndex];
    const nextKey = bladeKeys[index];
    if (previousKey) recordProgress('bladesCycled', previousKey);
    if (nextKey) recordProgress('bladesCycled', nextKey);
    setActiveIndex(index);
  };

  const handleOpenProfileModal = () => setProfileModalOpen(true);
  const handleCloseProfileModal = () => setProfileModalOpen(false);

  return (
    <ShepherdTourProvider>
      <div className={styles.backgroundWrapper}>
        <AnimatePresence>
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <div className={styles.screen} data-layout="responsive">
              {/* Header Section */}
              <header className={styles.header}>
                <div className={styles.topContainer}>
                  <div id="scrolling-menu-container" className={styles.ScrollingMenuContainer}>
                    <ScrollingMenu
                      items={menuItems}
                      onSelectionChange={handleSelectionChange}
                      disabled={isProfileModalOpen}
                    />
                  </div>
                  <div className={styles.rightHeaderSection}>
                    <div className={styles.ProfileCardRow}>
                      <WMPGuideButton />
                      <div className={styles.ProfileCardContainer}>
                        <ProfileCard onClick={handleOpenProfileModal} />
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              {/* Main Content Section */}
              <main className={styles.main}>
                <div className={styles.DashboardContainer}>
                  <XboxDashboard activeIndex={activeIndex} data={dashboardDataList} />
                </div>
              </main>

              {/* Footer */}
              <footer className={styles.footer}>
                <div className={styles.VolumeControlContainer}>
{/* TODO: Re-enable when tour feature is reimplemented
                  <div className={styles.HelpButtonContainer}>
                    <HelpButton />
                  </div>
*/}
                  <div id="volume-control-container"className={styles.VolumeControlWrapper}>
                    <VolumeControl/>
                  </div>
                </div>
              </footer>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <ProfileModal isOpen={isProfileModalOpen} onClose={handleCloseProfileModal} />
      </div>
    </ShepherdTourProvider>
  );
}