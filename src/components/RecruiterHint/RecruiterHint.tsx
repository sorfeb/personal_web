'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useAchievements } from '../../hooks/useAchievements';
import styles from './RecruiterHint.module.css';

/**
 * RecruiterHint
 *
 * Inline chrome pill that hands recruiters the business card view instead of
 * making them read the whole profile. Lives in the profile contact block; it is
 * deliberately not a floating overlay.
 */
const RecruiterHint: React.FC = memo(() => {
  const { playSound } = useAudioManager();
  const { unlock } = useAchievements();

  const handleClick = () => {
    playSound('panel');
    unlock('headhunter');
  };

  return (
    <Link
      href="/card"
      className={styles.pill}
      onMouseEnter={() => playSound('hover')}
      onClick={handleClick}
      aria-label="Recruiter? Skip to the business card view."
    >
      <svg className={styles.icon} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1.4" y="3.4" width="13.2" height="9.2" rx="2.2" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="5.6" cy="7.6" r="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="M9.4 6.9h3.1M9.4 9.4h3.1"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      <span className={styles.label}>recruiter?</span>
      <svg className={styles.chevron} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M6.2 3.8 10.4 8l-4.2 4.2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
});

RecruiterHint.displayName = 'RecruiterHint';

export default RecruiterHint;
