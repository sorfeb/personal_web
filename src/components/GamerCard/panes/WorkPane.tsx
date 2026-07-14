'use client';

import React, { memo } from 'react';
import { FolderGit2 } from 'lucide-react';
import { projects } from '../../../data/card';
import styles from './panes.module.css';

const WorkPane = memo(() => {
  return (
    <div className={styles.pane}>
      <div className={styles.paneHeader}>
        <FolderGit2 className={styles.paneHeaderIcon} size={20} strokeWidth={1.5} />
        <h2 className={styles.paneTitle}>Selected Work</h2>
      </div>

      <ul className={styles.workList}>
        {projects.map((project) => (
          <li key={project.name} className={styles.workItem}>
            <div className={styles.workHeading}>
              <h3 className={styles.workName}>{project.name}</h3>
              <span className={styles.workStack}>{project.stack}</span>
            </div>
            <p className={styles.workDescription}>{project.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
});

WorkPane.displayName = 'WorkPane';

export default WorkPane;
