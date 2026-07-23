'use client';

import React, { memo } from 'react';
import type { ConceptChipSpec } from '@/data/concepts';
import ConceptChip from './ConceptChip';
import styles from './ConceptChip.module.css';

interface ChipGroupProps {
  chips: ConceptChipSpec[];
}

const ChipGroup = memo<ChipGroupProps>(({ chips }) => (
  <ul className={styles.chipList}>
    {chips.map((chip) => (
      <ConceptChip key={chip.label} chip={chip} />
    ))}
  </ul>
));

ChipGroup.displayName = 'ChipGroup';

export default ChipGroup;
