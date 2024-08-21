'use client';

import styles from "./page.module.css";
import type { GetStaticProps, NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';

import XboxDashboard from './components/XboxDashboard';
import XboxCard from './components/XboxCard';
import ScrollingMenu from './components/ScrollingMenu';

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
  const menuItems = ["Home", "Profile", "Gallery", "Misc"];
  const [activeIndex, setActiveIndex] = useState(0);
  const cards = [cards1, cards2, cards3, cards4];

  const handleSelectionChange = (index: number) => {
    setActiveIndex(index);
  };
  
  return (
    <div className={styles.screen}>
      <ScrollingMenu 
        items={menuItems}
        onSelectionChange={handleSelectionChange}
        />
      <XboxDashboard cards={cards[activeIndex]} />
    </div>
  );
}

