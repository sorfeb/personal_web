import React from 'react';
import { ROADMAP } from '@/data/roadmap';
import { ROADMAP_STATUS_LABELS, ROADMAP_STATUS_ORDER } from '@/types/roadmap';
import styles from '../About.module.css';

/**
 * What is being worked on, grouped by status.
 *
 * Issue keys render as plain chips rather than links: the Linear workspace is
 * private, so a link would send visitors to a login wall. The chip reads as a
 * title ID, which suits the console framing.
 */
const RoadmapPanel = () => {
  const groups = ROADMAP_STATUS_ORDER.map((status) => ({
    status,
    entries: ROADMAP.filter((entry) => entry.status === status),
  })).filter((group) => group.entries.length > 0);

  return (
    <div className={styles.roadmap}>
      {groups.map(({ status, entries }) => (
        <section key={status} className={styles.roadmapGroup}>
          <h3 className={styles.sectionHeading}>
            {ROADMAP_STATUS_LABELS[status]}
            <span className={styles.groupCount}>{entries.length}</span>
          </h3>

          <ul className={styles.roadmapList}>
            {entries.map((entry) => (
              <li key={entry.id} className={styles.roadmapItem} data-status={status}>
                <div className={styles.roadmapHead}>
                  <span className={styles.roadmapTitle}>{entry.title}</span>
                  {entry.issue && <span className={styles.issueChip}>{entry.issue}</span>}
                  {entry.shippedIn && <span className={styles.shippedChip}>{entry.shippedIn}</span>}
                  {entry.target && <span className={styles.targetChip}>{entry.target}</span>}
                </div>
                <p className={styles.roadmapBlurb}>{entry.blurb}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default RoadmapPanel;
