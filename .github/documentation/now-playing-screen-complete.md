# Now Playing screen (/my-playlists) — complete

Tracked as [SOR-153](https://linear.app/s11o/issue/SOR-153/my-playlists-page-replicate-the-xbox-360-now-playing-screen-layout).

## What shipped

`/my-playlists` was rebuilt from a Spotify cover grid into a replica of the Xbox 360
dashboard "Now Playing" music screen:

- **Left player card** (the app's one light surface): WMP transport row
  (play/pause, prev, stop, next, mute), a playlist strip, current track title,
  progress bar with elapsed time, and a visualization area. Playback state comes
  from a page-local `useWMPPlayer`.
- **Right panel**: blade-grey row list with an "N of M" footer and scroll
  chevrons. Before a playlist is loaded it lists the Spotify playlists; after,
  the playlist's tracks, with the current track highlighted (`aria-current`)
  and an animated EQ glyph.
- **Bottom legend** in `PageLayout.Footer`: A Select (hint), B Back
  (`ui/Button` badge, returns to the playlist chooser or closes the page),
  Y Open in Spotify.
- **Gamepad**: a `now-playing` scope stacks above PageLayout's `page` scope
  while a playlist is open. It re-declares directional focus movement
  (spatial navigation over the whole screen), maps `back` to "return to
  playlist chooser", LB/RB (`pageLeft`/`pageRight`) to prev/next track, and Y
  (`alt`) to Open in Spotify.
- **Tokens**: new `--np-*` neutrals plus `--gradient-np-*` in
  `design-tokens.css`; no literals in the module CSS.

## Design decisions

- **Playback ownership**: the page mounts its own `useWMPPlayer` (each mount
  owns an `HTMLAudioElement` + YouTube engine, so two active players would
  double-play). Loading a playlist here calls `hidePlayer()` on the global WMP
  window first. Playback state is not shared with the floating player; sharing
  would require lifting the hook into a provider (future work if needed).
- **Spotify tracks are `source: 'spotify-embed'`**: the embed iframe (rendered
  in the visualization area, same `SpotifyEmbed` engine as `WMPPlayer`) owns
  actual audio. Prev/next genuinely switch tracks; play/pause/stop/seek only
  drive the WMP reducer, matching the documented `WMPPlayer` limitation.
  SOR-152 (YouTube auto-resolution for Spotify playlists) will make the
  transport fully real.
- **Progress bar** is presentational (`role="progressbar"` only when a real
  duration exists; `aria-hidden` otherwise). No seek interaction, since embeds
  cannot seek — building fake slider semantics would repeat the SOR-137 mistake
  in reverse.
- **Transport buttons are bespoke**, not `ui/Button`: every `ui/Button` variant
  is drawn for dark surfaces, and the card is light. They carry the same audio
  feedback and `:focus-visible` contract (precedent: `WMPPlaylistDrawer` rows).
- **"N of M" footer** reflects the focused/hovered row, updated on focus and
  hover edges only; DOM focus stays the single source of selection truth.

## Verification

- `npm run compile` — clean
- `npm run lint` — no findings in changed files (pre-existing warnings unchanged)
- `npm run lint:css` — changed files contribute zero warnings
- `npm run lint:useeffect` — OK; the page's previous `effect:audited` block was
  removed entirely (track loading is now an imperative `utils…fetch()` in the
  click handler), so the repo count drops to 9 tagged effects

## Known limitations

- Play/pause/stop/seek do not control the Spotify embed iframe (see above).
- The embed iframe requires one in-iframe click to start audio; autoplay is a
  Spotify embed restriction.
- Times read 0:00 for embed tracks (no duration from the embed); the iframe
  shows its own progress.
- Playlist covers and per-playlist Spotify links from the old grid were
  dropped; Y (Open in Spotify) covers the current track instead.
