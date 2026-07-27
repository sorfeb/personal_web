import type { LucideIcon } from 'lucide-react';
import { FolderGit2, Mail, Sparkles, Trophy, User, Wrench } from 'lucide-react';

export type SectionId = 'profile' | 'experience' | 'work' | 'skills' | 'about' | 'contact';

/** DOM ids used as scroll targets on mobile. */
export const sectionDomId = (id: SectionId) => `gc-${id}`;

export const SECTION_DOM_IDS: readonly string[] = [
  'gc-profile',
  'gc-experience',
  'gc-work',
  'gc-skills',
  'gc-about',
  'gc-contact',
];

export interface MenuItem {
  kind: 'section' | 'action';
  id: SectionId | 'save-contact' | 'dashboard';
  label: string;
}

/** Desktop left-column menu, mirroring the blades-era Profile screen. */
export const MENU_ITEMS: MenuItem[] = [
  { kind: 'section', id: 'experience', label: 'View Experience' },
  { kind: 'section', id: 'work', label: 'Selected Work' },
  { kind: 'section', id: 'skills', label: 'Skills & Certs' },
  { kind: 'section', id: 'about', label: 'About Me' },
  { kind: 'section', id: 'contact', label: 'Contact' },
  { kind: 'action', id: 'save-contact', label: 'Save Contact' },
  { kind: 'action', id: 'dashboard', label: 'Enter Dashboard' },
];

export interface TabItem {
  id: SectionId;
  label: string;
  Icon: LucideIcon;
}

/** Mobile bottom tab bar. */
export const TAB_ITEMS: TabItem[] = [
  { id: 'profile', label: 'Profile', Icon: User },
  { id: 'experience', label: 'Experience', Icon: Trophy },
  { id: 'work', label: 'Work', Icon: FolderGit2 },
  { id: 'skills', label: 'Skills', Icon: Wrench },
  { id: 'about', label: 'About', Icon: Sparkles },
  { id: 'contact', label: 'Contact', Icon: Mail },
];
