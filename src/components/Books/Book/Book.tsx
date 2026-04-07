import React from 'react';
import { motion } from 'framer-motion';
import styles from './Book.module.css';
import { Article } from '../BookRack/BookRack';
import Image from 'next/image';

/**
 * Props for the Book component
 * 
 * @interface BookProps
 * @since 1.0.0
 */
export interface BookProps {
  /** Article data to display as a book */
  article: Article;
  /** Author username to display at top of book cover
   * @default 'soros21febriano'
   */
  username?: string;
  /** Book color based on title hash - used for placeholder covers */
  bookColor: string;
  /** Animation delay for staggered appearance in CSS format (e.g., "0.1s") */
  animationDelay: string;
  /** Click handler for book interaction - typically opens article link */
  onClick: () => void;
  /** Hover sound handler - plays audio feedback on mouse enter */
  onMouseEnter: () => void;
}

/**
 * Individual Book component representing a Medium article
 * 
 * @description
 * Renders a single book with 3D skeumorphic styling that represents a Medium article.
 * Features hover effects, click interactions, and displays article metadata in a
 * book-like format. Follows the visual hierarchy: username → cover_image → title → medium_logo.
 * 
 * Key features:
 * - 3D hover animations with perspective transforms
 * - Dynamic color generation for placeholder covers
 * - Responsive design with breakpoint-based sizing
 * - Accessibility support with keyboard navigation
 * - Audio feedback integration
 * - Shimmer effects on hover
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Book
 *   article={articleData}
 *   username="soros21febriano"
 *   bookColor="#8B4513"
 *   animationDelay="0.2s"
 *   onClick={() => window.open(article.link, '_blank')}
 *   onMouseEnter={() => playHoverSound()}
 * />
 * 
 * // With custom styling
 * <Book
 *   article={article}
 *   bookColor={generateBookColor(article.title)}
 *   animationDelay={`${index * 0.1}s`}
 *   onClick={handleBookClick}
 *   onMouseEnter={playHoverSound}
 * />
 * ```
 * 
 * @param props - The component props
 * @returns JSX element representing a 3D book with article content
 * 
 * @since 1.0.0
 * @author Soros Febriano
 * 
 * @see {@link BookRack} - Parent component that renders multiple books
 * @see {@link BookSkeleton} - Loading state component
 * @see {@link Article} - Data structure for article information
 */
export const Book: React.FC<BookProps> = ({
  article,
  username = 'soros21febriano',
  bookColor,
  animationDelay,
  onClick,
  onMouseEnter,
}) => {
  return (
    <motion.div
      className={styles.book}
      style={{ 
        '--book-color': bookColor,
        '--book-delay': animationDelay
      } as React.CSSProperties}
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: parseFloat(animationDelay.replace('s', '')),
        ease: "easeOut"
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Book Cover */}
      <div className={styles.bookCover}>
        {/* Username at top */}
        <div className={styles.username}>
          @{username}
        </div>

        {/* Cover Image Section */}
        <div className={styles.coverImageSection}>
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.title}
              className={styles.coverImage}
              width={140}
              height={120}
              sizes="140px"
            />
          ) : (
            <div 
              className={styles.placeholderCover}
              data-book-color={bookColor}
            >
              <div className={styles.placeholderPattern}></div>
            </div>
          )}
        </div>

        {/* Title Section */}
        <div className={styles.titleSection}>
          <h3 className={styles.title}>{article.title}</h3>
        </div>

        {/* Medium Logo Section */}
        <div className={styles.logoSection}>
          <div className={styles.mediumLogo}>
            <svg viewBox="0 0 1043.63 592.71" className={styles.mediumIcon}>
                <path 
                  className={styles.logoText}
                  d="M588.67 296.36c0 163.67-131.78 296.35-294.33 296.35S0 460.03 0 296.36 131.78 0 294.34 0s294.33 132.69 294.33 296.36M911.56 296.36c0 154.06-65.89 279-147.17 279s-147.17-124.94-147.17-279 65.88-279 147.16-279 147.17 124.9 147.17 279M1043.63 296.36c0 138-23.17 249.94-51.76 249.94s-51.75-111.91-51.75-249.94 23.17-249.94 51.75-249.94 51.76 111.9 51.76 249.94"
                />
            </svg>
          </div>
        </div>

        {/* Book spine shadow for depth */}
        <div className={styles.bookSpine}></div>
      </div>      
      {/* Book shadow on shelf */}
      <div className={styles.bookShadow}></div>
    </motion.div>
  );
};

export default Book;