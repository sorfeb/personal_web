'use client';

import styles from "./page.module.css";
import data from '../data/cardsList';
import 'shepherd.js/dist/css/shepherd.css';

import React, {useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShepherdJourneyProvider, useShepherd } from 'react-shepherd';
import Shepherd from 'shepherd.js';


import XboxDashboard from "../components/XboxDashboard/XboxDashboard";
import ScrollingMenu from "../components/ScrollingMenu/ScrollingMenu";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import VolumeControl from "../components/VolumeControl/VolumeControl";

const tourOptions = {
  defaultStepOptions: {
    cancelIcon: { enabled: true },
    scrollTo: true,
  },
  useModalOverlay: true,
};

function OnboardingTour() {
  const tour = new Shepherd.Tour(tourOptions);

  useEffect(() => {
    if (tour) {
      tour.addSteps([
        {
          id: "scroll-menu",
          text: `
            <script src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs" type="module"></script>
            <dotlottie-player src="https://lottie.host/7a4189d9-6ae7-4389-a50b-a039e3b50abf/Bt6j1vtDs8.lottie" background="transparent" speed="1" style="width: 150px; height: 150px" loop autoplay></dotlottie-player>
            <p>Use this menu to navigate.</p>
          `,
          attachTo: { element: `.${styles.ScrollingMenuContainer}`, on: "bottom" },
          buttons: [
            { text: "Next", action: tour.next },
            { text: "Exit", action: tour.cancel }
          ],
        },
        {
          id: "volume-control",
          text: "Adjust the volume here.",
          attachTo: { element: `.${styles.VolumeControlContainer}`, on: "top" },
          buttons: [
            { text: "Finish", action: tour.complete }
          ],
        },
      ]);

      tour.start();
    }
  }, [tour]);

  return null;
}

export default function Home() {
  const menuItems = ["Home", "Misc", "Gallery", "Credits"];
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handleSelectionChange = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <ShepherdJourneyProvider>
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
                <div className={styles.ScrollingMenuContainer}>
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
              <div className={styles.VolumeControlContainer}>
                <VolumeControl/>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </ShepherdJourneyProvider>
  );
}