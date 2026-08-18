/**
 * Achievement catalog — the single source of truth for every unlockable.
 *
 * Shared by both the client engine (AchievementContext) and the tRPC server
 * (id validation, gamerscore recomputation), so keep this module plain data
 * with no React or browser imports.
 *
 * Scores follow Xbox 360 increments. Never reward trivial interactions
 * (hovers, sounds) — an achievement marks genuine exploration.
 */

export interface AchievementDef {
  id: string;
  /** Xbox-360-flavored display name */
  title: string;
  /** How to earn it / flavor text, shown in toasts and the list UI */
  subtitle: string;
  score: 5 | 10 | 20 | 50;
  /** Badge icon for toast crossfade and list tiles; defaults handled by createAchievementToast */
  icon?: string;
  /** Masked in the list UI until unlocked */
  secret?: boolean;
}

export const ACHIEVEMENTS = [
  { id: 'first-boot', title: 'First Boot', subtitle: 'Powered on the dashboard', score: 5 },
  { id: 'blade-runner', title: 'Blade Runner', subtitle: 'Cycled through every dashboard blade', score: 10 },
  { id: 'channel-surfer', title: 'Channel Surfer', subtitle: 'Visited 5 different channels', score: 10 },
  { id: 'completionist', title: 'Completionist', subtitle: 'Explored every corner of the site', score: 50 },
  { id: 'plug-and-play', title: 'Plug and Play', subtitle: 'Connected a controller', score: 20 },
  { id: 'party-up', title: 'Party Up', subtitle: 'Signed in with GitHub', score: 20 },
  { id: 'leave-your-mark', title: 'Leave Your Mark', subtitle: 'Posted a message in the chatroom', score: 20 },
  { id: 'business-time', title: 'Business Time', subtitle: 'Saved the contact card', score: 10 },
  { id: 'full-dossier', title: 'Full Dossier', subtitle: 'Read every gamercard section', score: 10 },
  { id: 'now-playing', title: 'Now Playing', subtitle: 'Fired up the media player', score: 10 },
  { id: 'deep-cuts', title: 'Deep Cuts', subtitle: 'Opened the playlist drawer', score: 5 },
  { id: 'scanline-purist', title: 'Scanline Purist', subtitle: 'Toggled the CRT filter', score: 5 },
  { id: 'fresh-coat', title: 'Fresh Coat', subtitle: 'Changed the dashboard theme', score: 5 },
  { id: 'new-you', title: 'A Whole New You', subtitle: 'Changed your gamer picture', score: 10 },
  { id: 'dev-mode', title: 'Entering Dev Mode', subtitle: 'Found the gamepad debug overlay', score: 20, secret: true },
  { id: 'headhunter', title: 'Headhunted', subtitle: 'Took the recruiter shortcut', score: 10, secret: true },
] as const satisfies readonly AchievementDef[];

export type AchievementId = (typeof ACHIEVEMENTS)[number]['id'];

/** Catalog entry with its id narrowed to the union — the shape list UIs iterate */
export interface AchievementEntry extends AchievementDef {
  id: AchievementId;
}

/** The catalog widened to a uniform shape (optional fields present on the type) */
export const ACHIEVEMENT_LIST: readonly AchievementEntry[] = ACHIEVEMENTS;

export const ACHIEVEMENT_IDS = ACHIEVEMENTS.map((a) => a.id) as [AchievementId, ...AchievementId[]];

export const ACHIEVEMENT_MAP: Record<AchievementId, AchievementDef> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a])
) as Record<AchievementId, AchievementDef>;

export const TOTAL_GAMERSCORE = ACHIEVEMENTS.reduce((sum, a) => sum + a.score, 0);

export function isAchievementId(id: string): id is AchievementId {
  return id in ACHIEVEMENT_MAP;
}

/** Sum of catalog scores for a set of unlocked ids — the only way gamerscore is ever computed. */
export function computeGamerscore(ids: Iterable<string>): number {
  let sum = 0;
  for (const id of ids) {
    if (isAchievementId(id)) sum += ACHIEVEMENT_MAP[id].score;
  }
  return sum;
}

/**
 * Routes that count toward exploration achievements.
 * Dev/utility pages (/design-system, /toast-demo) and the credits rolls are excluded.
 */
export const TRACKED_ROUTES = [
  '/',
  '/about',
  '/blog',
  '/books',
  '/card',
  '/certifications',
  '/changelog',
  '/chatroom',
  '/digital-gems',
  '/leetcode',
  '/media',
  '/music',
  '/my-playlists',
  '/photos',
  '/profile',
  '/projects',
] as const;

/** Mirrors the blade keys of src/data/cardsList.ts (menu items on the dashboard). */
export const TRACKED_BLADES = ['home', 'gallery', 'misc', 'credits'] as const;

/** Mirrors the tab SectionIds of src/components/GamerCard/sections.ts. */
export const TRACKED_GAMERCARD_SECTIONS = [
  'profile',
  'experience',
  'work',
  'skills',
  'about',
  'contact',
] as const;

export type ProgressKey = 'routesVisited' | 'bladesCycled' | 'gamercardSections';

interface ProgressRule {
  /** Distinct values required in the progress set before the unlock fires */
  threshold: number;
  unlocks: AchievementId;
}

/** Declarative multi-step unlocks, checked by the engine after each recordProgress call. */
export const PROGRESS_RULES: Record<ProgressKey, readonly ProgressRule[]> = {
  routesVisited: [
    { threshold: 5, unlocks: 'channel-surfer' },
    { threshold: TRACKED_ROUTES.length, unlocks: 'completionist' },
  ],
  bladesCycled: [{ threshold: TRACKED_BLADES.length, unlocks: 'blade-runner' }],
  gamercardSections: [{ threshold: TRACKED_GAMERCARD_SECTIONS.length, unlocks: 'full-dossier' }],
};
