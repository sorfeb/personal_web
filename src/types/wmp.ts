/**
 * TypeScript type definitions for Windows Media Player skin parser
 */

export interface SkinDefinition {
  theme: SkinTheme;
  view: SkinView;
}

export interface SkinTheme {
  id: string;
  author?: string;
  copyright?: string;
}

export interface SkinView {
  width: number;
  height: number;
  backgroundColor?: string;
  titleBar?: boolean;
  resizable?: boolean;
  scriptFile?: string;
  elements: SkinElement[];
}

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
  enabled?: boolean;

  // Button-specific
  mappingColor?: string; // For buttonelement in buttongroup

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

export interface Track {
  id: string;
  name: string;
  artist?: string;
  album?: string;
  duration: number; // in seconds
  url: string; // Audio file URL or Spotify preview URL
  imageUrl?: string; // Album art
  isPreview?: boolean; // True if Spotify 30s preview
}

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
