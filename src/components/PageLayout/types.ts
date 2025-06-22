export type LayoutSize = 'compact' | 'default' | 'wide' | 'full' | 'custom';

export type LayoutVariant = 'windowed' | 'fullscreen' | 'minimal';

export interface LayoutDimensions {
  width?: string;
  maxWidth?: string;
  height?: string;
  padding?: string;
}

export interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  size?: LayoutSize;
  variant?: LayoutVariant;
  customDimensions?: LayoutDimensions;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export interface WindowContainerProps {
  children: React.ReactNode;
  size: LayoutSize;
  customDimensions?: LayoutDimensions;
  className?: string;
}
