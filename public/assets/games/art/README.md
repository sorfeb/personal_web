# Game cover art

Art for the dashboard **Games** blade (`XboxCard` `variant="game"`). Filenames are
referenced from `src/data/cardsList.ts`:

| File | Card | Origin |
|---|---|---|
| `doom.jpg` | DOOM | Front cover, 1993 retail box |
| `wolf3d.jpg` | Wolfenstein 3D | Front cover, 1992 retail box |
| `keen.jpg` | Commander Keen | Front cover, Commander Keen 1,2,3 retail box |
| `all-games.svg` | All Games | Original work; not a game, so there is nothing to source |

The three game images are third-party artwork included under a claim of fair
use. They are **not** covered by this repo's AGPL-3.0 grant. See `/NOTICE` at the
repository root for per-file attribution and the reasoning. Keep that file in
sync when art changes.

## How a game card presents art

Box art is portrait, the card is landscape (`1.25 / 1` desktop, `1 / 1` at
≤768px). Cropping to fill would cut off the top and bottom of a cover, which is
where the logo and title sit. So the card draws the art twice:

- `.art` is `object-fit: contain`, showing the whole image
- `.artBackdrop` is the same file at `object-fit: cover`, scaled 1.2x and blurred,
  filling the gutters

Same `src` for both, so it is one request and one decode. Art already at the
card's aspect ratio fills the frame outright and never reveals the backdrop.

## Replacing a piece

Drop a file in at the name above and the card picks it up. No code change, and
any aspect ratio works because of the backdrop.

- **Format** anything `next/image` handles. Note that `.svg` bypasses the
  optimizer entirely: `next/image` detects the extension and serves the file
  directly, because `/_next/image` returns 400 for SVG while
  `dangerouslyAllowSVG` is off in `next.config.mjs`. Raster art goes through the
  optimizer normally and gets AVIF/WebP per client.
- **Resolution** the card renders at roughly 400x320 CSS px on desktop. Contained
  portrait art is height-limited, so ~640px tall covers a 2x display and ~900px
  covers 2.8x. The files here are capped at 900px on the long edge: past that is
  bytes nobody sees, and a downscaled copy is one of the things that keeps the
  fair-use claim reasonable.
- **Composition** the bottom third sits under an opaque scrim
  (`--gradient-art-scrim`) carrying the title. Keep the subject above roughly 62%
  of the height.

## Caching

`next.config.mjs` stamps `Cache-Control: public, max-age=31536000, immutable` on
`/assets/:path*`. Replacing a file in place will not invalidate a client that has
already fetched it. Rename it and update `cardsList.ts` when art changes.

## Missing files

A card whose art is absent or fails to decode falls back to a flat brand panel
(`--gradient-art-placeholder`) with the title still bottom-aligned. It never
falls back to an icon: a blade half icons and half art reads as broken rather
than incomplete.
