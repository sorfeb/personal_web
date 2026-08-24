/**
 * The WMP object model, projected from our player state.
 *
 * Skins bind to a documented object graph:
 *
 *   <text value="wmpprop:player.currentMedia.durationString" />
 *   <slider max="wmpprop:player.currentMedia.duration" />
 *   <button enabled="wmpenabled:player.controls.play" />
 *
 * Surveying the five skins in `Windows Media Player Legacy Skins`, the union
 * of members they touch is 39. That is the whole adapter surface, and it does
 * not grow as skins are added: the API was frozen two decades ago.
 *
 * `WMPSubview` used to resolve these with a chain of `rawValue.includes(...)`
 * checks covering four paths. Anything else rendered as an empty string, which
 * is why unfamiliar skins looked half-empty rather than broken.
 */

import type { WMPPlayerState } from '@/types/wmp';

/** WMP's `openState` enumeration, as far as skins observe it. */
const OPEN_STATE_UNDEFINED = 0;
const OPEN_STATE_MEDIA_OPEN = 13;

/**
 * Build the object graph a skin's bindings read against.
 *
 * Keys use WMP's own casing. `readModelPath` matches case-insensitively, since
 * the skins disagree with each other and with the docs.
 */
export function buildPlayerModel(state: WMPPlayerState): Record<string, unknown> {
  const hasTrack = state.currentTrack !== null;

  return {
    player: {
      openState: hasTrack ? OPEN_STATE_MEDIA_OPEN : OPEN_STATE_UNDEFINED,
      playState: state.isPlaying ? 3 : state.isPaused ? 2 : 1,
      controls: {
        currentPosition: state.currentTime,
        currentPositionString: state.positionString,
        // Capability flags: what `wmpenabled:` bindings ask about.
        play: hasTrack && !state.isPlaying,
        pause: state.isPlaying,
        stop: state.isPlaying || state.isPaused,
        next: state.playlist.length > 1,
        previous: state.playlist.length > 1,
        fastForward: hasTrack,
        fastReverse: hasTrack,
      },
      settings: {
        volume: state.volume,
        balance: state.balance,
        mute: state.muted,
      },
      currentMedia: {
        name: state.trackName,
        author: state.artist,
        artist: state.artist,
        duration: state.duration,
        durationString: state.durationString,
        // Skins gate video UI on this being > 0. We are audio-only.
        imageSourceWidth: 0,
        imageSourceHeight: 0,
      },
      network: {
        // No buffering model: report fully downloaded so progress bars settle.
        downloadProgress: 100,
        bufferingProgress: 100,
      },
    },

    eq: {
      bypass: !state.eq.enabled,
      enhancedAudio: state.eq.enabled,
      currentPresetTitle: '',
      currentSpeakerName: '',
      crossFade: false,
      splineTension: 0,
      enableSplineTension: false,
      truBassLevel: 0,
      wowLevel: 0,
      ...Object.fromEntries(
        state.eq.gains.map((gain, index) => [`gainLevel${index + 1}`, gain])
      ),
    },

    mediacenter: {
      effectType: '',
      effectPreset: 0,
    },

    view: {
      width: 0,
      height: 0,
    },
  };
}
