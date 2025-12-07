'use client';

import { createContext, useContext, ReactNode } from 'react';
import { LayoutSize, LayoutVariant, LayoutDimensions } from './PageLayout.types';

/**
 * Context value interface for PageLayout compound components
 * 
 * @description
 * Provides shared state and handlers to all PageLayout sub-components.
 * This enables compound components to communicate without prop drilling.
 * 
 * @interface PageLayoutContextValue
 * @since 2.0.0
 */
export interface PageLayoutContextValue {
  /** Page title for Header component */
  title: string;
  /** Unique ID for aria-labelledby linking */
  titleId: string;
  /** Whether the layout is in exit animation state */
  isExiting: boolean;
  /** Handler to close/navigate away from the layout */
  handleClose: () => void;
  /** Current layout size */
  size: LayoutSize;
  /** Current layout variant */
  variant: LayoutVariant;
  /** Custom dimensions override */
  customDimensions?: LayoutDimensions;
}

/**
 * PageLayout Context
 * 
 * @description
 * React Context for sharing state between PageLayout compound components.
 * Null when used outside of PageLayout provider (will throw error).
 * 
 * @since 2.0.0
 */
const PageLayoutContext = createContext<PageLayoutContextValue | null>(null);

/**
 * Hook to access PageLayout context
 * 
 * @description
 * Custom hook for compound components to access shared PageLayout state.
 * Throws a descriptive error if used outside of a PageLayout provider.
 * 
 * @returns PageLayoutContextValue - The context value with all shared state
 * @throws Error if used outside of PageLayout
 * 
 * @example
 * ```tsx
 * function CustomHeader() {
 *   const { title, handleClose } = usePageLayout();
 *   return <h1>{title}</h1>;
 * }
 * ```
 * 
 * @since 2.0.0
 */
export function usePageLayout(): PageLayoutContextValue {
  const context = useContext(PageLayoutContext);
  if (!context) {
    throw new Error(
      'PageLayout compound components must be used within <PageLayout>. ' +
      'Wrap your component tree with <PageLayout> or use the simplified API.'
    );
  }
  return context;
}

/**
 * Props for PageLayoutProvider
 */
interface PageLayoutProviderProps {
  children: ReactNode;
  value: PageLayoutContextValue;
}

/**
 * PageLayout Context Provider
 * 
 * @description
 * Internal provider component used by PageLayout root.
 * Not exported publicly - use PageLayout component instead.
 * 
 * @since 2.0.0
 */
export function PageLayoutProvider({ children, value }: Readonly<PageLayoutProviderProps>) {
  return (
    <PageLayoutContext.Provider value={value}>
      {children}
    </PageLayoutContext.Provider>
  );
}

export { PageLayoutContext };
