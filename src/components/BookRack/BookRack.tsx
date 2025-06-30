import React, { useState } from 'react';
import styles from './BookRack.module.css';
import { useAudioManager } from '../../hooks/useAudioManager';
import { Book } from './Book';
import { BookSkeleton } from './Book/BookSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { generateBookColor } from '../../utils/colorUtils';
import { groupItemsIntoRows, calculateItemsPerRow } from '../../utils/responsiveUtils';

/**
 * Article data structure matching Medium RSS feed format
 * 
 * @interface Article
 * @since 1.0.0
 */
export interface Article {
  /** Article title from Medium */
  title: string;
  /** Direct link to the Medium article */
  link: string;
  /** Publication date in ISO string format */
  pubDate: string;
  /** Brief content excerpt for preview */
  contentSnippet: string;
  /** Cover image URL extracted from article content, null if none */
  coverImage: string | null;
}

/**
 * Props for the BookRack component
 * 
 * @interface BookRackProps
 * @since 1.0.0
 */
export interface BookRackProps {
  /** Array of articles to display as books on the shelf */
  articles: Article[];
  /** Whether to show search functionality
   * @default true
   */
  showSearch?: boolean;
  /** Loading state indicator - shows skeletons when true
   * @default false
   */
  loading?: boolean;
}

/**
 * BookRack component for displaying Medium articles as books on a wooden bookshelf
 * 
 * @description
 * A sophisticated skeumorphic component that renders Medium articles as 3D books
 * arranged on realistic wooden bookshelves. Features include:
 * 
 * - **Realistic 3D Design**: Wooden shelves with grain patterns, shadows, and depth
 * - **Responsive Grid**: Automatically adjusts books per row based on screen size
 * - **Search Functionality**: Real-time filtering of articles by title and content
 * - **Loading States**: Skeleton books maintain layout during data fetching
 * - **Audio Feedback**: Sound effects for hover and click interactions
 * - **Smooth Animations**: Staggered book appearances and shelf transitions
 * - **Color Generation**: Dynamic book colors based on article title hashing
 * 
 * The component follows responsive design principles:
 * - Desktop (≥1400px): 6 books per row
 * - Large (≥1200px): 5 books per row  
 * - Medium (≥992px): 4 books per row
 * - Tablet (≥768px): 3 books per row
 * - Mobile (<768px): 2 books per row
 * 
 * @example
 * ```tsx
 * // Basic usage with articles
 * <BookRack 
 *   articles={mediumArticles}
 *   showSearch={true}
 *   loading={false}
 * />
 * 
 * // Loading state
 * <BookRack 
 *   articles={[]}
 *   loading={true}
 * />
 * 
 * // Without search
 * <BookRack 
 *   articles={articles}
 *   showSearch={false}
 * />
 * ```
 * 
 * @param props - The component props
 * @returns JSX element representing a wooden bookshelf with article books
 * 
 * @since 1.0.0
 * @author Soros Febriano
 * 
 * @see {@link Book} - Individual book component
 * @see {@link BookSkeleton} - Loading state component
 * @see {@link useVolume} - Audio volume context hook
 */
export const BookRack: React.FC<BookRackProps> = ({
  articles,
  showSearch = true,
  loading = false,
}) => {
  const { playSound } = useAudioManager();
  const [searchTerm, setSearchTerm] = useState('');

  const playHoverSound = () => playSound('owawa');
  const playClickSound = () => playSound('click');

  /** Filter articles based on search */
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookClick = (article: Article) => {
    playClickSound();
    window.open(article.link, '_blank', 'noopener noreferrer');
  };

  if (loading) {
    const booksPerRow = calculateItemsPerRow();
    const skeletonRows = Array.from({ length: 3 }, (_, rowIndex) => (
      <div key={`skeleton-row-${rowIndex}`} className={styles.bookshelf}>
        <div className={styles.booksRow}>
          {Array.from({ length: booksPerRow }, (_, bookIndex) => (
            <BookSkeleton key={`skeleton-${rowIndex}-${bookIndex}`} />
          ))}
        </div>
        <div className={styles.shelfPlank}></div>
        <div className={styles.shelfFront}></div>
      </div>
    ));

    return (
      <div className={styles.bookRack}>
        {showSearch && (
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Loading articles..."
              value=""
              disabled
              className={styles.searchInput}
            />
          </div>
        )}
        
        <div className={styles.bookshelfContainer}>
          {skeletonRows}
          <div className={styles.rightPanel}></div>
        </div>
      </div>
    );
  }

  const bookRows = groupItemsIntoRows(filteredArticles);
  const booksPerRow = calculateItemsPerRow();

  return (
    <div className={styles.bookRack}>
      {/* Search */}
      {showSearch && (
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      )}

      {/* Wooden Bookshelf with Multiple Shelves */}
      <div className={styles.bookshelfContainer}>
        {filteredArticles.length === 0 ? (
          <div className={styles.emptyLibrary}>
            <div className={styles.emptyShelf}>
              <div className={styles.shelfWood}></div>
              <div className={styles.emptyMessage}>
                <p>No articles found</p>
                <small>Try adjusting your search terms</small>
              </div>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {bookRows.map((row, rowIndex) => (
              <motion.div 
                key={`shelf-${rowIndex}-${row.length}`} 
                className={styles.bookshelf}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: rowIndex * 0.1 
                }}
              >
                {/* Books on this shelf */}              
                <div className={styles.booksRow}>
                  {row.map((article, bookIndex) => {
                    const globalIndex = rowIndex * booksPerRow + bookIndex;
                    return (
                      <Book
                        key={`${article.link}-${globalIndex}`}
                        article={article}
                        username="soros21febriano"
                        bookColor={generateBookColor(article.title)}
                        animationDelay={`${globalIndex * 0.1}s`}
                        onClick={() => handleBookClick(article)}
                        onMouseEnter={playHoverSound}
                      />
                    );
                  })}
                </div>
                
                {/* Horizontal shelf plank - where books rest */}
                <div className={styles.shelfPlank}></div>
                <div className={styles.shelfFront}></div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        {/* Right side panel */}
        <div className={styles.rightPanel}></div>
      </div>
    </div>
  );
};

export default BookRack;