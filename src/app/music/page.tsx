'use client';

import React from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import certifications from '../../data/certifications.json';
import styles from './Music.module.css';

const MusicPage = () => {
  return (
    <PageLayout title="Music">
      <PageLayout.Header />
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

export default MusicPage;