import React from 'react';
import styles from './BookSkeleton.module.css';

/**
 * BookSkeleton component - Loading state placeholder for Book components
 * 
 * @description
 * Displays a book-shaped dotted outline with shimmer effects during loading states.
 * Maintains the same dimensions and layout as the actual Book component to prevent
 * layout shifts when content loads. Features animated pulse and shimmer effects
 * to provide visual feedback during data fetching.
 * 
 * @example
 * ```tsx
 * // Basic usage in loading state
 * {loading && <BookSkeleton />}
 * 
 * // Multiple skeletons for a shelf
 * {Array.from({ length: 6 }, (_, index) => (
 *   <BookSkeleton key={`skeleton-${index}`} />
 * ))}
 * ```
 * 
 * @since 1.0.0
 * @author Soros Febriano
 * 
 * @see {@link Book} - The actual component this skeleton represents
 * @see {@link BookRack} - Parent component that uses this skeleton
 */
export const BookSkeleton: React.FC = () => {
  return (
    <div className={styles.bookSkeleton}>
      {/* Book Cover Skeleton */}
      <div className={styles.skeletonCover}>
        {/* Username skeleton */}
        <div className={styles.skeletonUsername}></div>

        {/* Cover Image skeleton */}
        <div className={styles.skeletonImageSection}></div>

        {/* Title skeleton */}
        <div className={styles.skeletonTitleSection}>
          <div className={styles.skeletonTitleLine}></div>
          <div className={styles.skeletonTitleLine}></div>
        </div>

        {/* Logo skeleton */}
        <div className={styles.skeletonLogoSection}></div>
      </div>
      
      {/* Book shadow skeleton */}
      <div className={styles.skeletonShadow}></div>
    </div>
  );
};

export default BookSkeleton;