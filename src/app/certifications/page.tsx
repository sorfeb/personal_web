'use client';

import React from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import certifications from '../../data/certifications.json';
import styles from './page.module.css';

const CertificationsPage = () => {
  return (
    <PageLayout title="Certifications">
      <div className={styles.container}>
        <div className={styles.grid}>
          {certifications.map((cert, index) => (
            <div key={index} className={styles.card}>
              <h3>{cert.name}</h3>
              <p><strong>Issuer:</strong> {cert.issuer}</p>
              <p><strong>Issued:</strong> {cert.issued_date}</p>
              {cert.expiry_date && <p><strong>Expiry:</strong> {cert.expiry_date}</p>}
              <p><a href={cert.url} target="_blank" rel="noopener noreferrer">View Credential</a></p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default CertificationsPage;