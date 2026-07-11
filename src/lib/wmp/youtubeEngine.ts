/**
 * Framework-agnostic wrapper around the YouTube IFrame Player API, so the WMP
 * player can drive YouTube as a headless audio backend. It exposes the same
 * imperative surface as an HTMLAudioElement (load / play / pause / seek /
 * volume) plus a set of callbacks, letting `useWMPPlayer` treat YouTube exactly
 * like the `<audio>` element it already manages.
 *
 * The engine owns a hidden container appended to <body>. YouTube refuses to
 * play when the player is `display: none`, so the container is positioned
 * offscreen (present in the DOM, visually gone) rather than hidden outright.
 *
 * Only the slice of the IFrame API we use is typed below, which avoids taking
 * on a `@types/youtube` dependency.
 */

interface YTPlayerVars {
  autoplay?: 0 | 1;
  controls?: 0 | 1;
  disablekb?: 0 | 1;
  modestbranding?: 0 | 1;
  rel?: 0 | 1;
  playsinline?: 0 | 1;
  iv_load_policy?: 1 | 3;
  origin?: string;
}

interface YTPlayerEvent {
  target: YTPlayer;
  data: number;
}

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
  loadVideoById(videoId: string): void;
  cueVideoById(videoId: string): void;
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}

interface YTNamespace {
  Player: new (
    el: HTMLElement | string,
    opts: {
      width?: string | number;
      height?: string | number;
      videoId?: string;
      playerVars?: YTPlayerVars;
      events?: {
        onReady?: (event: YTPlayerEvent) => void;
        onStateChange?: (event: YTPlayerEvent) => void;
        onError?: (event: YTPlayerEvent) => void;
      };
    }
  ) => YTPlayer;
  PlayerState: {
    UNSTARTED: -1;
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const IFRAME_API_SRC = 'https://www.youtube.com/iframe_api';

/** Progress poll cadence while playing (ms). Matches WMP's ~1/sec LCD needs. */
const POLL_INTERVAL_MS = 250;

let apiPromise: Promise<YTNamespace> | null = null;

/**
 * Load the IFrame API exactly once. Chains any pre-existing
 * `onYouTubeIframeAPIReady` so we don't clobber another consumer.
 */
function loadIframeApi(): Promise<YTNamespace> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('YouTube IFrame API requires a browser'));
  }
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<YTNamespace>((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };

    // Reuse an existing tag if the script is already in flight.
    const existing = document.querySelector(
      `script[src="${IFRAME_API_SRC}"]`
    );
    if (!existing) {
      const tag = document.createElement('script');
      tag.src = IFRAME_API_SRC;
      document.head.appendChild(tag);
    }
  });

  return apiPromise;
}

export interface YouTubeEngineCallbacks {
  /** Fired ~4x/sec while playing with the current position in seconds. */
  onTime?: (seconds: number) => void;
  /** Fired once per track when the duration becomes known. */
  onDuration?: (seconds: number) => void;
  /** Fired when the video reaches its end. */
  onEnded?: () => void;
  /** Buffering (true) / ready-to-play (false). */
  onLoadingChange?: (loading: boolean) => void;
  /** A playback/network error occurred. */
  onError?: (message: string) => void;
}

/**
 * Imperative YouTube playback engine. One instance per WMP player; reused
 * across tracks via {@link load}.
 */
export class YouTubeEngine {
  private readonly container: HTMLDivElement;
  private readonly mountEl: HTMLDivElement;
  private player: YTPlayer | null = null;
  private ready = false;
  private destroyed = false;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private pending: { videoId: string; autoplay: boolean } | null = null;
  private currentVideoId: string | null = null;
  private lastDuration = 0;
  private pendingVolume: number | null = null;

  constructor(private readonly callbacks: YouTubeEngineCallbacks) {
    this.container = document.createElement('div');
    Object.assign(this.container.style, {
      position: 'fixed',
      left: '-10000px',
      top: '0px',
      width: '200px',
      height: '200px',
      opacity: '0',
      pointerEvents: 'none',
    } satisfies Partial<CSSStyleDeclaration>);
    this.container.setAttribute('aria-hidden', 'true');

    // YT replaces the passed element with the iframe, so mount on a child.
    this.mountEl = document.createElement('div');
    this.container.appendChild(this.mountEl);
    document.body.appendChild(this.container);
  }

  /** Load the IFrame API and instantiate the underlying player. */
  async init(): Promise<void> {
    let YT: YTNamespace;
    try {
      YT = await loadIframeApi();
    } catch {
      this.callbacks.onError?.('Failed to load the YouTube player');
      return;
    }
    if (this.destroyed) return;

    this.player = new YT.Player(this.mountEl, {
      width: 200,
      height: 200,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        iv_load_policy: 3,
        origin: window.location.origin,
      },
      events: {
        onReady: this.handleReady,
        onStateChange: this.handleStateChange,
        onError: this.handleError,
      },
    });
  }

  private handleReady = () => {
    this.ready = true;
    if (this.pendingVolume !== null) {
      this.player?.setVolume(this.pendingVolume);
      this.pendingVolume = null;
    }
    if (this.pending) {
      const { videoId, autoplay } = this.pending;
      this.pending = null;
      this.load(videoId, { autoplay });
    }
  };

  private handleStateChange = (event: YTPlayerEvent) => {
    const state = event.data;
    switch (state) {
      case 1: // PLAYING
        this.callbacks.onLoadingChange?.(false);
        this.emitDuration();
        this.startPolling();
        break;
      case 2: // PAUSED
        this.stopPolling();
        break;
      case 0: // ENDED
        this.stopPolling();
        this.callbacks.onEnded?.();
        break;
      case 3: // BUFFERING
        this.callbacks.onLoadingChange?.(true);
        break;
      case 5: // CUED
        this.callbacks.onLoadingChange?.(false);
        this.emitDuration();
        break;
      default:
        break;
    }
  };

  private handleError = () => {
    this.stopPolling();
    this.callbacks.onError?.('YouTube could not play this track');
  };

  private emitDuration() {
    if (!this.player) return;
    const duration = this.player.getDuration();
    if (duration && duration !== this.lastDuration) {
      this.lastDuration = duration;
      this.callbacks.onDuration?.(duration);
    }
  }

  private startPolling() {
    if (this.pollTimer !== null) return;
    this.pollTimer = setInterval(() => {
      if (!this.player) return;
      this.callbacks.onTime?.(this.player.getCurrentTime());
      this.emitDuration();
    }, POLL_INTERVAL_MS);
  }

  private stopPolling() {
    if (this.pollTimer !== null) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  /** Cue or play a video. Safe to call before the player is ready. */
  load(videoId: string, { autoplay }: { autoplay: boolean }): void {
    this.currentVideoId = videoId;
    this.lastDuration = 0;
    if (!this.ready || !this.player) {
      this.pending = { videoId, autoplay };
      return;
    }
    if (autoplay) {
      this.player.loadVideoById(videoId);
    } else {
      this.player.cueVideoById(videoId);
    }
  }

  play(): void {
    if (!this.ready || !this.player) {
      if (this.pending) this.pending.autoplay = true;
      return;
    }
    this.player.playVideo();
  }

  pause(): void {
    if (!this.ready || !this.player) {
      if (this.pending) this.pending.autoplay = false;
      return;
    }
    this.player.pauseVideo();
  }

  /** Pause and rewind to the start (WMP "stop"). */
  stop(): void {
    this.stopPolling();
    if (this.ready && this.player) {
      this.player.pauseVideo();
      this.player.seekTo(0, true);
    }
  }

  seek(seconds: number): void {
    if (this.ready && this.player) {
      this.player.seekTo(seconds, true);
    }
  }

  /** @param volume 0-100 (YouTube's native range). */
  setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(100, Math.round(volume)));
    if (this.ready && this.player) {
      this.player.setVolume(clamped);
    } else {
      this.pendingVolume = clamped;
    }
  }

  getCurrentVideoId(): string | null {
    return this.currentVideoId;
  }

  destroy(): void {
    this.destroyed = true;
    this.stopPolling();
    try {
      this.player?.destroy();
    } catch {
      // Player may already be torn down; ignore.
    }
    this.player = null;
    this.container.remove();
  }
}
