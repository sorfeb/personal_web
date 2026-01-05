/**
 * Configuration constants for user-related data.
 */

/**
 * Default guest profile for unauthenticated users.
 */
export const GUEST_PROFILE = {
  id: 'guest',
  name: 'Guest',
  gamerscore: 0,
  avatar: 'guest_gamerpic.svg',
  isGuest: true,
};

/**
 * Default avatar filename if a user's avatar is not set.
 */
export const DEFAULT_AVATAR = 'guest_gamerpic.svg';

/**
 * List of available avatar filenames.
 */
export const AVAILABLE_AVATARS = [
  '20001.png', '20002.png', '20003.png', '20004.png', '20006.png',
  '20008.png', '2000a.png', '2000b.png', '2000c.png', '2803d.png',
  'guest_gamerpic.svg',
];
