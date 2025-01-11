'use client';

import styles from "./page.module.css";
import './globals.css';
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

const home = [
  { title: "About", iconUrl: "/assets/icons/Display026.ico" },
  { title: "Profile", iconUrl: "/public/assets/icons/store-icon.png" },
  { title: "Certifications", iconUrl: "/public/assets/icons/community-icon.png" },
  { title: "Projects", iconUrl: "/public/assets/icons/profile-icon.png" },
  { title: "Blog", iconUrl: "/public/assets/icons/settings-icon.png" },
  { title: "Settings", iconUrl: "/public/assets/icons/media-icon.png" },
];

const misc = [
  { title: "Github", iconUrl: "/public/assets/icons/games-icon.png" },
  { title: "Leetcode", iconUrl: "/public/assets/icons/games-icon.png" },
  { title: "Cool Sites", iconUrl: "/public/assets/icons/games-icon.png" },
  { title: "My Playlist", iconUrl: "/public/assets/icons/store-icon.png" },
  { title: "Movies", iconUrl: "/public/assets/icons/community-icon.png" },
  { title: "Books", iconUrl: "/public/assets/icons/profile-icon.png" },
  { title: "Last.fm", iconUrl: "/public/assets/icons/settings-icon.png" },
  { title: "Media", iconUrl: "/public/assets/icons/media-icon.png" },
];

const gallery = [
  { title: "Photos", iconUrl: "/public/assets/icons/games-icon.png" },
  { title: "Music", iconUrl: "/public/assets/icons/games-icon.png" },
  { title: "Community", iconUrl: "/public/assets/icons/community-icon.png" },
  { title: "Media", iconUrl: "/public/assets/icons/media-icon.png" },
];

const credits = [
  { title: "Music", iconUrl: "/public/assets/icons/games-icon.png" },
  { title: "Store", iconUrl: "/public/assets/icons/store-icon.png" },
];

const playlistData = [
  {
    title: 'Chill Vibes',
    images: [
      'https://via.placeholder.com/200x200/FF0000/FFFFFF?text=Cover1',
      'https://via.placeholder.com/200x200/00FF00/FFFFFF?text=Cover2',
      'https://via.placeholder.com/200x200/0000FF/FFFFFF?text=Cover3',
    ],
  },
  {
    title: 'Workout Beats',
    images: [
      'https://via.placeholder.com/200x200/FFFF00/FFFFFF?text=Cover4',
      'https://via.placeholder.com/200x200/FF00FF/FFFFFF?text=Cover5',
      'https://via.placeholder.com/200x200/00FFFF/FFFFFF?text=Cover6',
    ],
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const menuItems = ["Home", "Misc", "Gallery", "Credits"];
  const [activeIndex, setActiveIndex] = useState(0);
  const cards = [home, misc, gallery, credits];

  const playlists = [
    {
      title: 'My Playlist',
      images: [
        'https://mosaic.scdn.co/640/ab67616d00001e02512219d757d294b1b8ceb6fdab67616d00001e02b95dc41b1ea299b71415c870ab67616d00001e02d6ebb6f586a549c57189f2f9ab67616d00001e02e82b9063af74c25efea29973',
        'https://mosaic.scdn.co/640/ab67616d00001e0259eaf2f9fca6f4c449fc9fc0ab67616d00001e02aec44761574de2a7e8784f11ab67616d00001e02cb9172e927b9f4a7eba3e992ab67616d00001e02d421c7b2de6846831a2c3814',
        'https://mosaic.scdn.co/640/ab67616d00001e0209835613d695644fbc99cf9cab67616d00001e021d1ff8b3a6fe52ee3123078eab67616d00001e023607a6aab3a44e9d6cb71e41ab67616d00001e0278eea627fe9c77256adea633',
      ],
    },
    // {
    //   title: 'Workout Beats',
    //   images: [
    //     'https://via.placeholder.com/200/FFFF00?text=Image4',
    //     'https://via.placeholder.com/200/FF00FF?text=Image5',
    //     'https://via.placeholder.com/200/00FFFF?text=Image6',
    //   ],
    // },
  ];

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

          <div className="XboxDashboardContainer">
            <XboxDashboard cards={cards[activeIndex]} />
          </div>

          <div className="VolumeControlContainer">
            <VolumeControl/>
          </div>

          {/* <div>
            {playlists.map((playlist, index) => (
              <SlideshowXboxCard key={index} title={playlist.title} images={playlist.images} />
            ))}
          </div>   */}

        </div>
      </div>
    </div>
  );
}