'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { Contact } from 'lucide-react';
import { identity, stats } from '../../data/card';
import styles from './IdentityPanel.module.css';

interface IdentityPanelProps {
  /** Owned by GamerCard so vCard download, sound and toast stay in one place. */
  onSaveContact: () => void;
  onHoverSound: () => void;
}

/**
 * The right-pane identity block of the Profile screen:
 * gamertag strip, gamerpic, stat rows and the Save Contact action.
 */
const IdentityPanel = memo<IdentityPanelProps>(({ onSaveContact, onHoverSound }) => {
  return (
    <div className={styles.identity}>
      <div className={styles.gamertagStrip}>
        <h1 className={styles.gamertag}>{identity.name}</h1>
      </div>

      <div className={styles.body}>
        <div className={styles.avatarFrame}>
          <Image
            src={identity.avatarSrc}
            alt={`${identity.name} avatar`}
            width={96}
            height={96}
            sizes="96px"
            className={styles.avatarImage}
            priority
          />
        </div>

        <dl className={styles.statList}>
          <div className={styles.statRow}>
            <dt className={styles.statLabel}>Projects</dt>
            <dd className={styles.statValue}>{stats.projects}</dd>
          </div>
          <div className={styles.statRow}>
            <dt className={styles.statLabel}>Gamerscore</dt>
            <dd className={styles.statValue}>
              {stats.gamerscore.toLocaleString()}
              <Image
                src="/assets/icons/Gamerscore.gif"
                alt=""
                width={18}
                height={18}
                className={styles.gamerscoreIcon}
              />
            </dd>
          </div>
          <div className={styles.statRow}>
            <dt className={styles.statLabel}>Achievements</dt>
            <dd className={styles.statValue}>{stats.achievements}</dd>
          </div>
        </dl>
      </div>

      <div className={styles.headline}>
        <p className={styles.title}>{identity.title}</p>
        <p className={styles.status}>
          <span className={styles.statusDot} aria-hidden="true" />
          {identity.statusLine}
        </p>
        <p className={styles.tagline}>{identity.tagline}</p>
      </div>

      <button
        type="button"
        className={styles.saveButton}
        onClick={onSaveContact}
        onMouseEnter={onHoverSound}
      >
        <Contact size={18} strokeWidth={1.75} aria-hidden="true" />
        Save Contact
      </button>
    </div>
  );
});

IdentityPanel.displayName = 'IdentityPanel';

export default IdentityPanel;
