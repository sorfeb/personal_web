import React from 'react';
import styles from './BookSkeleton.module.css';

/**
 * BookSkeleton component - Shows a book-shaped dotted outline during loading
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