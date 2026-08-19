'use client';

import React from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import GameChannelCard from '@/components/GameChannelCard';
import { DOS_GAMES } from '@/data/gamesList';
import styles from './Games.module.css';

const GamesPage = () => (
  <PageLayout title="Games">
    <PageLayout.Header />
    <PageLayout.Body>
      <div className={styles.intro}>
        <p>
          <i>
            The DOS corner — original shareware episodes, emulated in your
            browser. Pick a channel.
          </i>
        </p>
      </div>
      <div className={styles.channelGrid}>
        {DOS_GAMES.map((game, index) => (
          <GameChannelCard key={game.slug} game={game} channel={index + 1} />
        ))}
      </div>
      <p className={styles.licenseNote}>
        Each game is its freely distributable shareware episode, shipped
        complete and unmodified with its original license. Emulation by{' '}
        <a href="https://js-dos.com" target="_blank" rel="noopener noreferrer">
          js-dos
        </a>{' '}
        (GPL-2.0).
      </p>
    </PageLayout.Body>
  </PageLayout>
);

export default GamesPage;
