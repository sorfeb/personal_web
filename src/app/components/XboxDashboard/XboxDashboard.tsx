import React from 'react';
import XboxCard from '../XboxCard/XboxCard';
import SlideshowXboxCard from '../SlideshowXboxCard/SlideshowXboxCard';
import styles from './XboxDashboard.module.css';
import data from './cards';

interface XboxDashboardProps {
  activeIndex: number;
  data: {
    home: { title: string; iconUrl: string }[];
    misc: { title: string; iconUrl: string }[];
    gallery: { title: string; iconUrl: string }[];
    credits: { title: string; iconUrl: string }[];
  };
}

const XboxDashboard: React.FC<XboxDashboardProps> = ({ activeIndex, data }) => {
  const componentMapping: Record<number, JSX.Element> = {
    0: (
      <div className={styles.section}>
        {data.home.map((card, index) => (
          <div className={styles.card}>
            <XboxCard key={index} title={card.title} iconUrl={card.iconUrl} />
          </div>
        ))}
      </div>
    ),
    1: (
      <div className={styles.section}>
        {data.misc.map((card, index) => (
          <div className={styles.card}>
          <XboxCard key={index} title={card.title} iconUrl={card.iconUrl} />
          </div>
        ))}
        <div className={styles.card}>
        <SlideshowXboxCard
            title= 'My Playlist'
            images= {[
              'https://mosaic.scdn.co/640/ab67616d00001e02512219d757d294b1b8ceb6fdab67616d00001e02b95dc41b1ea299b71415c870ab67616d00001e02d6ebb6f586a549c57189f2f9ab67616d00001e02e82b9063af74c25efea29973',
              'https://mosaic.scdn.co/640/ab67616d00001e0259eaf2f9fca6f4c449fc9fc0ab67616d00001e02aec44761574de2a7e8784f11ab67616d00001e02cb9172e927b9f4a7eba3e992ab67616d00001e02d421c7b2de6846831a2c3814',
              'https://mosaic.scdn.co/640/ab67616d00001e0209835613d695644fbc99cf9cab67616d00001e021d1ff8b3a6fe52ee3123078eab67616d00001e023607a6aab3a44e9d6cb71e41ab67616d00001e0278eea627fe9c77256adea633',
            ]}
        />
        </div>
      </div>
    ),
    2: (
      <div className={styles.section}>
        {data.gallery.map((card, index) => (
          <div className={styles.card}>
            <XboxCard key={index} title={card.title} iconUrl={card.iconUrl} />
          </div>
        ))}
      </div>
    ),
    3: (
      <div className={styles.section}>
        {data.credits.map((card, index) => (
          <div className={styles.card}>
            <XboxCard key={index} title={card.title} iconUrl={card.iconUrl} />
          </div>
        ))}
      </div>
    ),
  };

  return componentMapping[activeIndex] || <div>No content available</div>;
};

export default XboxDashboard;
