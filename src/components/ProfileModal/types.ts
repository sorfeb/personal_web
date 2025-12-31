// ============================================
// PROFILE MODAL TYPES
// ============================================

import { ReactNode } from 'react';

// ============================================
// BLADE NAVIGATION TYPES
// ============================================

/** Header configuration for a blade page */
export interface BladePageHeader {
  /** Main title displayed in the header */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Optional icon path */
  icon?: string;
}

/** Footer action button configuration */
export interface BladeFooterAction {
  /** Button key/id */
  key: string;
  /** Display label */
  label: string;
  /** Button icon (e.g., 'A', 'B', 'X', 'Y') */
  buttonIcon: string;
  /** Click handler */
  onClick?: () => void;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Tooltip text */
  tooltip?: string;
}

/** Footer configuration for a blade page */
export interface BladePageFooter {
  /** Array of action buttons to display */
  actions: BladeFooterAction[];
}

/** Represents a single page/blade in the navigation */
export interface BladePage {
  /** Unique identifier for the page */
  id: string;
  /** Display label shown on the tab */
  label: string;
  /** React content to render when this page is active */
  content: ReactNode;
  /** Optional header configuration */
  header?: BladePageHeader;
  /** Optional footer configuration */
  footer?: BladePageFooter;
}

/** Props for the BladeNavigation component */
export interface BladeNavigationProps {
  /** Ordered array of pages - position determines left/right placement */
  pages: BladePage[];
  /** ID of the initially active page */
  initialPageId?: string;
  /** Callback when active page changes */
  onPageChange?: (pageId: string) => void;
}

/** Props for individual blade tabs */
export interface BladeTabProps {
  /** The page data for this tab */
  page: BladePage;
  /** Which side of the modal this tab is on */
  side: 'left' | 'right';
  /** Position in the stack (0 = closest to center) */
  stackIndex: number;
  /** Total number of tabs in this stack */
  totalInStack: number;
  /** Click handler */
  onClick: () => void;
}

// ============================================
// PROFILE MODAL TYPES
// ============================================

/** Props for the ProfileModal component */
export interface ProfileModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
}

// ============================================
// BLADE PAGE CONTENT TYPES
// ============================================

/** User profile data */
export interface ProfileData {
  name: string;
  avatar: string;
  gamerscore: number;
  isGuest: boolean;
}

/** Avatar option data */
export interface Avatar {
  id: string;
  name: string;
  path: string;
}

/** Props for the ProfilePage component */
export interface ProfilePageProps {
  profile: ProfileData;
  avatars: Avatar[];
  selectedAvatar: string | null;
  onAvatarSelect: (avatarId: string) => void;
}

/** Theme option data */
export interface ThemeOption {
  id: string;
  name: string;
  color: string;
}
