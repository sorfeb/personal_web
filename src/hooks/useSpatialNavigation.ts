import { useCallback, type RefObject } from 'react';
import { useAudioManager } from './useAudioManager';

/** A directional move request. Matches the four directional gamepad intents. */
export type SpatialDirection = 'up' | 'down' | 'left' | 'right';

/**
 * What counts as a navigation target.
 *
 * `[tabindex]` without a value filter is deliberate — the filter below drops
 * anything with `tabindex="-1"`, which is how Phase 1 removed the off-screen
 * dashboard cards from the tab order. Spatial navigation inherits that for free
 * rather than re-deriving "is this really reachable" from scratch.
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  '[tabindex]',
].join(',');

/**
 * How much a candidate is punished for sitting off to the side of the travel
 * direction. At 3, a target three times further away but perfectly aligned
 * still beats a near one that is badly off-axis — which is what makes a grid
 * feel like a grid rather than a nearest-neighbour scatter.
 */
const CROSS_AXIS_PENALTY = 3;

/**
 * Minimum centre-to-centre travel, in px, before a candidate counts as being in
 * the requested direction. Guards against jitter between near-identical rects.
 */
const MIN_TRAVEL_PX = 1;

interface Point {
  x: number;
  y: number;
}

interface Candidate {
  element: HTMLElement;
  rect: DOMRect;
  centre: Point;
}

const centreOf = (rect: DOMRect): Point => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2,
});

/**
 * Whether an element can actually receive focus right now.
 *
 * Rect size is the load-bearing check: `display: none` and detached elements
 * both collapse to a zero-area rect, and it also catches elements clipped to
 * nothing — which `offsetParent` does not.
 */
const isReachable = (element: HTMLElement): boolean => {
  if (element.hasAttribute('disabled')) return false;
  if (element.tabIndex < 0) return false;
  if (element.closest('[aria-hidden="true"]')) return false;
  if (element.closest('[inert]')) return false;

  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
};

/**
 * The gap between two rects along the axis *perpendicular* to travel, or 0 when
 * they overlap on it.
 *
 * Using the gap rather than centre distance is what makes alignment win: two
 * elements in the same row score an identical 0 here however tall they are, so
 * only the travel distance separates them. Centre distance would penalise a
 * tall neighbour for being tall.
 */
const crossAxisGap = (a: DOMRect, b: DOMRect, direction: SpatialDirection): number => {
  const horizontal = direction === 'left' || direction === 'right';
  const [aStart, aEnd] = horizontal ? [a.top, a.bottom] : [a.left, a.right];
  const [bStart, bEnd] = horizontal ? [b.top, b.bottom] : [b.left, b.right];

  return Math.max(0, aStart - bEnd, bStart - aEnd);
};

/** Signed centre-to-centre travel in the requested direction. Negative = wrong way. */
const travelTowards = (from: Point, to: Point, direction: SpatialDirection): number => {
  switch (direction) {
    case 'left':
      return from.x - to.x;
    case 'right':
      return to.x - from.x;
    case 'up':
      return from.y - to.y;
    case 'down':
      return to.y - from.y;
  }
};

interface UseSpatialNavigationProps {
  /** Search root. Focus never leaves it, which is what makes a modal trapped. */
  containerRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
}

/**
 * Directional focus movement — the thing that makes a d-pad feel like a d-pad.
 *
 * DOM focus is the single source of truth: this hook reads `document.activeElement`,
 * picks a neighbour, and moves real focus there. It never maintains an index, so
 * Tab, screen readers and the pointer all stay in agreement with the controller.
 *
 * Scoring is `travel + crossGap * CROSS_AXIS_PENALTY`, lowest wins. Candidates
 * are rejected outright if they are not in the requested direction, measured
 * centre-to-centre rather than edge-to-edge — the dashboard's card stack overlaps
 * heavily, and edge-based rejection would discard every candidate in it.
 *
 * Roughly 150 lines with the comments, which is the whole argument against taking
 * a dependency for this.
 */
export const useSpatialNavigation = ({
  containerRef,
  enabled = true,
}: UseSpatialNavigationProps) => {
  const { playSound } = useAudioManager();

  const collectCandidates = useCallback((): Candidate[] => {
    const container = containerRef.current;
    if (!container) return [];

    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      .filter(isReachable)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { element, rect, centre: centreOf(rect) };
      });
  }, [containerRef]);

  /**
   * Bring a newly focused element into view. Focus is moved with
   * `preventScroll` first so the browser's own jump never fights the smooth
   * scroll, and `block: 'nearest'` keeps an already-visible element still.
   */
  const revealAndFocus = useCallback((element: HTMLElement) => {
    element.focus({ preventScroll: true });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, []);

  /**
   * Give focus a home. Called when nothing inside the container holds it yet —
   * on page load, or the moment a modal opens.
   */
  const focusFirst = useCallback((): boolean => {
    if (!enabled) return false;

    const candidates = collectCandidates();
    if (candidates.length === 0) return false;

    // Reading order, not DOM order: the top-left-most target is what a person
    // expects to land on, and DOM order can put a footer control first. The 1px
    // tolerance treats a row as a row despite sub-pixel layout differences.
    const entry = candidates.reduce((best, candidate) => {
      const sameRow = Math.abs(candidate.centre.y - best.centre.y) <= 1;
      if (sameRow) return candidate.centre.x < best.centre.x ? candidate : best;
      return candidate.centre.y < best.centre.y ? candidate : best;
    });

    revealAndFocus(entry.element);
    return true;
  }, [enabled, collectCandidates, revealAndFocus]);

  /**
   * Move focus one step in `direction`.
   *
   * @returns whether focus actually moved, so a caller can decide what a dead
   *   end means — a modal swallows it, a page might hand it back to a sibling.
   */
  const moveFocus = useCallback(
    (direction: SpatialDirection): boolean => {
      if (!enabled) return false;

      const container = containerRef.current;
      if (!container) return false;

      const active = document.activeElement as HTMLElement | null;

      // Nothing here holds focus yet — the first press is an entry, not a move.
      if (!active || active === document.body || !container.contains(active)) {
        return focusFirst();
      }

      const originRect = active.getBoundingClientRect();
      const originCentre = centreOf(originRect);

      let winner: Candidate | undefined;
      let bestScore = Number.POSITIVE_INFINITY;

      for (const candidate of collectCandidates()) {
        if (candidate.element === active) continue;

        const travel = travelTowards(originCentre, candidate.centre, direction);
        if (travel < MIN_TRAVEL_PX) continue;

        const score =
          travel + crossAxisGap(originRect, candidate.rect, direction) * CROSS_AXIS_PENALTY;

        if (score < bestScore) {
          bestScore = score;
          winner = candidate;
        }
      }

      if (!winner) return false;

      revealAndFocus(winner.element);
      playSound('ting');
      return true;
    },
    [enabled, containerRef, collectCandidates, focusFirst, revealAndFocus, playSound],
  );

  return { moveFocus, focusFirst };
};
