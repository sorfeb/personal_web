'use client';

import React, { useCallback, useRef, useState } from 'react';
import styles from './ScrollingMenu.module.css';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { useEventListener, useGamepadScope } from '@/hooks';
import {
  bladeTabId,
  DASHBOARD_PANEL_ID,
  DASHBOARD_SCOPE_ID,
} from '../../constants/dashboardNavigation';

interface ScrollingMenuProps {
  items: string[];
  onSelectionChange: (index: number) => void;
  onItemClick?: (index: number) => void;
  disabled?: boolean;
}

/**
 * Blade menu — the Xbox 360 dashboard's section switcher.
 *
 * Implemented as the WAI-ARIA tabs pattern with a roving tabindex: the whole
 * list is a single tab stop, and arrows move within it. Blanket `tabIndex={0}`
 * would turn every blade into its own tab stop and make keyboard navigation
 * worse than none.
 */
const ScrollingMenu: React.FC<ScrollingMenuProps> = ({ items, onSelectionChange, onItemClick, disabled = false }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { playSound } = useAudioManager();
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /**
   * Roving tabindex: move real focus to the newly selected blade, but only when
   * focus already lives inside the list. Selection is also driven globally by
   * arrow keys and the wheel, and stealing focus from elsewhere on the page
   * would be hostile.
   */
  const focusSelectedTab = useCallback((index: number) => {
    const list = listRef.current;
    if (!list || !list.contains(document.activeElement)) return;
    tabRefs.current[index]?.focus({ preventScroll: true });
  }, []);

  const selectIndex = useCallback(
    (newIndex: number, sound: 'channelUp' | 'channelDown') => {
      if (newIndex === selectedIndex) return;
      setSelectedIndex(newIndex);
      onSelectionChange(newIndex);
      playSound(sound);
      focusSelectedTab(newIndex);
    },
    [selectedIndex, onSelectionChange, playSound, focusSelectedTab],
  );

  const handleNavigateUp = useCallback(() => {
    selectIndex(Math.max(selectedIndex - 1, 0), 'channelUp');
  }, [selectedIndex, selectIndex]);

  const handleNavigateDown = useCallback(() => {
    selectIndex(Math.min(selectedIndex + 1, items.length - 1), 'channelDown');
  }, [selectedIndex, items.length, selectIndex]);

  // Keyboard navigation (ArrowUp/ArrowDown)
  useKeyboardNavigation({
    onUp: handleNavigateUp,
    onDown: handleNavigateDown,
    canGoUp: selectedIndex > 0,
    canGoDown: selectedIndex < items.length - 1,
    enabled: !disabled,
  });

  /**
   * The blade list's half of the dashboard scope — the card stack contributes
   * `left`/`right` from `XboxDashboard`. Both halves live in one scope so a
   * modal pushed on top silences the whole dashboard at once.
   */
  useGamepadScope({
    id: DASHBOARD_SCOPE_ID,
    enabled: !disabled,
    handlers: {
      up: handleNavigateUp,
      down: handleNavigateDown,
    },
  });

  // Scroll wheel navigation
  useEventListener(
    disabled || typeof window === 'undefined' ? null : window,
    'wheel',
    (event: WheelEvent) => {
      const direction = Math.sign(event.deltaY);
      const newIndex = Math.min(Math.max(selectedIndex + direction, 0), items.length - 1);
      selectIndex(newIndex, direction > 0 ? 'channelDown' : 'channelUp');
    },
    { passive: true },
  );

  const playHoverSound = () => playSound('ting');

  const handleItemClick = (index: number) => {
    playSound('navigation');
    setSelectedIndex(index);
    onSelectionChange(index);
    onItemClick?.(index);
  };

  return (
    <nav className={styles.container} aria-label="Section navigation menu">
      <div
        ref={listRef}
        className={styles.menu}
        role="tablist"
        aria-orientation="vertical"
        style={{ transform: `translateY(-${selectedIndex * 5}px)` }}
      >
        {/* Animated dot indicator */}
        <div
          className={styles.dotIndicator}
          style={{ transform: `translateY(${selectedIndex * 40}px)` }}
          aria-hidden="true"
        />

        {items.map((item, index) => (
          <button
            key={item}
            type="button"
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={bladeTabId(index)}
            role="tab"
            aria-selected={index === selectedIndex}
            aria-controls={DASHBOARD_PANEL_ID}
            tabIndex={index === selectedIndex ? 0 : -1}
            className={`${styles.menuItem} ${index === selectedIndex ? styles.selected : ''}`}
            onClick={() => handleItemClick(index)}
            onMouseEnter={playHoverSound}
            onFocus={playHoverSound}
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default ScrollingMenu;
