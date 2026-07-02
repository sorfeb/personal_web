import type { AudioTrack } from '@/types/wmp';

/**
 * The default audio catalog the WMP player loads when no explicit playlist is
 * selected. Add entries here (or replace the whole array) to ship a curated
 * playlist of self-hosted tracks.
 *
 * Each entry must satisfy the AudioTrack contract from `src/types/wmp.ts`:
 *   - `source: 'audio'`
 *   - `url` resolvable by an HTMLAudioElement (relative `/assets/...` paths
 *     under `public/` work; full https URLs work too)
 *   - `duration` in seconds (used by the WMP slider/time text bindings)
 */
export const audioCatalog: AudioTrack[] = [
  {
    source: 'audio',
    id: 'xbox360-initial-setup',
    name: 'Xbox 360 Initial Setup Theme',
    artist: 'Microsoft',
    album: 'Xbox 360 Dashboard',
    duration: 191,
    url: '/assets/audio/Xbox 360 Initial Setup.mp3',
  },
];
