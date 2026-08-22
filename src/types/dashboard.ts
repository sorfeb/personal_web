import type { XboxCardProps } from '@/components/XboxCard/card/XboxCard';

/**
 * One entry in a dashboard blade (`src/data/cardsList.ts`).
 *
 * Derived from `XboxCardProps` rather than declared alongside it so the data
 * file and the component cannot drift: adding a card field means adding it to
 * the card, not to a parallel interface that only looks like the card's.
 * `offscreen` is excluded — the stack owns it, not the data.
 */
export type DashboardCard = Pick<
  XboxCardProps,
  'title' | 'route' | 'iconUrl' | 'images' | 'variant' | 'artUrl'
>;

/** The full blade map: blade name to its cards, in display order. */
export type DashboardData = Record<string, DashboardCard[]>;
