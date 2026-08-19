'use client';

import React, { memo } from 'react';
import styles from './TVFrame.module.css';

interface TVFrameProps {
  /**
   * Whether the set is switched on. Flipping this plays the CRT power-on /
   * power-off animation (a plain cut under prefers-reduced-motion). Parents
   * that navigate away after powering off should wait --duration-fast.
   */
  powered?: boolean;
  /** Small nameplate text under the screen (e.g. the game title) */
  label?: string;
  /** The screen content — an iframe, image, or anything 4:3 */
  children: React.ReactNode;
}

/**
 * A mid-2000s CRT television around whatever you put inside it.
 *
 * The frame is pure CSS (design tokens only); the screen slot keeps a 4:3
 * aspect ratio and layers scanline / vignette / glare effects over the
 * content with pointer-events: none, so an interactive child (the DOS
 * emulator iframe) stays fully clickable and focusable.
 */
const TVFrame = memo<TVFrameProps>(({ powered = true, label, children }) => (
  <div className={styles.tv} data-powered={powered ? 'on' : 'off'}>
    <div className={styles.bezel}>
      <div className={styles.screenWell}>
        <div className={styles.screen}>
          <div className={styles.content}>{children}</div>
          <div className={styles.scanlines} aria-hidden="true" />
          <div className={styles.vignette} aria-hidden="true" />
          <div className={styles.glare} aria-hidden="true" />
        </div>
      </div>
      <div className={styles.chin}>
        {label ? <span className={styles.nameplate}>{label}</span> : <span />}
        <span className={styles.powerLed} aria-hidden="true" />
      </div>
    </div>
    <div className={styles.feet} aria-hidden="true">
      <span className={styles.foot} />
      <span className={styles.foot} />
    </div>
  </div>
));

TVFrame.displayName = 'TVFrame';

export default TVFrame;
