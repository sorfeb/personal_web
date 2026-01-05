/**
 * Chat Feature Exports
 * 
 * Clean imports for the chat system following SOLID principles.
 * Each component has a single responsibility and is organized in its own folder.
 */

export { default as ChatManager } from './ChatManager/ChatManager';
export { default as ChatWindow } from './ChatWindow/ChatWindow';
export { default as ChatTab } from './ChatTab/ChatTab';
export { default as ChatRoom } from './ChatRoom/ChatRoom';

// Re-export types for convenience
export type { 
  ChatWindowProps, 
  ChatTabProps, 
  ChatWindowState, 
  ChatPosition, 
  ChatSize 
} from '../../types/chat';
