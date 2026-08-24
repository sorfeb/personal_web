/**
 * Chat room limits.
 *
 * The burst tiers mirror ryOS's public-room limits: a short window that stops
 * flooding, a longer window that stops sustained spam, and a minimum interval
 * that stops a held Enter key. All three are enforced together in
 * `messageRateLimit`, since any one alone is trivially defeated.
 */
export const CHAT_LIMITS = {
  /** Hard ceiling on stored message length, applied after sanitising. */
  MAX_MESSAGE_LENGTH: 500,

  /** Minimum gap between two messages from the same author. */
  MIN_INTERVAL_MS: 2_000,

  /** Short burst: at most this many messages inside SHORT_WINDOW_MS. */
  SHORT_BURST_MAX: 3,
  SHORT_WINDOW_MS: 10_000,

  /** Long burst: at most this many messages inside LONG_WINDOW_MS. */
  LONG_BURST_MAX: 20,
  LONG_WINDOW_MS: 60_000,

  /** Transcript page size. */
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 100,
} as const;

/** Slug of the room the chat page opens on when none is specified. */
export const DEFAULT_ROOM_SLUG = 'general';
