'use client';

import React, { memo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TVFrame from '@/components/TVFrame';
import Button from '@/components/ui/Button';
import { useAudioManager } from '@/hooks/useAudioManager';
import { useDosBridge } from '@/hooks/useDosBridge';
import { useGamepadScope } from '@/hooks/useGamepadScope';
import { useMountEffect } from '@/hooks';
import { useWMPPlayerContext } from '@/context/WMPPlayerContext';
import { useIsMobile } from '@/utils/responsiveUtils';
import type { DosGame } from '@/data/gamesList';
import styles from './GamePlayer.module.css';

interface GamePlayerProps {
  game: DosGame;
}

/** Mirrors --duration-fast: exits animate faster than entrances. */
const POWER_OFF_MS = 200;

/**
 * The living room: a fullscreen stage with the DOS emulator playing inside a
 * CRT television. Quitting powers the set off first, then leaves the channel.
 *
 * Input model: keyboard goes straight into the emulator iframe (focus lives
 * there); the gamepad is synthesized into DOS keys by useDosBridge; and this
 * page's scope swallows every routed intent so the dashboard stays silent.
 */
const GamePlayer = memo<GamePlayerProps>(({ game }) => {
  const router = useRouter();
  const isMobile = useIsMobile(768);
  const { playSound } = useAudioManager();
  const { isVisible: wmpVisible, hidePlayer: hideWmp } = useWMPPlayerContext();

  const [powered, setPowered] = useState(true);

  const quit = () => {
    if (!powered) return;
    setPowered(false);
    playSound('back');
    // Let the power-off animation finish before changing channel.
    window.setTimeout(() => router.push('/games'), POWER_OFF_MS);
  };

  const { iframeRef, embedSrc, status } = useDosBridge({
    game,
    enabled: !isMobile,
    onQuitRequest: quit,
  });

  // One TV at a time: the WMP window would fight the game for audio.
  useMountEffect(() => {
    playSound('channelUp');
    if (wmpVisible) hideWmp();
  });

  // Topmost scope while a game runs. Directions/back are swallowed simply by
  // being unhandled; `confirm` needs an explicit no-op or the provider default
  // would click whatever element happens to hold focus (A is forwarded to the
  // game as Ctrl by useDosBridge instead).
  useGamepadScope({
    id: 'game-player',
    enabled: !isMobile,
    handlers: { confirm: () => {} },
  });

  if (isMobile) {
    return (
      <div className={styles.mobileNotice}>
        <h1 className={styles.mobileTitle}>{game.title}</h1>
        <p className={styles.mobileText}>
          The DOS corner is a desktop-only affair — these games want a keyboard
          (or a controller). Come back on a bigger screen.
        </p>
        <Link href="/" className={styles.mobileLink} onClick={() => playSound('back')}>
          Back to the dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.stage}>
      <div className={styles.tvWrap}>
        <TVFrame powered={powered} label={`${game.title} · ${game.year}`}>
          {status === 'exited' ? (
            <div className={styles.offAir}>
              <p className={styles.offAirText}>OFF AIR</p>
              <Button variant="ghost" onClick={quit}>
                Back to games
              </Button>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={embedSrc}
              title={`${game.title} — DOS emulator`}
              className={styles.emulator}
              allow="autoplay; fullscreen"
            />
          )}
        </TVFrame>
      </div>

      <footer className={styles.helpStrip}>
        <p className={styles.controls}>
          {status === 'booting' ? 'Tuning channel…' : game.controls}
        </p>
        <div className={styles.actions}>
          <span className={styles.hint}>Hold <b>B</b> to power off</span>
          <Button variant="ghost" badge="B" onClick={quit}>
            Power off
          </Button>
        </div>
      </footer>
    </div>
  );
});

GamePlayer.displayName = 'GamePlayer';

export default GamePlayer;
