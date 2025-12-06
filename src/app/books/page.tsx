'use client';

import React from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import certifications from '../../data/certifications.json';
import styles from './Books.module.css';

const BooksPage = () => {
  return (
    <PageLayout title="Books">
      <PageLayout.Header />
      <PageLayout.CloseButton />
      <PageLayout.Body>
        <div className={styles.loadingContainer}>
          <span className={styles.text}>Work In Progress</span>
            <div className={styles.dots}>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
            </div>
        </div>
      </PageLayout.Body>
    </PageLayout>
  );
};

export default BooksPage;