import React, { useState } from 'react';
import styles from './BookRack.module.css';
import { useVolume } from '../../context/VolumeContext';
import { Book } from './Book';
import { BookSkeleton } from './Book/BookSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

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
  const { volume } = useVolume();
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Plays hover sound effect when user hovers over a book
   * 
   * @description
   * Uses the PS2-style hover sound with volume control from context.
   * Fails silently if audio cannot be played (e.g., autoplay restrictions).
   * 
   * @since 1.0.0
   */
  const playHoverSound = () => {
    const audio = new Audio('/assets/audio/ps2_owawa.wav');
    audio.volume = volume;
    audio.play().catch(() => console.log('Audio failed'));
  };

  /**
   * Plays click sound effect when user clicks a book
   * 
   * @description
   * Uses the PS2-style selection sound with volume control from context.
   * Provides audio feedback for user interactions.
   * 
   * @since 1.0.0
   */
  const playClickSound = () => {
    const audio = new Audio('/assets/audio/ps2_zing.wav');
    audio.volume = volume;
    audio.play().catch(() => console.log('Audio failed'));
  };

  // Filter articles based on search
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.contentSnippet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Generates consistent book cover colors based on article title
   * 
   * @description
   * Uses a simple hash function on the article title to generate a consistent
   * color from a predefined palette. Ensures the same title always gets the
   * same color across renders.
   * 
   * @param title - The article title to hash
   * @returns Hex color string from the predefined palette
   * 
   * @since 1.0.0
   */
  const generateBookColor = (title: string) => {
    const colors = [
      '#8B4513', '#A0522D', '#CD853F', '#DEB887', '#D2691E', 
      '#B22222', '#DC143C', '#8B0000', '#228B22', '#006400',
      '#4682B4', '#1E90FF', '#191970', '#4B0082', '#800080'
    ];
    const hash = title.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  /**
   * Calculates optimal number of books per row based on viewport width
   * 
   * @description
   * Implements responsive design by returning different book counts for
   * different screen sizes. Provides fallback for SSR environments.
   * 
   * @returns Number of books that should fit per shelf row
   * 
   * @since 1.0.0
   */
  const booksPerRow = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 1400) return 6;
      if (width >= 1200) return 5;
      if (width >= 992) return 4;
      if (width >= 768) return 3;
      return 2;
    }
    return 4; // Default for SSR
  };

  /**
   * Groups articles into rows for shelf layout
   * 
   * @description
   * Takes the filtered articles array and chunks it into rows based on
   * the current responsive breakpoint. Each row becomes a separate shelf.
   * 
   * @param books - Array of articles to group
   * @returns Array of article arrays, each representing a shelf row
   * 
   * @since 1.0.0
   */
  const groupBooksIntoRows = (books: Article[]) => {
    const perRow = booksPerRow();
    const rows = [];
    for (let i = 0; i < books.length; i += perRow) {
      rows.push(books.slice(i, i + perRow));
    }
    return rows;
  };

  /**
   * Handles book click interactions
   * 
   * @description
   * Plays click sound and opens the article in a new tab/window.
   * Uses noopener and noreferrer for security.
   * 
   * @param article - The article data containing the link
   * 
   * @since 1.0.0
   */
  const handleBookClick = (article: Article) => {
    playClickSound();
    window.open(article.link, '_blank', 'noopener noreferrer');
  };

  if (loading) {
    // Generate skeleton books for visual consistency
    const skeletonRows = Array.from({ length: 3 }, (_, rowIndex) => (
      <div key={`skeleton-row-${rowIndex}`} className={styles.bookshelf}>
        <div className={styles.booksRow}>
          {Array.from({ length: booksPerRow() }, (_, bookIndex) => (
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

  const bookRows = groupBooksIntoRows(filteredArticles);

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
                    const globalIndex = rowIndex * booksPerRow() + bookIndex;
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