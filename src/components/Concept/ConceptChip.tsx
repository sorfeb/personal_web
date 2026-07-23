'use client';

import React, { memo } from 'react';
import type { ConceptChipSpec } from '@/data/concepts';
import WikilinkText from './WikilinkText';
import styles from './ConceptChip.module.css';

interface ConceptChipProps {
  chip: ConceptChipSpec;
}

const ConceptChip = memo<ConceptChipProps>(({ chip }) => (
  <li className={styles.chip}>
    <span className={styles.label}>
      <WikilinkText text={chip.label} />
    </span>
    {chip.note && (
      <span className={styles.note}>
        <WikilinkText text={chip.note} />
      </span>
    )}
  </li>
));

ConceptChip.displayName = 'ConceptChip';

export default ConceptChip;
