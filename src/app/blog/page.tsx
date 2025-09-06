'use client';

import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import { BookRack } from '../../components/Books/BookRack/BookRack';

/**
 * Article data structure for Medium blog posts
 * 
 * @interface Article
 * @since 1.0.0
 */
interface Article {
  /** The title of the Medium article */
  title: string;
  /** Direct link to the Medium article */
  link: string;
  /** Publication date in ISO string format */
  pubDate: string;
  /** Brief excerpt of the article content */
  contentSnippet: string;
  /** Cover image URL extracted from article, null if no image */
  coverImage: string | null;
}

/**
 * BlogPage component - Displays Medium articles in a 3D bookshelf interface
 * 
 * @description
 * A client-side component that fetches Medium RSS feed data and presents articles
 * as interactive 3D books on a wooden bookshelf. Provides an immersive reading
 * experience with search functionality and visual feedback.
 * 
 * **Key Features:**
 * - **Real-time Data Fetching**: Loads latest Medium articles via API
 * - **3D Book Visualization**: Each article appears as a physical book
 * - **Search & Filter**: Real-time article filtering capabilities
 * - **Loading States**: Skeleton books during data fetching
 * - **Error Handling**: Graceful error display with retry functionality
 * - **Responsive Design**: Adapts to different screen sizes
 * 
 * **Component Lifecycle:**
 * 1. Mount with loading state active
 * 2. Fetch articles from Medium RSS API
 * 3. Display either articles, loading skeletons, or error state
 * 4. Handle user interactions (search, book clicks)
 * 
 * **Error Recovery:**
 * The component provides a user-friendly error state with a retry button
 * that reloads the entire page, allowing users to recover from API failures.
 * 
 * @example
 * ```tsx
 * // The component is automatically rendered at /blog route
 * // No props needed as it manages its own state
 * 
 * // Usage in routing:
 * // app/blog/page.tsx exports this component as default
 * ```
 * 
 * @returns JSX element representing the blog page with bookshelf interface
 * 
 * @since 1.0.0
 * @author Soros Febriano
 * 
 * @see {@link BookRack} - The main bookshelf component
 * @see {@link PageLayout} - Layout wrapper component
 * @see {@link /api/medium-feed} - Backend API endpoint for fetching articles
 */
const BlogPage = () => {
  /** State for storing fetched Medium articles */
  const [articles, setArticles] = useState<Article[]>([]);
  
  /** Loading state for showing skeleton books during fetch */
  const [loading, setLoading] = useState(true);
  
  /** Error state for displaying fetch failures */
  const [error, setError] = useState<string | null>(null);

  /**
   * Effect hook for fetching Medium articles on component mount
   * 
   * @description
   * Initiates the article fetching process when the component mounts.
   * Handles loading states, error states, and successful data retrieval.
   * 
   * @since 1.0.0
   */
  useEffect(() => {
    /**
     * Fetches articles from the Medium RSS feed API
     * 
     * @description
     * Makes an API call to the local Medium feed endpoint, which proxies
     * and processes the Medium RSS feed. Handles all three possible states:
     * loading, success, and error.
     * 
     * **Error Handling:**
     * - Network errors
     * - API response errors (non-200 status)
     * - JSON parsing errors
     * - Unknown errors (with fallback message)
     * 
     * @async
     * @throws {Error} When fetch fails or response is not ok
     * @since 1.0.0
     */
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/medium-feed');
        if (!res.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Error state with retry functionality
  if (error) {
    return (
      <PageLayout 
        title="Blog" 
        size = "wide"
        variant="windowed"
      >
        <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
          <h2>📚 Oops! Something went wrong</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              marginTop: '10px',
              backgroundColor: '#8B4513',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </PageLayout>
    );
  }

  // Main render with BookRack component
  return (
    <PageLayout 
      title="Blog" 
      variant="windowed"
      showCloseButton={true}
      
    >
      <BookRack 
        articles={articles}
        loading={loading}
        showSearch={true}
      />
    </PageLayout>
  );
};

export default BlogPage;