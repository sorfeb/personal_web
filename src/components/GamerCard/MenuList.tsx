'use client';

import React, { memo } from 'react';
import type { MenuItem } from './sections';
import styles from './MenuList.module.css';

interface MenuListProps {
  items: MenuItem[];
  /** Index of the row holding the green selection bar. */
  cursorIndex: number;
  onCursorChange: (index: number) => void;
  onActivate: (item: MenuItem) => void;
}

/**
 * Desktop-only left menu column replicating the blades-era Profile
 * screen list ("View Games" / "Edit Profile" / ...): hairline-divided
 * rows with a glossy green bar on the current selection.
 */
const MenuList = memo<MenuListProps>(({ items, cursorIndex, onCursorChange, onActivate }) => {
  return (
    <ul className={styles.menu} role="menu">
      {items.map((item, index) => (
        <li key={item.id} role="none">
          <button
            type="button"
            role="menuitem"
            className={`${styles.row} ${index === cursorIndex ? styles.rowSelected : ''}`}
            onMouseEnter={() => onCursorChange(index)}
            onFocus={() => onCursorChange(index)}
            onClick={() => onActivate(item)}
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
});

MenuList.displayName = 'MenuList';

export default MenuList;
