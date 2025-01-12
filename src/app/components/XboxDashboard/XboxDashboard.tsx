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
          <XboxCard key={index} title={card.title} iconUrl={card.iconUrl} />
        ))}
      </div>
    ),
    1: (
      <div className={styles.section}>
        {data.misc.map((card, index) => (
          <XboxCard key={index} title={card.title} iconUrl={card.iconUrl} />
        ))}
        <SlideshowXboxCard
          title="My Playlist"
          images={[
            'https://via.placeholder.com/200x200/FF0000/FFFFFF?text=Image1',
            'https://via.placeholder.com/200x200/00FF00/FFFFFF?text=Image2',
            'https://via.placeholder.com/200x200/0000FF/FFFFFF?text=Image3',
          ]}
        />
      </div>
    ),
    2: (
      <div className={styles.section}>
        {data.gallery.map((card, index) => (
          <XboxCard key={index} title={card.title} iconUrl={card.iconUrl} />
        ))}
      </div>
    ),
    3: (
      <div className={styles.section}>
        {data.credits.map((card, index) => (
          <XboxCard key={index} title={card.title} iconUrl={card.iconUrl} />
        ))}
      </div>
    ),
  };

  return componentMapping[activeIndex] || <div>No content available</div>;
};

export default XboxDashboard;
