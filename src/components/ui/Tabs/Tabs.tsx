'use client';

import React, {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { useAudioManager, type SoundType } from '@/hooks/useAudioManager';
import styles from './Tabs.module.css';

export interface TabItem {
  /** Stable key, and the value handed to `onChange`. */
  value: string;
  /**
   * Visible label. In the `guide` variant an inactive tab collapses this to
   * zero width rather than unmounting it, so it always contributes to the
   * button's accessible name.
   */
  label: string;
  /** Leading glyph. Rendered `aria-hidden`. */
  icon?: React.ReactNode;
  /**
   * Trailing value chip: a version string, an item count. Give it a
   * `badgeLabel` whenever the bare value would not make sense read aloud.
   */
  badge?: string | number;
  /** Screen-reader replacement for `badge`, e.g. "6 open items". */
  badgeLabel?: string;
  disabled?: boolean;
}

export interface TabsHandle {
  /**
   * Move selection by `delta` with wrap, skipping disabled tabs, and put real
   * DOM focus on the newly active tab. This is the gamepad entry point.
   */
  selectRelative: (delta: number) => void;
  /** Focus the active tab without changing selection. */
  focusActive: () => void;
}

export interface TabsProps {
  items: readonly TabItem[];
  value: string;
  onChange: (value: string) => void;
  /**
   * Accessible name for the tablist. Required: an unnamed tablist is the most
   * common failure of this pattern, and there is no sensible default.
   */
  label: string;
  /**
   * `guide` is the Xbox 360 Guide header: the active tab flexes wide with a
   * raised fill while the others collapse to icon plus badge and sit recessed.
   * `segmented` is an equal-width track with a sliding indicator.
   */
  variant?: 'guide' | 'segmented';
  orientation?: 'horizontal' | 'vertical';
  hoverSound?: SoundType | null;
  selectSound?: SoundType | null;
  className?: string;
  /**
   * Extra class on the tablist itself, for consumers that need to position it
   * independently of the panels (a sticky bar, for instance).
   */
  listClassName?: string;
  /** Panel region, normally `<Tabs.Panel>` elements. */
  children?: React.ReactNode;
}

export interface TabsPanelProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContextValue {
  value: string;
  tabId: (value: string) => string;
  panelId: (value: string) => string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

/**
 * The panel paired with one tab.
 *
 * Renders `null` when its tab is not active. Keeping every panel mounted would
 * leave stale content in the accessibility tree for no gain: this pattern is
 * for small static panels, not for anything expensive to re-create.
 */
const TabsPanel: React.FC<TabsPanelProps> = ({ value, children, className = '' }) => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('Tabs.Panel must be rendered inside <Tabs>');
  }

  if (context.value !== value) return null;

  return (
    <div
      role="tabpanel"
      id={context.panelId(value)}
      aria-labelledby={context.tabId(value)}
      /*
       * The panel itself is focusable, so it is reachable by Tab after the
       * tablist and D-pad `down` out of the tab bar always lands on something:
       * useSpatialNavigation ignores anything with tabIndex < 0.
       */
      tabIndex={0}
      className={`${styles.panel} ${className}`.trim()}
    >
      {children}
    </div>
  );
};

/**
 * Tabs: the WAI-ARIA tabs pattern with a roving tabindex.
 *
 * The whole tablist is a single tab stop and arrows move within it. Blanket
 * `tabIndex={0}` would make every tab its own stop and leave keyboard
 * navigation worse than none.
 *
 * Selection is *controlled*. There is deliberately no uncontrolled mode: the
 * gamepad handler and the tab badges both need to read the current value, and
 * a second source of truth would drift the moment pad and pointer disagree.
 *
 * Activation is automatic (selection follows focus), which APG recommends when
 * panels are cheap to render.
 */
const TabsRoot = forwardRef<TabsHandle, TabsProps>(function Tabs(
  {
    items,
    value,
    onChange,
    label,
    variant = 'guide',
    orientation = 'horizontal',
    hoverSound = 'hover',
    selectSound = 'panel',
    className = '',
    listClassName = '',
    children,
  },
  ref,
) {
  const uid = useId();
  const { playSound } = useAudioManager();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const tabId = useCallback((item: string) => `${uid}-tab-${item}`, [uid]);
  const panelId = useCallback((item: string) => `${uid}-panel-${item}`, [uid]);

  const selectable = useMemo(() => items.filter((item) => !item.disabled), [items]);

  /**
   * The single mutation path. Click, arrow keys and the gamepad all funnel
   * through here, so DOM focus can never disagree with `aria-selected`.
   */
  const select = useCallback(
    (next: string) => {
      const target = items.find((item) => item.value === next);
      if (!target || target.disabled) return;

      /*
       * Focus moves even when the value is unchanged. Every tab button stays
       * mounted, so the node is live before React re-renders and moving focus
       * synchronously here is safe. It also covers Safari, which does not
       * focus a button on click.
       */
      tabRefs.current[next]?.focus({ preventScroll: true });

      if (next === value) return;
      onChange(next);
      if (selectSound) playSound(selectSound);
    },
    [items, value, onChange, selectSound, playSound],
  );

  const selectRelative = useCallback(
    (delta: number) => {
      const count = selectable.length;
      if (count === 0) return;

      const current = selectable.findIndex((item) => item.value === value);
      /*
       * An active value that is missing or disabled counts as "before the
       * start", so a forward step enters at the first selectable tab.
       */
      const base = current === -1 ? -1 : current;
      const next = (((base + delta) % count) + count) % count;

      select(selectable[next].value);
    },
    [selectable, value, select],
  );

  useImperativeHandle(
    ref,
    () => ({
      selectRelative,
      focusActive: () => tabRefs.current[value]?.focus({ preventScroll: true }),
    }),
    [selectRelative, value],
  );

  /*
   * Keydown lives on the tab buttons, not on the tablist. With a roving
   * tabindex focus is always on a tab, so this fires identically, and it keeps
   * the tablist itself out of the tab order -- a focusable tablist would be a
   * second stop for the same widget.
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const isVertical = orientation === 'vertical';
    const previousKey = isVertical ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';

    if (event.key === previousKey) {
      selectRelative(-1);
    } else if (event.key === nextKey) {
      selectRelative(1);
    } else if (event.key === 'Home') {
      select(selectable[0]?.value ?? value);
    } else if (event.key === 'End') {
      select(selectable[selectable.length - 1]?.value ?? value);
    } else {
      return;
    }

    event.preventDefault();
  };

  const activeIndex = items.findIndex((item) => item.value === value);

  const context = useMemo<TabsContextValue>(
    () => ({ value, tabId, panelId }),
    [value, tabId, panelId],
  );

  return (
    <TabsContext.Provider value={context}>
      <div className={`${styles.tabs} ${styles[variant]} ${className}`.trim()}>
        <div
          role="tablist"
          aria-label={label}
          aria-orientation={orientation}
          className={`${styles.list} ${listClassName}`.trim()}
          style={
            {
              '--tab-count': items.length,
              '--tab-active-index': Math.max(activeIndex, 0),
            } as React.CSSProperties
          }
        >
          {variant === 'segmented' && <div className={styles.indicator} aria-hidden="true" />}

          {items.map((item) => {
            const isActive = item.value === value;

            return (
              <button
                key={item.value}
                type="button"
                ref={(node) => {
                  tabRefs.current[item.value] = node;
                }}
                id={tabId(item.value)}
                role="tab"
                aria-selected={isActive}
                aria-controls={panelId(item.value)}
                tabIndex={isActive ? 0 : -1}
                disabled={item.disabled}
                className={styles.tab}
                onKeyDown={handleKeyDown}
                onClick={() => select(item.value)}
                onMouseEnter={() => {
                  if (hoverSound && !item.disabled) playSound(hoverSound);
                }}
              >
                {item.icon && (
                  <span className={styles.icon} aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                <span className={styles.label}>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={styles.badge}>
                    <span aria-hidden={item.badgeLabel ? true : undefined}>{item.badge}</span>
                    {item.badgeLabel && <span className={styles.srOnly}>{item.badgeLabel}</span>}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {children}
      </div>
    </TabsContext.Provider>
  );
});

const Tabs = Object.assign(memo(TabsRoot), { Panel: TabsPanel });

export default Tabs;
