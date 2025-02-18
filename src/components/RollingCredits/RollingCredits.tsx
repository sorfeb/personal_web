import React, { useEffect, useState } from 'react';
import styles from './RollingCredits.module.css';

interface CreditsData {
  assets: string[];
  technologies: string[];
}

interface RollingCreditsProps {
  displayType: number; // 0 for assets, 1 for technologies
}

const RollingCredits: React.FC<RollingCreditsProps> = ({ displayType }) => {
  const [credits, setCredits] = useState<CreditsData | null>(null);

  useEffect(() => {
    import('@/data/credits.json')
      .then((data) => setCredits(data.default))
      .catch((error) => console.error('Error loading credits:', error));
  }, []);

  if (!credits) {
    return <div>Loading...</div>;
  }

  const itemsToDisplay = displayType === 0 ? credits.assets : credits.technologies;

  return (
    <div className={styles.creditsContainer}>
      <div className={styles.creditsContent}>
        <h2>{displayType === 0 ? 'Assets' : 'Technologies'}</h2>
        {itemsToDisplay.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    </div>
  );
};

export default RollingCredits;