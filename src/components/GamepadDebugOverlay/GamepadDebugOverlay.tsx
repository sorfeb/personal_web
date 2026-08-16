'use client';

import React, { useRef, useState } from 'react';
import { useMountEffect } from '@/hooks';
import { useGamepadContext } from '@/context/GamepadContext';
import type { GamepadIntent } from '@/types/gamepad';
import styles from './GamepadDebugOverlay.module.css';

/** Standard-mapping order. Index is the position in `gamepad.buttons`. */
const BUTTON_LABELS = [
  'A',
  'B',
  'X',
  'Y',
  'LB',
  'RB',
  'LT',
  'RT',
  'Back',
  'Start',
  'L3',
  'R3',
  'Up',
  'Down',
  'Left',
  'Right',
] as const;

const AXIS_LABELS = ['LX', 'LY', 'RX', 'RY'] as const;
const INTENT_LOG_LENGTH = 8;

/**
 * The panel itself. Mounted only when `?gamepad=debug` is present, so its
 * subscriptions never exist on a normal page load.
 *
 * Every value here updates at 60Hz and is written **straight to the DOM** —
 * `textContent` and data attributes — rather than through `setState`. A debug
 * tool that re-rendered the tree once per frame would change the very timing it
 * exists to measure.
 */
const DebugPanel: React.FC = () => {
  const { connected, inputMode, subscribeToFrames, subscribeToIntents } =
    useGamepadContext();

  const idRef = useRef<HTMLSpanElement>(null);
  const buttonRefs = useRef<(HTMLLIElement | null)[]>([]);
  const axisRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const logRef = useRef<HTMLPreElement>(null);
  const logLinesRef = useRef<string[]>([]);

  useMountEffect(() => {
    const unsubscribeFrames = subscribeToFrames((snapshot) => {
      if (idRef.current) {
        idRef.current.textContent = `#${snapshot.index} · ${snapshot.mapping || 'non-standard'} · ${snapshot.id}`;
      }

      snapshot.buttons.forEach((value, index) => {
        const node = buttonRefs.current[index];
        if (node) node.dataset.on = value > 0.5 ? 'true' : 'false';
      });

      snapshot.axes.forEach((value, index) => {
        const node = axisRefs.current[index];
        if (node) node.textContent = value.toFixed(2);
      });
    });

    const unsubscribeIntents = subscribeToIntents(
      (intent: GamepadIntent, scopeId: string | null) => {
        logLinesRef.current = [
          `${intent} → ${scopeId ?? '(no scope)'}`,
          ...logLinesRef.current,
        ].slice(0, INTENT_LOG_LENGTH);
        if (logRef.current) logRef.current.textContent = logLinesRef.current.join('\n');
      },
    );

    return () => {
      unsubscribeFrames();
      unsubscribeIntents();
    };
  });

  return (
    <aside className={styles.panel} aria-label="Gamepad debug readout">
      <header className={styles.header}>
        <strong>gamepad</strong>
        <span className={styles.status} data-connected={connected}>
          {connected ? 'connected' : 'waiting for input'}
        </span>
        <span className={styles.mode}>{inputMode}</span>
      </header>

      <span ref={idRef} className={styles.deviceId}>
        press any button to wake the pad
      </span>

      <ul className={styles.buttons}>
        {BUTTON_LABELS.map((label, index) => (
          <li
            key={label}
            ref={(node) => {
              buttonRefs.current[index] = node;
            }}
            className={styles.button}
            data-on="false"
          >
            {label}
          </li>
        ))}
      </ul>

      <dl className={styles.axes}>
        {AXIS_LABELS.map((label, index) => (
          <div key={label} className={styles.axis}>
            <dt>{label}</dt>
            <dd>
              <span
                ref={(node) => {
                  axisRefs.current[index] = node;
                }}
              >
                0.00
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <pre ref={logRef} className={styles.log} aria-live="off">
        no intents yet
      </pre>
    </aside>
  );
};

/**
 * Renders the gamepad debug readout when the URL carries `?gamepad=debug`.
 *
 * The flag is read from `window.location` after mount rather than through
 * `useSearchParams`, which would opt every page that renders this into dynamic
 * rendering (or demand a Suspense boundary) for a tool that is off by default.
 */
const GamepadDebugOverlay: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useMountEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('gamepad') === 'debug') setVisible(true);
  });

  if (!visible) return null;
  return <DebugPanel />;
};

export default GamepadDebugOverlay;
