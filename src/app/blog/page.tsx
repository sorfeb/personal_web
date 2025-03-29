import React from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import styles from './page.module.css';

interface Article {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  coverImage: string | null;
}

async function fetchArticles(): Promise<Article[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medium-feed`, {
    next: { revalidate: 120 },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch articles');
  }
  return res.json();
}

const BlogPage = async () => {
  const articles = await fetchArticles();

  return (
    <PageLayout title="Blog">
      <div className={styles.container}>
        {articles.map((article, index) => (
          <div key={index} className={styles.articleCard}>
            <h3>{article.title}</h3>
            {article.coverImage && (
              <img
                src={article.coverImage}
                alt={article.title}
                className={styles.coverImage}
              />
            )}
            <p>{article.contentSnippet}</p>
            <p><small>{new Date(article.pubDate).toLocaleDateString()}</small></p>
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              Read More
            </a>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default BlogPage;