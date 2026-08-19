'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import TVFrame from '@/components/TVFrame';
import { useAudioManager } from '@/hooks/useAudioManager';
import type { DosGame } from '@/data/gamesList';
import styles from './GameChannelCard.module.css';

interface GameChannelCardProps {
  game: DosGame;
  /** 1-based position, shown as the TV channel number */
  channel: number;
}

/**
 * One game on the /games hub, presented as a television tuned to its channel.
 * A plain link under the hood, so every game is Tab-reachable and crawlable.
 */
const GameChannelCard = memo<GameChannelCardProps>(({ game, channel }) => {
  const { playSound } = useAudioManager();

  return (
    <Link
      href={`/games/${game.slug}`}
      className={styles.card}
      onMouseEnter={() => playSound('ting')}
      onClick={() => playSound('channelUp')}
      aria-label={`Play ${game.title} (${game.year})`}
    >
      <TVFrame label={`${game.developer} · ${game.year}`}>
        <div className={styles.channelScreen}>
          <span className={styles.channelNumber}>CH {String(channel).padStart(2, '0')}</span>
          <span className={styles.gameTitle}>{game.title}</span>
          <span className={styles.episode}>{game.episode}</span>
        </div>
      </TVFrame>
      <p className={styles.blurb}>{game.blurb}</p>
    </Link>
  );
});

GameChannelCard.displayName = 'GameChannelCard';

export default GameChannelCard;
