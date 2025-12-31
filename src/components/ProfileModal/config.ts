// ============================================
// PROFILE MODAL CONFIGURATION
// ============================================

import type { ReactNode } from 'react';
import type { BladePageHeader, BladePageFooter } from './types';

/**
 * Configuration for blade page order.
 * Pages are displayed in this order from left to right.
 * The page with initialPageId will be shown in the center.
 */
export const BLADE_PAGE_ORDER = [
  'settings',
  'games',
  'profile',
  'media',
  'theme',
] as const;

export type BladePageId = (typeof BLADE_PAGE_ORDER)[number];

/**
 * Default page to show when modal opens
 */
export const DEFAULT_INITIAL_PAGE: BladePageId = 'profile';

/**
 * Page labels displayed on tabs
 */
export const PAGE_LABELS: Record<BladePageId, string> = {
  settings: 'Settings',
  games: 'Games',
  profile: 'Profile', // Will be overridden with user's name
  media: 'Media',
  theme: 'Theme',
};

/**
 * Default header configurations for each page
 */
export const PAGE_HEADERS: Record<BladePageId, BladePageHeader> = {
  settings: {
    title: 'System Settings',
    subtitle: 'Customize your experience',
    icon: '/assets/icons/settings.svg',
  },
  games: {
    title: 'Games',
    subtitle: 'Your game library',
    icon: '/assets/icons/controller.svg',
  },
  profile: {
    title: 'Gamer Profile',
    subtitle: 'Change your gamer picture',
    icon: '/assets/avatars/guest_gamerpic.svg',
  },
  media: {
    title: 'Media Center',
    subtitle: 'Music, pictures & videos',
    icon: '/assets/icons/media.svg',
  },
  theme: {
    title: 'Themes',
    subtitle: 'Personalize your dashboard',
    icon: '/assets/icons/theme.svg',
  },
};

/**
 * Helper to build blade pages array with content
 */
export interface BladePageConfig {
  id: BladePageId;
  label: string;
  content: ReactNode;
  header?: BladePageHeader;
  footer?: BladePageFooter;
}

export function createBladePages(
  pageContents: Record<BladePageId, ReactNode>,
  labelOverrides?: Partial<Record<BladePageId, string>>,
  headerOverrides?: Partial<Record<BladePageId, Partial<BladePageHeader>>>,
  footerConfigs?: Partial<Record<BladePageId, BladePageFooter>>
): BladePageConfig[] {
  return BLADE_PAGE_ORDER.map((id) => ({
    id,
    label: labelOverrides?.[id] ?? PAGE_LABELS[id],
    content: pageContents[id],
    header: {
      ...PAGE_HEADERS[id],
      ...headerOverrides?.[id],
    },
    footer: footerConfigs?.[id],
  }));
}
