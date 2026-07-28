'use client';

import React, { useState } from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import { useAudioManager } from '@/hooks/useAudioManager';
import type { ChangelogRelease } from '@/utils/changelog';
import styles from './Changelog.module.css';

interface ChangelogViewProps {
  releases: ChangelogRelease[];
  currentVersion: string;
}

const ChangelogView = ({ releases, currentVersion }: ChangelogViewProps) => {
  const { playSound } = useAudioManager();
  const [expandedVersion, setExpandedVersion] = useState<string | null>(
    releases[0]?.version ?? null,
  );

  const toggleRelease = (version: string) => {
    playSound('panel');
    setExpandedVersion((current) => (current === version ? null : version));
  };

  return (
    <PageLayout title="System Update">
      <PageLayout.Header />
      <PageLayout.Body>
        <div className={styles.container}>
          <div className={styles.updateDialog}>
            <div className={styles.dialogAccent} />
            <div className={styles.dialogHeader}>
              <h2 className={styles.dialogTitle}>System Update</h2>
              <p className={styles.dialogSubtitle}>
                Dashboard version <span className={styles.version}>{currentVersion}</span>
              </p>
            </div>

            {releases.length === 0 ? (
              <p className={styles.emptyState}>
                No update history found. Your console software is up to date.
              </p>
            ) : (
              <ul className={styles.releaseList}>
                {releases.map((release) => {
                  const isExpanded = expandedVersion === release.version;
                  return (
                    <li key={release.version} className={styles.release}>
                      <button
                        type="button"
                        className={`${styles.releaseHeader} ${isExpanded ? styles.releaseHeaderActive : ''}`}
                        onClick={() => toggleRelease(release.version)}
                        onMouseEnter={() => playSound('hover')}
                        aria-expanded={isExpanded}
                      >
                        <span className={styles.releaseVersion}>v{release.version}</span>
                        {release.date && (
                          <span className={styles.releaseDate}>{release.date}</span>
                        )}
                        <span className={styles.releaseChevron} aria-hidden>
                          {isExpanded ? '▾' : '▸'}
                        </span>
                      </button>

                      {isExpanded && (
                        <div className={styles.releaseBody}>
                          {release.sections.map((section) => (
                            <div key={section.title} className={styles.section}>
                              <h3 className={styles.sectionTitle}>{section.title}</h3>
                              <ul className={styles.itemList}>
                                {section.items.map((item, index) => (
                                  <li key={index} className={styles.item}>
                                    {item.scope && (
                                      <span className={styles.itemScope}>{item.scope}</span>
                                    )}
                                    <span className={styles.itemText}>{item.text}</span>
                                    {item.commitUrl && (
                                      <a
                                        className={styles.itemCommit}
                                        href={item.commitUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => playSound('click')}
                                        onMouseEnter={() => playSound('hover')}
                                      >
                                        {item.commitHash}
                                      </a>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                          {release.compareUrl && (
                            <a
                              className={styles.compareLink}
                              href={release.compareUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => playSound('click')}
                              onMouseEnter={() => playSound('hover')}
                            >
                              Full diff on GitHub
                            </a>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </PageLayout.Body>
    </PageLayout>
  );
};

export default ChangelogView;
