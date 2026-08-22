'use client';

import React, { useRef, useState } from 'react';
import PageLayout, { usePageLayout } from '@/components/PageLayout';
import Button from '@/components/ui/Button';
import { SpotifyEmbed } from '@/components/WMPPlayer/engines/SpotifyEmbed';
import { useWMPPlayer } from '@/hooks/useWMPPlayer';
import { useAudioManager } from '@/hooks/useAudioManager';
import { useWMPPlayerContext } from '@/context/WMPPlayerContext';
import { useGamepadScope } from '@/hooks/useGamepadScope';
import { useSpatialNavigation } from '@/hooks/useSpatialNavigation';
import { trpc } from '@/utils/trpc';
import styles from './Playlists.module.css';

/**
 * /my-playlists — replica of the Xbox 360 dashboard "Now Playing" music screen.
 *
 * Left: white player card (transport row, playlist strip, track title, progress,
 * visualization area). Right: the track list with an "N of M" footer. The right
 * panel doubles as the playlist chooser until a playlist is loaded.
 *
 * Playback is a page-local `useWMPPlayer`. Spotify playlist tracks are
 * `source: 'spotify-embed'`, so the embed iframe in the visualization area owns
 * actual audio; transport buttons drive the WMP reducer (real for prev/next,
 * cosmetic for play/pause/seek on embeds — same limitation as WMPPlayer).
 */

interface PlaylistSummary {
  id: string;
  name: string;
}

const PlayIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <path d="M4 2l9 6-9 6z" fill="currentColor" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <path d="M4 2h3v12H4zm5 0h3v12H9z" fill="currentColor" />
  </svg>
);

const StopIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <rect x="3.5" y="3.5" width="9" height="9" fill="currentColor" />
  </svg>
);

const PrevIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <path d="M4 2h2v12H4zm9 0L6.5 8 13 14z" fill="currentColor" />
  </svg>
);

const NextIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <path d="M10 2h2v12h-2zM3 2l6.5 6L3 14z" fill="currentColor" />
  </svg>
);

const SpeakerIcon = ({ muted }: { muted: boolean }) => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <path d="M2 6h3l4-4v12l-4-4H2z" fill="currentColor" />
    {muted ? (
      <path
        d="M10.5 6l4 4m0-4l-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    ) : (
      <path
        d="M11 5.5a3.5 3.5 0 010 5M12.5 3.5a6 6 0 010 9"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    )}
  </svg>
);

interface TransportButtonProps {
  label: string;
  onClick: () => void;
  /** Painted Xbox-green, like the lit play button in the dashboard. */
  active?: boolean;
  /** For genuine toggles (mute). */
  pressed?: boolean;
}

/**
 * The WMP transport squares live on the card's light surface, which none of the
 * dark `ui/Button` variants are drawn for — so, like WMPPlaylistDrawer's rows,
 * these are bespoke buttons with the same audio and focus-visible contract.
 */
const TransportButton = ({
  label,
  onClick,
  active = false,
  pressed,
  children,
}: React.PropsWithChildren<TransportButtonProps>) => {
  const { playSound } = useAudioManager();

  return (
    <button
      type="button"
      className={active ? `${styles.transportBtn} ${styles.transportBtnActive}` : styles.transportBtn}
      aria-label={label}
      aria-pressed={pressed}
      onMouseEnter={() => playSound('hover')}
      onFocus={() => playSound('hover')}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

interface LegendBarProps {
  inTracks: boolean;
  spotifyUrl?: string;
  onBackToList: () => void;
  onOpenSpotify: () => void;
}

/** Bottom glyph legend. Separate component so it can reach PageLayout's close. */
const LegendBar = ({ inTracks, spotifyUrl, onBackToList, onOpenSpotify }: LegendBarProps) => {
  const { handleClose } = usePageLayout();

  return (
    <div className={styles.legend}>
      <span className={styles.legendHint} aria-hidden="true">
        <span className={styles.legendBadgeA}>A</span>
        Select
      </span>
      <Button variant="ghost" size="sm" badge="B" onClick={inTracks ? onBackToList : handleClose}>
        Back
      </Button>
      {spotifyUrl && (
        <Button variant="ghost" size="sm" badge="Y" onClick={onOpenSpotify}>
          Open in Spotify
        </Button>
      )}
    </div>
  );
};

const PlaylistsPage = () => {
  const { playSound } = useAudioManager();
  const { hidePlayer } = useWMPPlayerContext();
  const player = useWMPPlayer();
  const utils = trpc.useUtils();

  const [selected, setSelected] = useState<PlaylistSummary | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  /** Focused-row index feeding the "N of M" footer, updated on focus/hover edges. */
  const [cursor, setCursor] = useState(0);

  const bodyRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { data, isLoading } = trpc.spotify.getPlaylists.useQuery();
  const playlists = data?.items ?? [];

  const { state } = player;
  const currentTrack = state.currentTrack;
  const spotifyUrl =
    currentTrack?.source === 'spotify-embed' ? currentTrack.spotifyUrl : undefined;
  const inTracks = selected !== null;
  const rowCount = inTracks ? state.playlist.length : playlists.length;
  const progressRatio =
    Number.isFinite(state.duration) && state.duration > 0
      ? Math.min(state.currentTime / state.duration, 1)
      : 0;

  const handleSelectPlaylist = async (playlist: PlaylistSummary) => {
    if (loadingId) return;
    setLoadingId(playlist.id);
    setNotice(null);
    try {
      const tracks = await utils.spotify.getPlaylistTracks.fetch({ playlistId: playlist.id });
      if (tracks.length === 0) {
        setNotice(`“${playlist.name}” has no playable tracks.`);
        return;
      }
      // One player at a time: silence the floating WMP window before this
      // page's own useWMPPlayer takes over.
      hidePlayer();
      player.setPlaylist(tracks);
      player.play(tracks[0]);
      setSelected(playlist);
      setCursor(0);
      playSound('unfold');
    } catch {
      setNotice(`Failed to load “${playlist.name}”. Try again.`);
    } finally {
      setLoadingId(null);
    }
  };

  const handleSelectTrack = (index: number) => {
    player.setPlaylistIndex(index);
    player.play();
  };

  const handleBackToPlaylists = () => {
    playSound('back');
    setSelected(null);
    setCursor(0);
  };

  const handleTogglePlay = () => {
    playSound('click');
    if (state.isPlaying) player.pause();
    else player.play();
  };

  const handleStop = () => {
    playSound('click');
    player.stop();
  };

  const handlePrev = () => {
    playSound('channelDown');
    player.prev();
  };

  const handleNext = () => {
    playSound('channelUp');
    player.next();
  };

  const handleToggleMute = () => {
    playSound('click');
    player.toggleMute();
  };

  const handleOpenSpotify = () => {
    if (!spotifyUrl) return;
    playSound('ting');
    window.open(spotifyUrl, '_blank', 'noopener,noreferrer');
  };

  const scrollList = (direction: -1 | 1) => {
    playSound('click');
    const list = listRef.current;
    if (list) list.scrollBy({ top: direction * list.clientHeight * 0.8 });
  };

  // While a playlist is open this scope sits above PageLayout's 'page' scope,
  // so it must re-declare directional focus movement; `back` returns to the
  // playlist chooser instead of closing the page. LB/RB skip tracks, Y opens
  // the current track on Spotify.
  const { moveFocus } = useSpatialNavigation({ containerRef: bodyRef, enabled: inTracks });
  useGamepadScope({
    id: 'now-playing',
    enabled: inTracks,
    restoreFocusOnPop: true,
    handlers: {
      up: () => moveFocus('up'),
      down: () => moveFocus('down'),
      left: () => moveFocus('left'),
      right: () => moveFocus('right'),
      back: handleBackToPlaylists,
      pageLeft: handlePrev,
      pageRight: handleNext,
      alt: handleOpenSpotify,
    },
  });

  const trackLabel = (name: string, artist?: string) => (artist ? `${artist} - ${name}` : name);

  return (
    // Title must stay constant: PageLayout keys its dialog on the title, so a
    // dynamic one remounts the whole window (and the embed iframe with it).
    <PageLayout title="My Playlists" size="wide">
      <PageLayout.Header />
      <PageLayout.Body>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <span className={styles.loadingText}>Loading</span>
            <div className={styles.dots}>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
            </div>
          </div>
        ) : (
          <div className={styles.nowPlaying} ref={bodyRef}>
            <section className={styles.playerCard} aria-label="Player">
              <div className={styles.transportRow}>
                <TransportButton
                  label={state.isPlaying ? 'Pause' : 'Play'}
                  active={state.isPlaying}
                  onClick={handleTogglePlay}
                >
                  {state.isPlaying ? <PauseIcon /> : <PlayIcon />}
                </TransportButton>
                <TransportButton label="Previous track" onClick={handlePrev}>
                  <PrevIcon />
                </TransportButton>
                <TransportButton label="Stop" onClick={handleStop}>
                  <StopIcon />
                </TransportButton>
                <TransportButton label="Next track" onClick={handleNext}>
                  <NextIcon />
                </TransportButton>
                <TransportButton
                  label={state.muted ? 'Unmute' : 'Mute'}
                  pressed={state.muted}
                  onClick={handleToggleMute}
                >
                  <SpeakerIcon muted={state.muted} />
                </TransportButton>
              </div>

              {inTracks ? (
                <button
                  type="button"
                  className={styles.playlistStrip}
                  onMouseEnter={() => playSound('hover')}
                  onFocus={() => playSound('hover')}
                  onClick={handleBackToPlaylists}
                >
                  Change Playlist
                </button>
              ) : (
                <div className={styles.playlistStripStatic}>Select a playlist</div>
              )}

              <p className={styles.trackTitle}>
                {currentTrack
                  ? trackLabel(currentTrack.name, currentTrack.artist)
                  : 'Nothing playing'}
              </p>

              <div className={styles.progressGroup}>
                {state.duration > 0 ? (
                  <div
                    className={styles.progressTrack}
                    role="progressbar"
                    aria-label="Track progress"
                    aria-valuemin={0}
                    aria-valuemax={Math.round(state.duration)}
                    aria-valuenow={Math.round(state.currentTime)}
                    aria-valuetext={`${state.positionString} of ${state.durationString}`}
                  >
                    <div
                      className={styles.progressFill}
                      style={{ width: `${progressRatio * 100}%` }}
                    />
                  </div>
                ) : (
                  <div className={styles.progressTrack} aria-hidden="true">
                    <div className={styles.progressFill} style={{ width: '0%' }} />
                  </div>
                )}
                <span className={styles.timeLabel}>{state.positionString}</span>
              </div>

              <div className={styles.vizArea}>
                {currentTrack?.source === 'spotify-embed' ? (
                  <SpotifyEmbed track={currentTrack} />
                ) : (
                  <div className={styles.vizPlaceholder} aria-hidden="true" />
                )}
              </div>

              <div className={styles.vizFooter}>
                <button
                  type="button"
                  className={styles.bumper}
                  aria-label="Previous track (LB)"
                  onMouseEnter={() => playSound('hover')}
                  onFocus={() => playSound('hover')}
                  onClick={handlePrev}
                >
                  LB
                </button>
                <button
                  type="button"
                  className={styles.bumper}
                  aria-label="Next track (RB)"
                  onMouseEnter={() => playSound('hover')}
                  onFocus={() => playSound('hover')}
                  onClick={handleNext}
                >
                  RB
                </button>
              </div>
            </section>

            <section
              className={styles.trackPanel}
              aria-label={inTracks ? 'Track list' : 'Playlists'}
            >
              {notice && (
                <p className={styles.notice} role="alert">
                  {notice}
                </p>
              )}
              <ul className={styles.list} ref={listRef}>
                {inTracks
                  ? state.playlist.map((track, index) => {
                      const isActive = index === state.playlistIndex;
                      return (
                        <li key={track.id}>
                          <button
                            type="button"
                            className={
                              isActive ? `${styles.row} ${styles.rowActive}` : styles.row
                            }
                            aria-current={isActive ? 'true' : undefined}
                            onMouseEnter={() => {
                              playSound('hover');
                              setCursor(index);
                            }}
                            onFocus={() => {
                              playSound('hover');
                              setCursor(index);
                            }}
                            onClick={() => {
                              playSound('click');
                              handleSelectTrack(index);
                            }}
                          >
                            <span className={styles.rowLabel}>
                              {trackLabel(track.name, track.artist)}
                            </span>
                            {isActive && (
                              <span
                                className={
                                  state.isPlaying
                                    ? styles.eqIcon
                                    : `${styles.eqIcon} ${styles.eqIconPaused}`
                                }
                                aria-hidden="true"
                              >
                                <span />
                                <span />
                                <span />
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })
                  : playlists.map((playlist, index) => (
                      <li key={playlist.id}>
                        <button
                          type="button"
                          className={
                            loadingId === playlist.id
                              ? `${styles.row} ${styles.rowLoading}`
                              : styles.row
                          }
                          aria-label={`Load ${playlist.name}`}
                          onMouseEnter={() => {
                            playSound('hover');
                            setCursor(index);
                          }}
                          onFocus={() => {
                            playSound('hover');
                            setCursor(index);
                          }}
                          onClick={() => {
                            playSound('click');
                            void handleSelectPlaylist({ id: playlist.id, name: playlist.name });
                          }}
                        >
                          <span className={styles.rowLabel}>{playlist.name}</span>
                          {loadingId === playlist.id && (
                            <span className={styles.rowMeta}>Loading&hellip;</span>
                          )}
                        </button>
                      </li>
                    ))}
              </ul>
              <div className={styles.listFooter}>
                <span>
                  {rowCount === 0 ? '0 of 0' : `${Math.min(cursor + 1, rowCount)} of ${rowCount}`}
                </span>
                <div className={styles.chevrons}>
                  <button
                    type="button"
                    className={styles.chevronBtn}
                    aria-label="Scroll up"
                    onMouseEnter={() => playSound('hover')}
                    onFocus={() => playSound('hover')}
                    onClick={() => scrollList(-1)}
                  >
                    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                      <path
                        d="M3 10l5-5 5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={styles.chevronBtn}
                    aria-label="Scroll down"
                    onMouseEnter={() => playSound('hover')}
                    onFocus={() => playSound('hover')}
                    onClick={() => scrollList(1)}
                  >
                    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                      <path
                        d="M3 6l5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
        {/* Footer must render inside Body: the window is the flex column its
            margin-top auto is written for. As a Body sibling it pins itself to
            the viewport bottom and shoves the window under the page title. */}
        <PageLayout.Footer>
          <LegendBar
            inTracks={inTracks}
            spotifyUrl={spotifyUrl}
            onBackToList={handleBackToPlaylists}
            onOpenSpotify={handleOpenSpotify}
          />
        </PageLayout.Footer>
      </PageLayout.Body>
    </PageLayout>
  );
};

export default PlaylistsPage;
