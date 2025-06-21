import React, { useState } from 'react';
import styles from './BookRack.module.css';
import { useVolume } from '../../context/VolumeContext';
import { Book } from './Book';
import { BookSkeleton } from './Book/BookSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Article data structure matching Medium RSS feed
 */
export interface Article {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  coverImage: string | null;
}

/**
 * BookRack component props
 */
export interface BookRackProps {
  /** Array of articles to display as books */
  articles: Article[];
  /** Whether to show search functionality */
  showSearch?: boolean;
  /** Loading state */
  loading?: boolean;
}

/**
 * BookRack component for displaying Medium articles as books
 * with skeumorphic wooden bookshelf styling
 */
export const BookRack: React.FC<BookRackProps> = ({
  articles,
  showSearch = true,
  loading = false,
}) => {
  const { volume } = useVolume();
  const [searchTerm, setSearchTerm] = useState('');

  const playHoverSound = () => {
    const audio = new Audio('/assets/audio/ps2_owawa.wav');
    audio.volume = volume;
    audio.play().catch(() => console.log('Audio failed'));
  };

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

  // Generate book cover colors based on title
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

  const handleBookClick = (article: Article) => {
    playClickSound();
    window.open(article.link, '_blank', 'noopener noreferrer');
  };  if (loading) {
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

  // Group books into rows for responsive layout
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

  const groupBooksIntoRows = (books: Article[]) => {
    const perRow = booksPerRow();
    const rows = [];
    for (let i = 0; i < books.length; i += perRow) {
      rows.push(books.slice(i, i + perRow));
    }
    return rows;
  };

  const bookRows = groupBooksIntoRows(filteredArticles);  return (
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
                <p>📚 No articles found</p>
                <small>Try adjusting your search terms</small>
              </div>
            </div>
          </div>        ) : (
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