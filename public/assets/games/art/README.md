# Game cover art

Art for the dashboard **Games** blade (`XboxCard` `variant="game"`). Filenames are
referenced from `src/data/cardsList.ts`:

| File | Card |
|---|---|
| `doom.webp` | DOOM |
| `wolf3d.webp` | Wolfenstein 3D |
| `keen.webp` | Commander Keen |
| `all-games.webp` | All Games |

## Specs

- **Format** `.webp`. Next's optimizer re-encodes to AVIF/WebP per client, so the
  source only needs to be lossless enough to survive that.
- **Aspect** the card is `1.25 / 1` on desktop and `1 / 1` at ≤768px, and art is
  `object-fit: cover; object-position: center`. Landscape key art crops well;
  portrait box art loses its top and bottom edges. Prefer wide art where a choice
  exists.
- **Size** ~800×640 covers the largest rendered card on a 4K display. Anything
  larger is wasted bytes.
- **Composition** the bottom third sits under an opaque scrim
  (`--gradient-art-scrim`) carrying the title. Keep logos and faces in the upper
  two thirds.

## Caching

`next.config.mjs` stamps `Cache-Control: public, max-age=31536000, immutable` on
`/assets/:path*`. Replacing a file in place will not invalidate a client that has
already fetched it — rename it and update `cardsList.ts` when art changes.

## Missing files

A card whose art is absent or fails to decode falls back to a flat brand panel
(`--gradient-art-placeholder`) with the title still bottom-aligned. It never falls
back to an icon: a blade half-icons and half-art reads as broken rather than
incomplete.
