/**
 * Chat System Types
 * Centralized type definitions for the chat feature
 */

export type ChatWindowState = 'closed' | 'minimized' | 'open';

export interface ChatPosition {
  x: number;
  y: number;
}

export interface ChatSize {
  width: number;
  height: number;
}

export interface ChatWindowBounds {
  maxWidth: number;
  maxHeight: number;
  minWidth: number;
  minHeight: number;
}

export interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export interface ChatTabProps {
  onClick: () => void;
  isActive: boolean;
  hasNotification?: boolean;
}

export interface UseChatWindowReturn {
  windowState: ChatWindowState;
  openWindow: () => void;
  closeWindow: () => void;
  minimizeWindow: () => void;
  toggleWindow: () => void;
  isWindowOpen: boolean;
  isTabVisible: boolean;
}
