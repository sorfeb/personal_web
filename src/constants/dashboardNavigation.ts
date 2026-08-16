/**
 * Shared DOM ids wiring the blade menu (tablist) to the card area (tabpanel).
 *
 * The blade menu and the dashboard are sibling components, so the WAI-ARIA tabs
 * relationship (`aria-controls` / `aria-labelledby`) has to be expressed through
 * ids both sides agree on rather than through props.
 */

/** Stable id for the tab representing the blade at `index`. */
export const bladeTabId = (index: number): string => `blade-tab-${index}`;

/** Stable id for the single card area the blades control. */
export const DASHBOARD_PANEL_ID = 'dashboard-panel';

/**
 * Input-router scope shared by the blade menu and the card stack.
 *
 * They are siblings that each own half of the same navigation — blades handle
 * `up`/`down`, cards handle `left`/`right` — so they contribute to one scope
 * instead of pushing two and competing for the top of the stack.
 */
export const DASHBOARD_SCOPE_ID = 'dashboard';
