'use client';

import React, { memo } from 'react';
import type { SectionId } from './sections';
import { TAB_ITEMS } from './sections';
import styles from './TabBar.module.css';

interface TabBarProps {
  /** Section currently in view (driven by scroll-spy). */
  activeId: SectionId;
  onSelect: (id: SectionId) => void;
}

/**
 * Mobile-only bottom tab bar: taps scroll to the matching section,
 * the green indicator tracks whichever section is currently in view.
 */
const TabBar = memo<TabBarProps>(({ activeId, onSelect }) => {
  return (
    <nav className={styles.tabBar} aria-label="Card sections">
      {TAB_ITEMS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className={`${styles.tab} ${id === activeId ? styles.tabActive : ''}`}
          aria-current={id === activeId ? 'true' : undefined}
          onClick={() => onSelect(id)}
        >
          <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
          <span className={styles.tabLabel}>{label}</span>
        </button>
      ))}
    </nav>
  );
});

TabBar.displayName = 'TabBar';

export default TabBar;
