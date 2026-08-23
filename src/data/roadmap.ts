import type { RoadmapEntry } from '@/types/roadmap';

/**
 * Public roadmap — a curated subset of the Linear backlog (team s11o, project
 * personal_web).
 *
 * Linear is the source of truth. This file exists so the site does not depend
 * on a build-time call to a private workspace, which would put an API token in
 * the deploy env and private issue titles on a public page.
 *
 * The cost of that choice is drift, so keep it cheap to review:
 *
 * - Cap the list around ten entries. This is a roadmap, not a backlog mirror.
 * - Write themes, not tickets. An entry should survive a re-plan.
 * - Never paste an issue description; link the key via `issue` instead.
 * - Prune 'shipped' entries once they fall off the top of CHANGELOG.md.
 *
 * A stale roadmap is worse than no roadmap. If this list has not been touched
 * in two releases, delete the entries you no longer mean.
 */
export const ROADMAP: readonly RoadmapEntry[] = [
  {
    id: 'gamepad',
    title: 'Run the whole dashboard on a controller',
    blurb:
      'One input router feeding a scope stack, so keyboard and gamepad emit the same intents. Blades, cards, modals and the media player all answer to a d-pad.',
    status: 'in-progress',
    issue: 'SOR-131',
  },
  {
    id: 'spatial-nav',
    title: 'Site-wide spatial navigation',
    blurb:
      'Every page and modal registers a scope, so focus moves by geometry instead of by DOM order and nothing traps the controller.',
    status: 'in-progress',
    issue: 'SOR-134',
  },
  {
    id: 'vibe-map',
    title: 'Music vibe map',
    blurb:
      'Last.fm tag vectors plotted as a two-dimensional map of the playlist, so the library is browsable by mood rather than by title.',
    status: 'in-progress',
    issue: 'SOR-28',
  },
  {
    id: 'chat-realtime',
    title: 'Make the chat room actually realtime',
    blurb:
      'The chat feature exists but is orphaned and polls. Reclaim it, harden the schema, and put it on a realtime transport with presence and typing indicators.',
    status: 'next',
    issue: 'SOR-156',
  },
  {
    id: 'gamercard',
    title: 'Rebuild /card as a Gamercard',
    blurb:
      'A mobile-first mini-CV shaped like an Xbox 360 gamercard, with a vCard download for anyone who wants the details in their contacts.',
    status: 'next',
    issue: 'SOR-59',
  },
  {
    id: 'playlist-resolve',
    title: 'Every Spotify playlist playable',
    blurb:
      'Auto-resolve Spotify tracks to YouTube so the media player covers the whole library instead of a hand-curated three albums.',
    status: 'next',
    issue: 'SOR-152',
  },
  {
    id: 'wmp-a11y',
    title: 'Keyboard-reachable media player skin',
    blurb:
      'The player is a skin interpreter, so its controls are hit regions on a bitmap rather than elements. Expose them as real buttons and sliders.',
    status: 'someday',
    issue: 'SOR-136',
  },
  {
    id: 'imagegen',
    title: 'An image studio blade',
    blurb:
      'Still a decision rather than a plan: which provider, which framework, and whether the running cost is worth it.',
    status: 'someday',
    issue: 'SOR-154',
  },
  {
    id: 'dos-games',
    title: 'DOS games on a virtual CRT',
    blurb:
      'DOOM, Wolfenstein 3D and Commander Keen running in the dashboard through a self-hosted js-dos, framed by a CRT television.',
    status: 'shipped',
    shippedIn: 'v1.3.0',
  },
  {
    id: 'achievements',
    title: 'Achievements and Gamerscore',
    blurb:
      'Exploring the site unlocks achievements. Progress is kept for guests and merged into the account on sign-in.',
    status: 'shipped',
    issue: 'SOR-139',
  },
  {
    id: 'now-playing',
    title: 'Now Playing screen',
    blurb: 'The Xbox 360 Now Playing layout, rebuilt for the playlists route.',
    status: 'shipped',
    shippedIn: 'v1.4.0',
  },
];

/** Badge count for the Roadmap tab: everything not yet shipped. */
export const OPEN_ROADMAP_COUNT = ROADMAP.filter((entry) => entry.status !== 'shipped').length;
