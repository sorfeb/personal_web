import { ReactNode } from 'react';

/**
 * Available layout sizes for the PageLayout system
 * 
 * @description
 * Predefined size configurations optimized for different content types:
 * - `compact`: Small forms, dialogs, simple content (50% width, 600px max)
 * - `default`: Standard pages with moderate content (70% width, 900px max)  
 * - `wide`: Content-heavy pages like galleries, blogs (90% width, 1400px max)
 * - `full`: Dashboards, data tables, media viewers (98% width, no max)
 * - `custom`: Use customDimensions prop for specific requirements
 * 
 * @since 1.0.0
 */
export type LayoutSize = 'compact' | 'default' | 'wide' | 'full' | 'custom';

/**
 * Available layout variants for different presentation modes
 * 
 * @description
 * Layout presentation strategies:
 * - `windowed`: Standard windowed layout with container styling and borders
 * - `fullscreen`: Full viewport coverage for immersive experiences
 * - `minimal`: Lightweight layout with minimal styling overhead
 * 
 * @since 1.0.0
 */
export type LayoutVariant = 'windowed' | 'fullscreen' | 'minimal';

/**
 * Layout dimensions configuration interface
 * 
 * @description
 * Defines the dimensional properties that can be configured for layout containers.
 * All properties are optional to allow partial overrides of default configurations.
 * 
 * @interface LayoutDimensions
 * @since 1.0.0
 */
export interface LayoutDimensions {
  /** CSS width value (e.g., '80%', '1200px') */
  width?: string;
  /** CSS max-width value for responsive behavior */
  maxWidth?: string;
  /** CSS height value (defaults to 'auto' for content-driven height) */
  height?: string;
  /** CSS padding value for internal spacing */
  padding?: string;
}

/**
 * Props interface for the main PageLayout component
 * 
 * @description
 * Comprehensive configuration interface for the PageLayout component.
 * Follows the Open/Closed Principle by allowing extension through props
 * while maintaining a stable core interface.
 * 
 * @interface PageLayoutProps
 * @since 1.0.0
 */
export interface PageLayoutProps {
  /** 
   * Page title displayed in the title container
   * @example "Dashboard", "User Profile", "Settings"
   */
  title: string;
  
  /** 
   * Content to be rendered within the layout
   * @description Can be any valid React content including components, elements, or fragments
   */
  children: ReactNode;
  
  /** 
   * Predefined size configuration
   * @default 'default'
   * @description Selects from predefined responsive size configurations
   */
  size?: LayoutSize;
  
  /** 
   * Layout presentation variant
   * @default 'windowed'
   * @description Determines the overall presentation strategy
   */
  variant?: LayoutVariant;
  
  /** 
   * Custom dimension overrides
   * @description When size is 'custom', these dimensions will be applied.
   * Can also be used to override specific properties of predefined sizes.
   * @example { width: '95%', maxWidth: '1600px', padding: '30px' }
   */
  customDimensions?: LayoutDimensions;
  
  /** 
   * Whether to show the close button
   * @default true
   * @description Controls visibility of the navigation close button
   */
  showCloseButton?: boolean;
  
  /** 
   * Custom close handler
   * @description If provided, overrides the default navigation behavior.
   * Useful for modal-like behavior or custom navigation flows.
   * @param event - The close event (if applicable)
   */
  onClose?: () => void;
}

/**
 * Props interface for the WindowContainer component
 * 
 * @description
 * Focused interface for the window container component that handles
 * only the container-specific properties and styling logic.
 * 
 * @interface WindowContainerProps
 * @since 1.0.0
 */
export interface WindowContainerProps {
  /** 
   * Content to be rendered within the window container
   */
  children: ReactNode;
  
  /** 
   * Predefined size configuration
   * @description Must match one of the available LayoutSize values
   */
  size: LayoutSize;
  
  /** 
   * Custom dimension overrides
   * @description Applied when size is 'custom' or to override specific properties
   */
  customDimensions?: LayoutDimensions;
  
  /** 
   * Additional CSS class names
   * @default ''
   * @description Applied to the window container for additional styling
   */
  className?: string;
}

/**
 * Type guard to check if a value is a valid LayoutSize
 * 
 * @description
 * Runtime type checking utility to ensure type safety when dealing with
 * dynamic size values or user input.
 * 
 * @param value - The value to check
 * @returns True if value is a valid LayoutSize
 * 
 * @example
 * ```typescript
 * const userInput = 'wide';
 * if (isValidLayoutSize(userInput)) {
 *   // userInput is now typed as LayoutSize
 *   const layout = <PageLayout size={userInput} />;
 * }
 * ```
 * 
 * @since 1.0.0
 */
export const isValidLayoutSize = (value: any): value is LayoutSize => {
  return ['compact', 'default', 'wide', 'full', 'custom'].includes(value);
};

/**
 * Type guard to check if a value is a valid LayoutVariant
 * 
 * @description
 * Runtime type checking utility for layout variant validation.
 * 
 * @param value - The value to check
 * @returns True if value is a valid LayoutVariant
 * 
 * @example
 * ```typescript
 * const variant = getVariantFromUrl();
 * if (isValidLayoutVariant(variant)) {
 *   // variant is now typed as LayoutVariant
 *   const layout = <PageLayout variant={variant} />;
 * }
 * ```
 * 
 * @since 1.0.0
 */
export const isValidLayoutVariant = (value: any): value is LayoutVariant => {
  return ['windowed', 'fullscreen', 'minimal'].includes(value);
};
