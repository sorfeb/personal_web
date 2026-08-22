/**
 * TypeScript type definitions for Windows Media Player skin parser
 */

export interface SkinDefinition {
  theme: SkinTheme;
  /**
   * The view the player renders. Always `views[0]`, kept as its own field
   * because every consumer wants the main view and nothing else.
   */
  view: SkinView;
  /**
   * Every `<view>` in the manifest, in document order. Skins use extra views
   * for detached playlist/equalizer/video windows (wood.wms has four), which
   * we parse but do not yet render.
   */
  views: SkinView[];
}

export interface SkinTheme {
  id: string;
  title?: string;
  author?: string;
  copyright?: string;
}

export interface SkinView {
  id?: string;
  width: number;
  height: number;
  backgroundColor?: string;
  titleBar?: boolean;
  resizable?: boolean;
  scriptFile?: string;
  elements: SkinElement[];
}

/**
 * What a slider is wired to. Derived from the WMS tag (`<volumeslider>`) or
 * from the element's `wmpprop:` binding when it is a plain `<slider>`.
 */
export type SliderRole = 'seek' | 'volume' | 'balance' | 'eq' | 'unknown';

export type SkinElementType =
  | 'button'
  | 'buttongroup'
  | 'buttonelement'
  | 'playelement'
  | 'pausebutton'
  | 'stopelement'
  | 'nextelement'
  | 'prevelement'
  | 'slider'
  | 'text'
  | 'subview'
  | 'effects'
  | 'video'
  | 'playlist';

export interface SkinElement {
  type: SkinElementType;
  id?: string;
  position: {
    left: number | string; // Can be "jscript:..." expression
    top: number | string;
    zIndex?: number;
  };
  dimensions?: {
    width?: number;
    height?: number;
  };
  images?: {
    background?: string;
    default?: string;
    hover?: string;
    down?: string;
    disabled?: string;
    mapping?: string;
    // Slider-specific
    foreground?: string;
    thumb?: string;
    thumbHover?: string;
    thumbDown?: string;
  };
  colors?: {
    backgroundColor?: string;
    foregroundColor?: string;
    transparencyColor?: string;
    clippingColor?: string;
  };
  onClick?: string; // WMP script expression
  toolTip?: string;
  visible?: boolean | string; // Can be "wmpenabled:..." expression
  enabled?: boolean | string; // Can be "wmpenabled:..." expression

  /**
   * Geometry with every `jscript:` expression resolved to a pixel value.
   * Filled in by `resolveLayout`; absent when the element's position could
   * not be resolved (a cyclic or unsupported expression).
   */
  resolved?: {
    left: number;
    top: number;
  };

  /** Set when the WMS tag implies a binding, e.g. `<volumeslider>`. */
  role?: SliderRole;

  // Button-specific
  mappingColor?: string; // For buttonelement in buttongroup
  /** Toggle button that stays down until re-clicked (MediaBay presets). */
  sticky?: boolean;

  // Slider-specific
  min?: number | string; // Can be number or "wmpprop:..." binding
  max?: number | string; // Can be number or "wmpprop:..." binding
  value?: string | number; // Can be "wmpprop:..." binding
  direction?: 'horizontal' | 'vertical';
  slide?: boolean;
  borderSize?: number;
  tiled?: boolean;
  useForegroundProgress?: boolean;
  foregroundProgress?: string; // WMP binding

  // Text-specific
  textValue?: string; // Can be "wmpprop:..." binding
  fontSize?: number;
  fontStyle?: string;
  fontType?: string;
  justification?: 'Left' | 'Center' | 'Right';
  cursor?: string;

  // Playlist-specific
  columnsVisible?: boolean;
  columns?: string;
  dropDownVisible?: boolean;
  playlistItemsVisible?: boolean;

  // Event handlers
  onDragEnd?: string;
  onEndMove?: string;
  onLoad?: string;
  onClose?: string;
  onVideoStart?: string;
  onVideoEnd?: string;
  value_onchange?: string;

  // Nested elements
  children?: SkinElement[];
}

export interface ImageInfo {
  url: string;
  width: number;
  height: number;
}

export interface SkinAssets {
  images: Map<string, ImageInfo>; // filename -> image info with dimensions
  mappings: Map<string, ImageData>; // mapping images -> pixel data for click detection
}

export interface ClickableRegion {
  id: string;
  elementId?: string;
  color: string; // hex color from mappingColor attribute
  bounds?: DOMRect | { x: number; y: number; width: number; height: number };
  onClick?: () => void;
  toolTip?: string;
}

// Playback state types

/**
 * Track is a discriminated union keyed on `source`. Each variant maps to a
 * playback engine in `src/components/WMPPlayer/engines/`. Add a new variant
 * + engine pair when you want WMP to drive another audio backend.
 */
export interface BaseTrack {
  id: string;
  name: string;
  artist?: string;
  album?: string;
  imageUrl?: string; // Album art
}

/** Plays via the HTMLAudioElement engine. Real seeking, real duration. */
export interface AudioTrack extends BaseTrack {
  source: 'audio';
  url: string;       // Direct media URL (MP3/OGG/etc.)
  duration: number;  // Seconds
}

/**
 * Plays via the Spotify Embed iframe engine. Spotify owns playback; WMP
 * transport controls are proxied via postMessage. Duration/seek may be
 * unavailable depending on the user's Spotify session.
 */
export interface SpotifyEmbedTrack extends BaseTrack {
  source: 'spotify-embed';
  spotifyTrackId: string; // For https://open.spotify.com/embed/track/{id}
  spotifyUrl: string;     // Canonical https://open.spotify.com/track/{id} link
}

/**
 * Plays via the YouTube IFrame Player API engine (`src/lib/wmp/youtubeEngine.ts`).
 * YouTube is the audio backend: the video surface is mounted hidden and WMP
 * transport drives playback programmatically (play/pause/seek/volume/ended),
 * unlike the Spotify embed which owns its own transport. Gives full-length
 * playback for every visitor with no login.
 */
export interface YouTubeTrack extends BaseTrack {
  source: 'youtube';
  youtubeVideoId: string; // 11-char YouTube video id
  spotifyUrl?: string;    // Optional deep-link back to the original Spotify track
}

export type Track = AudioTrack | SpotifyEmbedTrack | YouTubeTrack;

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  imageUrl?: string;
}

export interface WMPPlayerState {
  // Playback state
  isPlaying: boolean;
  isPaused: boolean;
  isStopped: boolean;

  // Current track
  currentTrack: Track | null;
  currentTime: number; // in seconds
  duration: number; // in seconds
  positionString: string; // formatted time (e.g., "1:23")
  durationString: string; // formatted duration (e.g., "3:45")
  trackName: string;
  artist: string;

  // Playlist
  playlist: Track[];
  playlistIndex: number;

  // Audio settings
  volume: number; // 0-100
  balance: number; // -100 (left) to 100 (right)
  muted: boolean;

  // Equalizer (10 bands)
  eq: {
    enabled: boolean;
    gains: number[]; // Array of 10 values, -14 to +14 dB
  };

  // UI state
  eqDrawerOpen: boolean;
  playlistDrawerOpen: boolean;
  visualizerOpen: boolean;

  // Loading state
  isLoading: boolean;
  error: string | null;
}

export type WMPPlayerAction =
  | { type: 'PLAY'; track?: Track }
  | { type: 'PAUSE' }
  | { type: 'STOP' }
  | { type: 'RESUME' }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'SEEK'; time: number }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'SET_BALANCE'; balance: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'SET_PLAYLIST'; playlist: Track[] }
  | { type: 'SET_PLAYLIST_INDEX'; index: number }
  | { type: 'UPDATE_TIME'; time: number }
  | { type: 'UPDATE_DURATION'; duration: number }
  | { type: 'TOGGLE_EQ_DRAWER' }
  | { type: 'TOGGLE_PLAYLIST_DRAWER' }
  | { type: 'TOGGLE_VISUALIZER' }
  | { type: 'SET_EQ_GAIN'; band: number; gain: number }
  | { type: 'RESET_EQ' }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'TRACK_ENDED' };

// WMP binding translation

export interface WMPBinding {
  type: 'property' | 'enabled';
  path: string; // e.g., "player.currentmedia.duration"
}

export type WMPBindingValue = string | number | boolean | null;

// Parsed skin cache

export interface ParsedSkin {
  definition: SkinDefinition;
  assets: SkinAssets;
  clickRegions: Map<string, ClickableRegion[]>; // buttongroup id -> regions
  scriptBindings: Map<string, string>; // element id -> script/binding
}
