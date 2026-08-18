'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Lock, Trophy } from 'lucide-react';
import { useAudioManager } from '../../../../hooks/useAudioManager';
import { useAchievements } from '../../../../hooks/useAchievements';
import { ACHIEVEMENT_LIST, TOTAL_GAMERSCORE } from '../../../../constants/achievements';
import styles from './AchievementsPage.module.css';

/**
 * AchievementsPage — the Xbox 360 achievements screen for the site.
 *
 * Catalog-driven: every achievement renders as a tile; locked ones are
 * dimmed, secret+locked ones are masked until earned. State comes from the
 * local achievement engine (localStorage), which is also the render source
 * for signed-in users — the server merge keeps the account in step.
 */
const AchievementsPage = memo(() => {
  const { playSound } = useAudioManager();
  const { isUnlocked, unlockedAt, unlockedIds, localGamerscore } = useAchievements();

  const formatDate = (iso?: string) => {
    if (!iso) return null;
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.summary}>
        <span className={styles.summaryScore}>
          {localGamerscore.toLocaleString()} / {TOTAL_GAMERSCORE.toLocaleString()}
          <Image
            src="/assets/icons/Gamerscore.gif"
            alt="Gamerscore"
            width={18}
            height={18}
            className={styles.summaryIcon}
          />
        </span>
        <span className={styles.summaryCount}>
          {unlockedIds.length} of {ACHIEVEMENT_LIST.length} unlocked
        </span>
      </div>

      <ul className={styles.list}>
        {ACHIEVEMENT_LIST.map((achievement) => {
          const unlocked = isUnlocked(achievement.id);
          const masked = Boolean(achievement.secret) && !unlocked;
          const earnedDate = formatDate(unlockedAt(achievement.id));

          return (
            <motion.li
              key={achievement.id}
              className={`${styles.tile} ${unlocked ? '' : styles.locked}`}
              onMouseEnter={() => playSound('owawa')}
              whileHover={{ x: 4 }}
            >
              <span className={styles.badge} aria-hidden="true">
                {unlocked ? (
                  <Image
                    src={achievement.icon ?? '/assets/icons/toast/trophy.png'}
                    alt=""
                    width={28}
                    height={28}
                    className={styles.badgeImage}
                  />
                ) : masked ? (
                  <Lock size={20} strokeWidth={1.5} />
                ) : (
                  <Trophy size={20} strokeWidth={1.5} />
                )}
              </span>

              <span className={styles.body}>
                <span className={styles.title}>
                  {masked ? 'Secret Achievement' : achievement.title}
                </span>
                <span className={styles.subtitle}>
                  {masked ? 'Keep exploring to reveal it' : achievement.subtitle}
                </span>
                {unlocked && earnedDate && (
                  <span className={styles.date}>Unlocked {earnedDate}</span>
                )}
              </span>

              <span className={styles.score}>
                {masked ? '??G' : `${achievement.score}G`}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
});

AchievementsPage.displayName = 'AchievementsPage';

export default AchievementsPage;
