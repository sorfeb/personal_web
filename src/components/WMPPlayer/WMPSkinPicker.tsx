'use client';

import React, { memo } from 'react';
import Button from '@/components/ui/Button';
import { SKINS } from '@/lib/wmp/skinRegistry';
import { useWMPPlayerContext } from '@/context/WMPPlayerContext';
import styles from './WMPSkinPicker.module.css';

/**
 * WMPSkinPicker
 *
 * Chooses which installed skin the player renders. Sits above the window
 * rather than inside it, because the skin owns every pixel of its own chrome
 * and has no slot to host a control that outlives it.
 *
 * A toolbar of toggle buttons rather than a listbox: the option count is the
 * number of skins in the registry (two today), each option is a direct
 * activation, and `ui/Button` already carries the audio feedback and
 * focus-visible treatment the rest of the dashboard uses.
 */
const WMPSkinPicker = memo(() => {
  const { skin, setSkinId } = useWMPPlayerContext();

  // A single installed skin is not a choice worth showing.
  if (SKINS.length < 2) return null;

  return (
    <div className={styles.picker} role="group" aria-label="Player skin">
      <span className={styles.label}>Skin</span>

      {SKINS.map((candidate) => (
        <Button
          key={candidate.id}
          variant="metallic"
          size="sm"
          active={candidate.id === skin.id}
          onClick={() => setSkinId(candidate.id)}
          title={`${candidate.label} — ${candidate.credit}`}
        >
          {candidate.label}
        </Button>
      ))}
    </div>
  );
});

WMPSkinPicker.displayName = 'WMPSkinPicker';

export default WMPSkinPicker;
export { WMPSkinPicker };
