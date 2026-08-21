# Feature: DOS Games (Games blade + in-browser emulation) - Completed ✅
**Completion Date**: 2026-08-19
**Implementation Date**: 2026-08-19
**Agent**: Frontend
**Related issue**: SOR-138 (Linear — design record, research citations and grill-session decisions live there)

## Summary
Visitors can play classic DOS shareware — DOOM, Wolfenstein 3D and Commander Keen 1 —
directly in the browser, presented as a mid-2000s CRT television inside the Xbox 360
dashboard premise. A new **Games** blade leads to a `/games` hub of TV "channels"; picking
one navigates to `/games/[slug]`, which powers on a stylized TV frame with the js-dos
(DOSBox → WASM) emulator playing inside it. Keyboard, mouse **and gamepad** all work.

## What Was Built

### Components Created
- **`TVFrame`** (`src/components/TVFrame/`)
  - CSS/SVG-free pure-CSS CRT bezel with 4:3 screen slot; scanline/vignette/glare overlays
    are `pointer-events: none` so the interactive child (emulator iframe) stays clickable.
  - CRT power-on/off keyframes (`data-powered`); collapses to a plain cut under
    `prefers-reduced-motion: reduce`. All colors/timings via design tokens (`--tv-*` group
    added to `design-tokens.css`).
- **`GameChannelCard`** (`src/components/GameChannelCard/`)
  - A game on the hub, framed as a TV tuned to its channel. Plain `next/link` underneath —
    Tab-reachable and crawlable. Audio: `ting` hover, `channelUp` click.
- **`GamePlayer`** (`src/components/GamePlayer/`)
  - Fullscreen stage for `/games/[slug]`. Registers the `game-player` scope (explicit no-op
    `confirm` so the provider default can't click the focused element), hides the WMP window
    on entry, power-off exit (`back` sound, `--duration-fast`, then route change).
    Mobile (≤768px) gets a desktop-only notice instead of the emulator.
  - **Route-local volume pill** in the help strip: `VolumeControl` in controlled mode with
    the game's icon badged on the left edge. Seeded from the site volume on entry, then
    independent — adjusting the game never writes the global `VolumeContext`.

### Hooks Created
- **`useDosBridge`** (`src/hooks/useDosBridge.ts`)
  - Owns all traffic with the emulator iframe: volume sync from `VolumeContext`,
    lifecycle events (`dos:ci-ready`, `dos:exit`), and gamepad→DOS key synthesis.
  - Taps `subscribeToFrames` (raw pad state) rather than the intent layer, because games
    need key-down/key-up *edges*, not auto-repeating menu intents. State lives in refs;
    postMessage fires on edges only. Hold **B** 800 ms to power off (a tap does nothing).

### Infrastructure
- **`public/embed/dos.html`** — static, COOP/COEP-free embed page hosting the self-hosted
  js-dos player (kiosk mode, worker thread). Validates the `bundle` param against
  `/assets/games/*.jsdos` only; same-origin postMessage protocol; owns the named-key →
  js-dos `KBD_*` code table (GLFW-style codes, extracted from the shipped runtime).
- **`scripts/copy-emulators.mjs`** (+ `postinstall`) — copies the js-dos runtime
  (~2.7 MB: dosbox backend only, no dosbox-x/maps/symbols) into gitignored
  `public/emulators/`, with its GPL-2.0 notice.
- **Game bundles** (`public/assets/games/*.jsdos`, committed, ~3.4 MB total)
  - `doom.jsdos` — DOOM v1.9 shareware. `DOOM1.WAD` md5-verified
    `f0cefca49926d00903cf57551d901abe`; id shareware license included (`DOOMLIC.TXT`).
  - `wolf3d.jsdos` — Wolfenstein 3D v1.4 shareware (`.WL1` data; original `VENDOR.DOC`).
  - `keen.jsdos` — Commander Keen 1 v1.31 (original Apogee `LICENSE.DOC`).
  - Each bundle = unmodified original files + license text + a `.jsdos/dosbox.conf`.

## Files Changed

### Modified
- `src/components/VolumeControl/` — optional controlled mode (`value`/`onChange`), left-edge
  `icon` badge, `aria-label` on the slider; uncontrolled usage unchanged
- `src/data/cardsList.ts` — new `games` blade key (blade menu derives from these keys)
- `src/constants/achievements.ts` — `games` added to `TRACKED_BLADES` (blade-runner
  threshold self-derives); `/games` added to `TRACKED_ROUTES`
- `src/app/design-tokens.css` — `--tv-*` token group + `--gradient-tv-bezel`
- `package.json` — `js-dos@8.4.1` dependency (approved), `postinstall` copy step
- `.gitignore` — `public/emulators/` (generated)
- `.eslintrc.json` — `"root": true` (prevents config-walk conflicts from git worktrees)

### Created
```
src/app/games/{page.tsx, layout.tsx, Games.module.css}
src/app/games/[slug]/page.tsx          (generateStaticParams + notFound)
src/components/TVFrame/                 (+ stories)
src/components/GameChannelCard/         (+ stories)
src/components/GamePlayer/
src/hooks/useDosBridge.ts
src/data/gamesList.ts                   (game registry — single source of truth)
public/embed/dos.html
public/assets/games/{doom,wolf3d,keen}.jsdos
public/assets/icons/dashboard/games/{doom,wolf3d,keen,tv}.svg
scripts/copy-emulators.mjs
```

## Verification Completed
- [x] `npm run compile` — clean
- [x] `npm run lint` — exit 0 (remaining warnings pre-date this feature)
- [x] `npm run lint:css` — 0 errors, zero new warnings from this feature's CSS
- [x] `npm run lint:useeffect` — 0 unapproved calls (`useDosBridge` is a `src/hooks/` hook;
      `GamePlayer` uses `useMountEffect`)
- [x] Storybook stories for `TVFrame` (on/off/card-size) and `GameChannelCard`
- [x] No emulator bytes load outside `/games/[slug]` (iframe is the lazy boundary)

### Not verified here (needs a running browser)
- Actual gameplay input feel (gamepad synthesis, pointer lock) — QA on the dev server.

## Known Limitations
- **No save states** (decided out of v1) — closing the channel loses progress; these are
  short shareware episodes.
- **Desktop-only** by design, matching the site's gamepad gate and js-dos v8 mobile maturity.
- **Gamepad mapping is fixed** (stick/D-pad → arrows, A → Ctrl, X → Space, Y → Alt,
  Start → Enter, Select → Esc, hold-B → quit); no remapping UI.
- Duke Nukem 3D was deliberately dropped (license paper trail murkier — see Linear).
- `emulators` runtime in `public/emulators/` is generated on `npm install`; a fresh clone
  must run install before the player works locally.

## Dependencies Added
- `js-dos@8.4.1` (GPL-2.0) — approved in design review. Kept at arm's length: loaded only
  inside the embed page from self-hosted files, never bundled into site code; license text
  ships alongside the runtime and in each visible credit (hub footer).

## Maintainer Notes
- Add a game: drop a licensed `.jsdos` in `public/assets/games/`, add one entry to
  `src/data/gamesList.ts`, optionally a card in `cardsList.ts`. Nothing else.
- The embed page whitelists bundle paths — keep it that way; it must not proxy arbitrary URLs.
- **Never bundle retail data files** (`DOOM.WAD`, `.WL6`). Both showed up in "shareware"
  sources during sourcing and were caught by size/extension/checksum audits — always verify
  (`DOOM1.WAD`/`.WL1`/`.CK1`, md5 for Doom).

---

**Feature Status**: ✅ Complete — pending QA on dev
**Last Updated**: 2026-08-19
