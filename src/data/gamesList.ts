/**
 * DOS game catalog — the single source of truth for every playable title.
 *
 * Every entry is a legally redistributable shareware episode, bundled as a
 * `.jsdos` archive (unmodified original files + the shareware license text +
 * a dosbox config) under `public/assets/games/`. Never add retail data files.
 */

export interface DosGame {
  /** URL segment: /games/[slug] */
  slug: string;
  title: string;
  year: number;
  developer: string;
  /** Episode actually shipped — always the shareware episode, never retail */
  episode: string;
  /** `.jsdos` bundle served statically; fetched only when the game launches */
  bundleUrl: string;
  /** Dashboard-style line icon; doubles as the badge on the in-game volume pill */
  iconUrl: string;
  /** One-liner for the hub card */
  blurb: string;
  /** Shown in the player's help strip */
  controls: string;
}

export const DOS_GAMES: readonly DosGame[] = [
  {
    slug: 'doom',
    title: 'DOOM',
    year: 1993,
    developer: 'id Software',
    episode: 'Episode 1: Knee-Deep in the Dead (shareware)',
    bundleUrl: '/assets/games/doom.jsdos',
    iconUrl: '/assets/icons/dashboard/games/doom.svg',
    blurb: 'The one that changed everything. Rip and tear through the UAC base on Phobos.',
    controls: 'Arrows move · Ctrl fires · Space opens doors · Esc for menu',
  },
  {
    slug: 'wolf3d',
    title: 'Wolfenstein 3D',
    year: 1992,
    developer: 'id Software',
    episode: 'Episode 1: Escape from Wolfenstein (shareware)',
    bundleUrl: '/assets/games/wolf3d.jsdos',
    iconUrl: '/assets/icons/dashboard/games/wolf3d.svg',
    blurb: 'The grandfather of the FPS. Escape Castle Wolfenstein floor by floor.',
    controls: 'Arrows move · Ctrl fires · Space opens doors · Esc for menu',
  },
  {
    slug: 'keen',
    title: 'Commander Keen',
    year: 1990,
    developer: 'id Software / Apogee',
    episode: 'Episode 1: Marooned on Mars (shareware)',
    bundleUrl: '/assets/games/keen.jsdos',
    iconUrl: '/assets/icons/dashboard/games/keen.svg',
    blurb: 'Eight-year-old genius Billy Blaze defends Earth in his homemade rocket.',
    controls: 'Arrows move · Ctrl jumps · Alt pogo · Esc for menu',
  },
];

export function getGameBySlug(slug: string): DosGame | undefined {
  return DOS_GAMES.find((game) => game.slug === slug);
}
