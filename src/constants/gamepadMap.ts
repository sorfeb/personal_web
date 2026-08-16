import type { GamepadIntent } from '@/types/gamepad';

/**
 * Standard-mapping button indices.
 *
 * The W3C Gamepad spec defines a canonical layout that browsers expose as
 * `gamepad.mapping === 'standard'`. An Xbox 360 controller, an Xbox Series pad,
 * a DualShock and most third-party pads all land on it, so one table covers
 * them. Glyphs shown in the UI are always Xbox glyphs regardless — the site is
 * an Xbox replica and that premise wins.
 *
 * Index 16 (Guide) is deliberately absent: XInput reserves it on Windows, so it
 * never reaches the browser reliably and must not be load-bearing.
 */
export const GAMEPAD_BUTTON = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  LB: 4,
  RB: 5,
  LT: 6,
  RT: 7,
  BACK: 8,
  START: 9,
  L3: 10,
  R3: 11,
  DPAD_UP: 12,
  DPAD_DOWN: 13,
  DPAD_LEFT: 14,
  DPAD_RIGHT: 15,
} as const;

/** Standard-mapping axis indices. */
export const GAMEPAD_AXIS = {
  LEFT_X: 0,
  LEFT_Y: 1,
  RIGHT_X: 2,
  RIGHT_Y: 3,
} as const;

/** Button index → intent. Buttons absent from this map emit nothing. */
export const BUTTON_INTENTS: Readonly<Record<number, GamepadIntent>> = {
  [GAMEPAD_BUTTON.A]: 'confirm',
  [GAMEPAD_BUTTON.B]: 'back',
  [GAMEPAD_BUTTON.X]: 'action',
  [GAMEPAD_BUTTON.Y]: 'alt',
  [GAMEPAD_BUTTON.LB]: 'pageLeft',
  [GAMEPAD_BUTTON.RB]: 'pageRight',
  [GAMEPAD_BUTTON.BACK]: 'select',
  [GAMEPAD_BUTTON.START]: 'start',
  [GAMEPAD_BUTTON.DPAD_UP]: 'up',
  [GAMEPAD_BUTTON.DPAD_DOWN]: 'down',
  [GAMEPAD_BUTTON.DPAD_LEFT]: 'left',
  [GAMEPAD_BUTTON.DPAD_RIGHT]: 'right',
};

export const GAMEPAD_TIMING = {
  /**
   * Analogue stick threshold for *discrete* menu movement. Deliberately high:
   * a menu step is a yes/no decision, and a low threshold turns resting-thumb
   * drift into phantom navigation. Analogue scrolling (Phase 3) uses its own,
   * much smaller, threshold.
   */
  DEADZONE: 0.5,
  /**
   * Delayed Auto Shift — how long a direction must be held before it repeats.
   * Matched to the OS key-repeat feel so held D-pad and held arrow key agree.
   */
  REPEAT_DELAY_MS: 400,
  /** Auto Repeat Rate — interval between repeats once DAS has elapsed. */
  REPEAT_INTERVAL_MS: 150,
} as const;

/**
 * Xbox glyph for each intent, for `ui/Button`'s `badge` prop and the on-screen
 * legend. Directional intents have no glyph — they are the stick and D-pad.
 */
export const INTENT_GLYPH: Partial<Record<GamepadIntent, string>> = {
  confirm: 'A',
  back: 'B',
  action: 'X',
  alt: 'Y',
};
