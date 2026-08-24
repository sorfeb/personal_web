import React from 'react';
import Link from 'next/link';
import type { SystemSummary } from '../AboutView';
import styles from '../About.module.css';

interface SystemPanelProps {
  system: SystemSummary;
}

/**
 * Console system-info panel: what this build is and what it is made of.
 *
 * It deliberately summarises rather than reproducing /changelog. That route
 * already renders the full release accordion and is linked from here; a
 * changelog rendered in two places diverges the first time one is edited.
 */
const SystemPanel = ({ system }: SystemPanelProps) => (
  <div className={styles.system}>
    <dl className={styles.specs}>
      <div className={styles.spec}>
        <dt className={styles.specLabel}>Dashboard version</dt>
        <dd className={styles.specValue}>{system.version}</dd>
      </div>
      {system.latestDate && (
        <div className={styles.spec}>
          <dt className={styles.specLabel}>Last updated</dt>
          <dd className={styles.specValue}>{system.latestDate}</dd>
        </div>
      )}
      <div className={styles.spec}>
        <dt className={styles.specLabel}>Releases</dt>
        <dd className={styles.specValue}>{system.releaseCount}</dd>
      </div>
    </dl>

    <h3 className={styles.sectionHeading}>Built with</h3>
    <ul className={styles.stack}>
      {system.stack.map((entry) => (
        <li key={entry.label} className={styles.stackRow}>
          <span className={styles.stackLabel}>{entry.label}</span>
          {entry.version && <span className={styles.stackVersion}>{entry.version}</span>}
          {entry.note && <span className={styles.stackNote}>{entry.note}</span>}
        </li>
      ))}
    </ul>

    <Link href="/changelog" className={styles.link}>
      View the full release history
    </Link>
  </div>
);

export default SystemPanel;
