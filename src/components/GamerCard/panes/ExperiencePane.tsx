'use client';

import React, { memo } from 'react';
import { Trophy } from 'lucide-react';
import { roles } from '../../../data/card';
import styles from './panes.module.css';

/**
 * Experience rendered as a list of "achievement unlocks" —
 * one tile per role, with quantified impact bullets.
 */
const ExperiencePane = memo(() => {
  return (
    <div className={styles.pane}>
      <div className={styles.paneHeader}>
        <Trophy className={styles.paneHeaderIcon} size={20} strokeWidth={1.5} />
        <h2 className={styles.paneTitle}>Experience</h2>
      </div>

      <ul className={styles.achievementList}>
        {roles.map((role) => (
          <li key={role.company} className={styles.achievement}>
            <div className={styles.achievementIcon} aria-hidden="true">
              <Trophy size={22} strokeWidth={1.5} />
            </div>
            <div className={styles.achievementBody}>
              <h3 className={styles.achievementTitle}>
                {role.title} — {role.company}
              </h3>
              <p className={styles.achievementMeta}>
                {role.period} · {role.location}
              </p>
              <ul className={styles.bullets}>
                {role.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});

ExperiencePane.displayName = 'ExperiencePane';

export default ExperiencePane;
