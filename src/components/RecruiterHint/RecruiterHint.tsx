'use client';

import React, { memo } from 'react';
import { useRouter } from 'next/navigation';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useAchievements } from '../../hooks/useAchievements';
import styles from './RecruiterHint.module.css';

const RecruiterHint: React.FC = memo(() => {
  const router = useRouter();
  const { playSound } = useAudioManager();
  const { unlock } = useAchievements();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    playSound('panel');
    unlock('headhunter');
    router.push('/card');
  };

  return (
    <a
      href="/card"
      className={styles.pill}
      onClick={handleClick}
      aria-label="Recruiter? Skip to the business card view."
    >
      <span className={styles.label}>recruiter?</span>
      <span className={styles.arrow} aria-hidden="true">→</span>
      <span className={styles.route}>/card</span>
    </a>
  );
});

RecruiterHint.displayName = 'RecruiterHint';

export default RecruiterHint;
