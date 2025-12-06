'use client';

import React from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import { BookRack } from '../../components/Books/BookRack/BookRack';
import { trpc } from '../../utils/trpc';
import styles from './Blog.module.css';

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
 * @since 1.0.0
 * @author Soros Febriano
 * 
 * @see {@link BookRack} - The main bookshelf component
 * @see {@link PageLayout} - Layout wrapper component
 * @see {@link trpc.blog.getMediumFeed} - tRPC endpoint for fetching articles
 */
const BlogPage = () => {
  /**
   * Fetch Medium articles using tRPC
   * 
   * @description
   * Uses tRPC's useQuery hook to fetch Medium RSS feed data.
   * Automatically handles loading states, error states, and data caching.
   * Provides type-safe API calls with auto-completion support.
   * 
   * @since 2.0.0
   */
  const { data: articles = [], isLoading, error, refetch } = trpc.blog.getMediumFeed.useQuery();

  // Error state with retry functionality
  if (error) {
    return (
      <PageLayout 
        title="Blog" 
        size="wide"
        variant="windowed"
      >
        <PageLayout.Header />
        <PageLayout.CloseButton />
        <PageLayout.Body>
          <div className={styles.errorContainer}>
            <h2>📚 Oops! Something went wrong</h2>
            <p>{error.message}</p>
            <button 
              onClick={() => refetch()}
              className={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        </PageLayout.Body>
      </PageLayout>
    );
  }

  // Main render with BookRack component
  return (
    <PageLayout 
      title="Blog" 
      variant="windowed"
    >
      <PageLayout.Header />
      <PageLayout.CloseButton />
      <PageLayout.Body>
        <BookRack 
          articles={articles as Article[]}
          loading={isLoading}
          showSearch={true}
        />
      </PageLayout.Body>
    </PageLayout>
  );
};

export default BlogPage;