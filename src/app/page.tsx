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
import { ChatManager } from "../components/Chat";
import { ShepherdTourProvider } from "../context/ShepherdTourContext";
import ProfileModal from "../components/ProfileModal/ProfileModal";
import { WMPGuideButton } from "../components/WMPPlayer/WMPGuideButton";
import RecruiterHint from "../components/RecruiterHint/RecruiterHint";

export default function Home() {

  const menuItems = useMemo(() => 
    Object.keys(dashboardDataList).map(key => 
      key.charAt(0).toUpperCase() + key.slice(1)
    ), 
    []
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  
  const handleSelectionChange = (index: number) => {
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
        
        {/* Chat System - Independent of main layout */}
        {/* TODO: Re-enable when chat feature is complete */}
        {/* <ChatManager /> */}

        <ProfileModal isOpen={isProfileModalOpen} onClose={handleCloseProfileModal} />
        <RecruiterHint />
      </div>
    </ShepherdTourProvider>
  );
}