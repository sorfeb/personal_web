# WMPPlayer

A Windows Media Player–skin React component. The skin XML and the playback engine are decoupled, so the same UI can drive multiple audio backends.

## Quick start

```tsx
import { WMPPlayer } from '@/components/WMPPlayer/WMPPlayer';

<WMPPlayer
  skinPath="/assets/skins/headspace"
  playlist={tracks}
  autoPlay={false}
  onClose={() => {}}
  onMinimize={() => {}}
/>
```

For the floating, globally-mounted variant used in this app, see `GlobalWMPPlayer.tsx` (renders into a portal, persists across routes).

## The `Track` contract

`src/types/wmp.ts` defines `Track` as a discriminated union. Every playlist item declares which engine should play it.

```ts
type Track = AudioTrack | SpotifyEmbedTrack;

type AudioTrack = {
  source: 'audio';
  id: string;
  name: string;
  url: string;       // HTMLAudioElement-compatible URL
  duration: number;  // seconds
  artist?: string;
  album?: string;
  imageUrl?: string;
};

type SpotifyEmbedTrack = {
  source: 'spotify-embed';
  id: string;
  name: string;
  spotifyTrackId: string;
  spotifyUrl: string;
  artist?: string;
  album?: string;
  imageUrl?: string;
};
```

## Engines

| `source` value   | Engine file                          | Plays via                                       |
|------------------|--------------------------------------|-------------------------------------------------|
| `'audio'`        | `useWMPPlayer` (internal `<Audio>`)  | HTMLAudioElement — real seek/duration/volume.   |
| `'spotify-embed'`| `engines/SpotifyEmbed.tsx`           | Spotify embed iframe. WMP controls are passive. |

## Wiring your own playlist

The simplest path:

1. Add tracks to `src/server/data/audioCatalog.ts`.
2. Call `openWithPlaylist(tracks)` from `useWMPPlayerContext()`.

Or load on demand:

```tsx
const { openWithPlaylist } = useWMPPlayerContext();
const myTracks: AudioTrack[] = await fetchSomehow();
openWithPlaylist(myTracks);
```

## Adding a new engine

1. Add a variant to `Track` in `src/types/wmp.ts` with a unique `source` literal.
2. Create `engines/MyEngine.tsx` (or `.ts`) that accepts the new variant.
3. In `WMPPlayer.tsx`, branch on `player.state.currentTrack?.source` and render your engine.
4. In `useWMPPlayer.ts`, gate the `<audio>` element so it doesn't fight your engine when the active track is a different source.

## Why no `preview_url`

Spotify removed `preview_url` from Client Credentials responses in late 2024. The Web API has never exposed raw audio streams for licensed catalog. Full playback paths today are:

- **Web Playback SDK** — Premium-gated, requires user OAuth.
- **Embed iframe** — what this player uses for Spotify tracks. Free users get a 30-second preview through the embed; Premium users get full playback.

For unrestricted playback through the WMP skin itself, ship MP3s through the `audio` engine.
