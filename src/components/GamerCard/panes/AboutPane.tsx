'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { ScrollText, Sparkles } from 'lucide-react';
import {
  CARD_COLOPHON,
  CARD_GEAR,
  CARD_INSPIRATIONS,
  CARD_INTERESTS,
  CARD_LIKES,
} from '../../../data/concepts';
import { useAudioManager } from '@/hooks/useAudioManager';
import { useNavigationSound } from '@/hooks/useNavigationSound';
import { ChipGroup, Passage } from '../../Concept';
import styles from './panes.module.css';

/**
 * The concept-graph surface of the card: interests as live prose,
 * then likes / gear / inspirations / colophon as tappable chips.
 * All mentions share the popover hosted by ConceptGraphProvider.
 */
const AboutPane = memo(() => {
  const { playSound } = useAudioManager();
  const { playNavigationSound } = useNavigationSound();

  return (
    <div className={styles.pane}>
      <div className={styles.paneHeader}>
        <Sparkles className={styles.paneHeaderIcon} size={20} strokeWidth={1.5} />
        <h2 className={styles.paneTitle}>About Me</h2>
      </div>

      <div className={styles.skillGroups}>
        <div className={styles.skillGroup}>
          <h3 className={styles.skillGroupLabel}>Current interests</h3>
          <Passage section={CARD_INTERESTS} />
        </div>

        <div className={styles.skillGroup}>
          <h3 className={styles.skillGroupLabel}>Likes</h3>
          <ChipGroup chips={CARD_LIKES.chips} />
        </div>

        <div className={styles.skillGroup}>
          <h3 className={styles.skillGroupLabel}>Gear</h3>
          <ChipGroup chips={CARD_GEAR.chips} />
        </div>

        <div className={styles.skillGroup}>
          <h3 className={styles.skillGroupLabel}>Inspirations</h3>
          <ChipGroup chips={CARD_INSPIRATIONS.chips} />
        </div>

        <div className={styles.skillGroup}>
          <h3 className={styles.skillGroupLabel}>Colophon</h3>
          <ChipGroup chips={CARD_COLOPHON.chips} />
          <Link
            href="/changelog"
            className={styles.colophonLink}
            onClick={playNavigationSound}
            onMouseEnter={() => playSound('hover')}
          >
            <ScrollText size={14} strokeWidth={1.5} aria-hidden />
            <span>System Update — what shipped, and when</span>
          </Link>
        </div>
      </div>
    </div>
  );
});

AboutPane.displayName = 'AboutPane';

export default AboutPane;
