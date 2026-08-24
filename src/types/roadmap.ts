/**
 * Roadmap types.
 *
 * The roadmap is a curated, public-facing subset of the Linear backlog. Linear
 * stays the source of truth for state and reasoning; this shape carries only
 * what a visitor should see. See src/data/roadmap.ts for the maintenance rules.
 */

export type RoadmapStatus = 'in-progress' | 'next' | 'someday' | 'shipped';

export interface RoadmapEntry {
  /** Stable slug, used as the React key. Never renumber, never reuse. */
  id: string;
  title: string;
  /** One or two sentences of plain text. This page has no markdown renderer. */
  blurb: string;
  status: RoadmapStatus;
  /**
   * Linear issue key, e.g. "SOR-134". Rendered as a plain chip, never a link:
   * the workspace is private, so a link would send visitors to a login wall.
   * It reads as a title ID, which suits the Xbox framing.
   */
  issue?: string;
  /**
   * Deliberately vague, e.g. "v1.6" or "after the audio rework". Never a hard
   * date: a missed date on a personal site is worse than no date at all.
   */
  target?: string;
  /** Release the entry shipped in. Only meaningful when status is 'shipped'. */
  shippedIn?: string;
}

/** Display order of the status groups. */
export const ROADMAP_STATUS_ORDER: readonly RoadmapStatus[] = [
  'in-progress',
  'next',
  'someday',
  'shipped',
];

export const ROADMAP_STATUS_LABELS: Record<RoadmapStatus, string> = {
  'in-progress': 'In progress',
  next: 'Up next',
  someday: 'Someday',
  shipped: 'Recently shipped',
};
