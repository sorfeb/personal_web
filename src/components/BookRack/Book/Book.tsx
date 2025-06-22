import React from 'react';
import { motion } from 'framer-motion';
import styles from './Book.module.css';
import { Article } from '../BookRack';

/**
 * Book component props
 */
export interface BookProps {
  /** Article data to display as a book */
  article: Article;
  /** Author username to display at top */
  username?: string;
  /** Book color based on title hash */
  bookColor: string;
  /** Animation delay for staggered appearance */
  animationDelay: string;
  /** Click handler for book interaction */
  onClick: () => void;
  /** Hover sound handler */
  onMouseEnter: () => void;
}

/**
 * Individual Book component representing a Medium article
 * Follows the design: username → cover_image → title → medium_logo
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
            <img 
              src={article.coverImage} 
              alt={article.title}
              className={styles.coverImage}
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