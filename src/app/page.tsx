'use client';

import styles from "./page.module.css";
import type { GetStaticProps, NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';

import XboxDashboard from './components/XboxDashboard/XboxDashboard';
import ScrollingMenu from './components/ScrollingMenu/ScrollingMenu';
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import ProfileCard from "./components/ProfileCard/ProfileCard";
import SpotifyProfile from "./components/SpotifyProfile/SpotifyProfile";

const cards1 = [
  { title: "About", iconUrl: "/public/assets/icons/games-icon.png" },
  { title: "Store", iconUrl: "/public/assets/icons/store-icon.png" },
  { title: "Community", iconUrl: "/public/assets/icons/community-icon.png" },
  { title: "Profile", iconUrl: "/public/assets/icons/profile-icon.png" },
  { title: "Settings", iconUrl: "/public/assets/icons/settings-icon.png" },
  { title: "Media", iconUrl: "/public/assets/icons/media-icon.png" },
];

const cards2 = [
  { title: "Portofolio", iconUrl: "/public/assets/icons/games-icon.png" },
  { title: "Store", iconUrl: "/public/assets/icons/store-icon.png" },
  { title: "Community", iconUrl: "/public/assets/icons/community-icon.png" },
  { title: "Profile", iconUrl: "/public/assets/icons/profile-icon.png" },
  { title: "Settings", iconUrl: "/public/assets/icons/settings-icon.png" },
  { title: "Media", iconUrl: "/public/assets/icons/media-icon.png" },
];

const cards3 = [
  { title: "Photos", iconUrl: "/public/assets/icons/games-icon.png" },
  { title: "Music", iconUrl: "/public/assets/icons/games-icon.png" },
  { title: "Community", iconUrl: "/public/assets/icons/community-icon.png" },
  { title: "Media", iconUrl: "/public/assets/icons/media-icon.png" },
];

const cards4 = [
  { title: "Music", iconUrl: "/public/assets/icons/games-icon.png" },
  { title: "Store", iconUrl: "/public/assets/icons/store-icon.png" },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const menuItems = ["Home", "Profile", "Gallery", "Misc"];
  const [activeIndex, setActiveIndex] = useState(0);
  const cards = [cards1, cards2, cards3, cards4];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSelectionChange = (index: number) => {
    setActiveIndex(index);
  };

  // if (isLoading) {
  //   return <LoadingScreen />
  // }
  
  return (
    <div className={styles.screen}>
      <ScrollingMenu 
        items={menuItems}
        onSelectionChange={handleSelectionChange}
        />
      <ProfileCard 
        name="John Doe"
        level="10"
        gamerscore={1000}
      />
      <XboxDashboard cards={cards[activeIndex]} />
      <SpotifyProfile></SpotifyProfile>
    </div>
  );
}

