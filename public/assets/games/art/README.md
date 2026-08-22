# Game cover art

Art for the dashboard **Games** blade (`XboxCard` `variant="game"`). Filenames are
referenced from `src/data/cardsList.ts`:

| File | Card |
|---|---|
| `doom.svg` | DOOM |
| `wolf3d.svg` | Wolfenstein 3D |
| `keen.svg` | Commander Keen |
| `all-games.svg` | All Games |

These are original pieces drawn in the site's palette, not the games' real box
art. id Software's artwork is not ours to redistribute under this repo's
AGPL-3.0 licence.

## Replacing a piece

Drop a file in at the name above and the card picks it up. No code change.

- **Format** SVG or raster both work. `next/image` detects `.svg` and serves it
  directly rather than routing it through `/_next/image`, which returns 400 for
  SVG while `dangerouslyAllowSVG` is off in `next.config.mjs`. Raster art goes
  through the optimizer normally and gets AVIF/WebP per client.
- **Aspect** the card is `1.25 / 1` on desktop and `1 / 1` at ≤768px, and art is
  `object-fit: cover; object-position: center`. Landscape art crops well;
  portrait box art loses its top and bottom edges.
- **Size** for raster, ~800×640 covers the largest rendered card on a 4K display.
  Anything larger is wasted bytes.
- **Composition** the bottom third sits under an opaque scrim
  (`--gradient-art-scrim`) carrying the title. Keep the subject above roughly
  62% of the height. The four SVGs here hold their focal point above `y=500` of
  an 800-unit viewBox.

## Caching

`next.config.mjs` stamps `Cache-Control: public, max-age=31536000, immutable` on
`/assets/:path*`. Replacing a file in place will not invalidate a client that has
already fetched it. Rename it and update `cardsList.ts` when art changes.

## Missing files

A card whose art is absent or fails to decode falls back to a flat brand panel
(`--gradient-art-placeholder`) with the title still bottom-aligned. It never
falls back to an icon: a blade half icons and half art reads as broken rather
than incomplete.
