/**
 * Gamepad input layer — shared vocabulary.
 *
 * The site is operated by mouse, touch, keyboard and gamepad. Rather than let
 * each of those grow its own listeners, hardware events are normalised into a
 * small set of **intents** and routed through a single scope stack. See
 * CLAUDE.md § Input & Navigation Model, and the design record in Linear.
 */

/**
 * A normalised navigation or action intent.
 *
 * Deliberately hardware-agnostic: `confirm` is A on a controller and Enter on a
 * keyboard, and a scope that handles `confirm` never needs to know which.
 */
export type GamepadIntent =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'confirm'
  | 'back'
  | 'action'
  | 'alt'
  | 'pageLeft'
  | 'pageRight'
  | 'start'
  | 'select';

/**
 * Intents that repeat while held. Directional movement wants auto-repeat so a
 * held stick keeps scrolling; `confirm` must not, or one press activates a
 * control several times.
 */
export const REPEATABLE_INTENTS: readonly GamepadIntent[] = [
  'up',
  'down',
  'left',
  'right',
] as const;

/**
 * Handlers a scope may supply. Every intent is optional — a scope declares only
 * what it understands.
 */
export type GamepadIntentHandlers = Partial<Record<GamepadIntent, () => void>>;

/**
 * A registered region of the UI that can receive intents.
 *
 * Scopes form a stack and only the **topmost** one receives intents. There is
 * no fall-through: a modal that handles `up`/`down` but not `left` must swallow
 * `left` rather than let the dashboard behind it steer. This is exactly the
 * property the old `document.querySelector('[role="dialog"]')` guard was
 * approximating.
 */
export interface GamepadScope {
  /** Stable identifier, used for debugging and for stack removal. */
  id: string;
  handlers: GamepadIntentHandlers;
  /**
   * When this scope is popped, return focus to whatever held it when the scope
   * was pushed. Modals want this; a long-lived page scope does not.
   */
  restoreFocusOnPop?: boolean;
}

/** Which device last produced input. Mirrored onto `<html data-input>`. */
export type InputMode = 'pointer' | 'gamepad';

/** A single frame of readable controller state, for the debug overlay. */
export interface GamepadSnapshot {
  connected: boolean;
  id: string;
  index: number;
  mapping: string;
  buttons: number[];
  axes: number[];
}
