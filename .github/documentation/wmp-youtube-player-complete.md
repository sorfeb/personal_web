# Feature: WMP Music Player — Full-Length YouTube Playback - Completed ✅
**Completion Date**: 2026-08-21
**Implementation Date**: 2026-07-12 (engine, PR #13) / 2026-08-21 (real tracklist)
**Agent**: Backend + curation
**Related issue**: SOR-70 (Linear — decision record for the licensing analysis and the
"pick 3 of 4" alternatives table lives there)

## Summary
The Windows Media Player skin on `/music` plays Soros' curated playlists **full-length,
for every visitor, with no login, at $0 cost**. The skin is the only UI; audio is
delivered by a hidden YouTube IFrame player driven from our own transport
(the ryOS iPod approach). Data path is a static list of hand-verified YouTube video
ids — no YouTube API key, no quota, no database.

## What Was Built

### Engine (PR #13, merged into dev 2026-07-12)
- **`src/lib/wmp/youtubeEngine.ts`** — framework-agnostic YouTube IFrame Player API
  wrapper (load/play/pause/seek/volume + time/duration/ended callbacks). Self-mounts a
  hidden offscreen container; the video surface is never visible.
- **`src/hooks/useWMPPlayer.ts`** — drives the YouTube engine alongside the existing
  `<audio>` engine; each backend acts only for its own `source`. Volume flows through
  `VolumeContext`.
- **`src/types/wmp.ts`** — `YouTubeTrack` (`source: 'youtube'`) in the `Track` union.
- **`audio.getYouTubePlaylist`** (tRPC) — serves the curated album; `/music` prefers it
  and falls back to the audio catalog.

### Curated tracklist (this change)
- **`src/server/data/youtubePlaylist.ts`** — 29 tracks from three Spotify playlists:
  *Luv Connection* (8), *Being Boring* (11), *Can't Hardly Wait* (10). `album` carries
  the source playlist name; `imageUrl` is the Spotify album art; `spotifyUrl` deep-links
  back to the original recording.

### How the ids were resolved (repeatable method)
1. Tracklists + canonical durations pulled from the Spotify Web API.
2. Each track searched on YouTube (Innertube endpoint); candidates ranked by:
   auto-generated **"· Topic" channel** (official distributor audio) first, then any
   candidate whose **duration matches Spotify within ±5s** and whose title/channel
   mentions the artist or track (duration alone once matched a wrong artist).
3. Every chosen id verified **embeddable** via YouTube's oEmbed endpoint (200 = OK;
   embedding-disabled uploads answer 401).
4. Because the player is hidden, the *video* content of an upload is irrelevant — only
   the audio recording must be correct, so lyric-video uploads are acceptable matches.

## Testing Results
- `npm run compile`, `npm run lint`, `npm run lint:css`, `npm run lint:useeffect` all
  pass (lint's one warning in `useWMPPlayer.ts` pre-exists this change).
- All 29 ids duration-matched against Spotify and oEmbed-verified embeddable
  (2026-08-21).

## Mobile Behavior
- **Tap-to-start is required.** Mobile browsers block autoplaying media with sound;
  the first playback must come from a user gesture on the transport.
- **No background / locked-screen audio on iOS.** A hidden IFrame is a page-embedded
  video: leaving Safari or locking the screen pauses it. There are no lock-screen media
  controls (no MediaSession integration is possible across the IFrame boundary).
- The desktop-first WMP window remains usable at the `≤768px` breakpoint, but the
  gamepad layer stays desktop-only per the site-wide gate.

## Known Limitations
- **YouTube ToS gray area (accepted, SOR-70):** the embedded player is hidden, which
  bends the "player must be visible ≥200×200" embed policy. Accepted for a personal
  site; the visible-docked-player fallback (cyberspace.online's Jukebox model) is the
  escape hatch if this is ever rejected.
- **Ads are possible.** A monetized upload can play a pre-roll; the skin shows playback
  time but no ad UI. Topic-channel uploads rarely carry pre-rolls.
- **Mappings rot.** Uploads can be deleted, region-locked, or de-embedded at any time
  and nothing alerts us. Re-run the oEmbed check over the list when a track reports
  "Video unavailable" (resolution scripts are session artifacts; the method above is
  the durable record).
- **One track omitted:** Cosmic — "The world keeps spinning" (730-follower indie
  single, 2025) has no YouTube distribution at all, so it cannot be played by this
  engine. If it ever lands on YouTube, add its id to restore *Luv Connection* to 9
  tracks.
- **Region locks are unverified.** oEmbed proves embeddable, not globally available;
  a geo-blocked upload still needs a manual swap if reported.

## Follow-up (tracked separately)
- "All playlists" mode: batch resolver (duration matching + oEmbed check), Prisma
  `YoutubeTrackMapping` cache, playlist picker wired from `/music` into the WMP skin,
  periodic re-verification script.
