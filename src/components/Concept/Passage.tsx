'use client';

import React, { memo } from 'react';
import type { CardPassageSection } from '@/data/concepts';
import WikilinkText from './WikilinkText';
import styles from './Passage.module.css';

interface PassageProps {
  section: CardPassageSection;
}

const Passage = memo<PassageProps>(({ section }) => (
  <p className={styles.passage}>
    <WikilinkText text={section.text} />
  </p>
));

Passage.displayName = 'Passage';

export default Passage;
