'use client';

import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import { BookRack } from '../../components/BookRack/BookRack';

interface Article {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  coverImage: string | null;
}

const BlogPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  return (
    <PageLayout 
      title="Blog" 
      size="wide"           // Optimized for BookRack content
      variant="fullscreen"  // Remove window constraints
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