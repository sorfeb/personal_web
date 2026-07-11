import type { YouTubeTrack } from '@/types/wmp';

/**
 * Curated "featured album" the WMP player streams full-length through the
 * YouTube engine (`src/lib/wmp/youtubeEngine.ts`). This mirrors how ryOS builds
 * its iPod library: each entry is a hand-picked YouTube video id, so playback
 * works for every visitor with no login, no subscription, and no API quota.
 *
 * Each entry must satisfy the YouTubeTrack contract from `src/types/wmp.ts`:
 *   - `source: 'youtube'`
 *   - `youtubeVideoId`: the 11-char id from a watch URL
 *       (https://www.youtube.com/watch?v=<ID>  ->  <ID>)
 *   - `imageUrl` (optional): any cover art. YouTube thumbnails
 *       (https://i.ytimg.com/vi/<ID>/hqdefault.jpg) always work.
 *   - `spotifyUrl` (optional): deep-link back to the track on Spotify
 *
 * NOTE: the entries below are PLACEHOLDERS so the player is testable out of the
 * box. Replace them with your Spotify album's tracks. If a track shows "Video
 * unavailable", that upload has embedding disabled — pick a different upload of
 * the same song.
 */
const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export const youtubePlaylist: YouTubeTrack[] = [
  {
    source: 'youtube',
    id: 'yt-dQw4w9WgXcQ',
    name: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    youtubeVideoId: 'dQw4w9WgXcQ',
    imageUrl: ytThumb('dQw4w9WgXcQ'),
  },
  {
    source: 'youtube',
    id: 'yt-9bZkp7q19f0',
    name: 'Gangnam Style',
    artist: 'PSY',
    youtubeVideoId: '9bZkp7q19f0',
    imageUrl: ytThumb('9bZkp7q19f0'),
  },
  {
    source: 'youtube',
    id: 'yt-kJQP7kiw5Fk',
    name: 'Despacito',
    artist: 'Luis Fonsi ft. Daddy Yankee',
    youtubeVideoId: 'kJQP7kiw5Fk',
    imageUrl: ytThumb('kJQP7kiw5Fk'),
  },
];
