'use client';

import React, { memo } from 'react';
import { Award, GraduationCap, Wrench } from 'lucide-react';
import { credentials, education, skillGroups } from '../../../data/card';
import styles from './panes.module.css';

const SkillsPane = memo(() => {
  return (
    <div className={styles.pane}>
      <div className={styles.paneHeader}>
        <Wrench className={styles.paneHeaderIcon} size={20} strokeWidth={1.5} />
        <h2 className={styles.paneTitle}>Skills &amp; Certs</h2>
      </div>

      <div className={styles.skillGroups}>
        {skillGroups.map((group) => (
          <div key={group.label} className={styles.skillGroup}>
            <h3 className={styles.skillGroupLabel}>{group.label}</h3>
            <ul className={styles.chips}>
              {group.items.map((item) => (
                <li key={item} className={styles.chip}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className={styles.educationLine}>
        <GraduationCap size={16} strokeWidth={1.5} aria-hidden="true" />
        {education}
      </p>

      <ul className={styles.credGrid}>
        {credentials.map((credential) => (
          <li key={credential.title} className={styles.credTile}>
            <div className={styles.credIcon} aria-hidden="true">
              <Award size={22} strokeWidth={1.5} />
            </div>
            <span className={styles.credLabel}>
              {credential.title}
              <span className={styles.credIssuer}>{credential.issuer}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
});

SkillsPane.displayName = 'SkillsPane';

export default SkillsPane;
