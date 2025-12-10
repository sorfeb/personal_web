'use client';

import React, { useState, ReactNode } from 'react';
import styles from './ComponentShowcase.module.css';

export interface ShowcaseSection {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

interface ComponentShowcaseProps {
  name: string;
  description: string;
  demo: ReactNode;
  controls?: ReactNode;
  sections?: ShowcaseSection[];
  className?: string;
}

/**
 * ComponentShowcase - Container for component documentation
 * Displays live demo, interactive controls, and collapsible documentation sections
 */
export default function ComponentShowcase({
  name,
  description,
  demo,
  controls,
  sections = [],
  className = '',
}: ComponentShowcaseProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(sections.filter((s) => s.defaultOpen).map((s) => s.title))
  );

  const toggleSection = (title: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  return (
    <div className={`${styles.showcase} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.description}>{description}</p>
      </div>

      {/* Live Demo */}
      <div className={styles.demoContainer}>
        <h4 className={styles.sectionLabel}>Live Demo</h4>
        <div className={styles.demoArea}>{demo}</div>
      </div>

      {/* Interactive Controls */}
      {controls && (
        <div className={styles.controlsContainer}>
          <h4 className={styles.sectionLabel}>Interactive Controls</h4>
          <div className={styles.controlsArea}>{controls}</div>
        </div>
      )}

      {/* Collapsible Documentation Sections */}
      {sections.length > 0 && (
        <div className={styles.sectionsContainer}>
          {sections.map((section) => {
            const isOpen = openSections.has(section.title);
            return (
              <div key={section.title} className={styles.section}>
                <button
                  className={styles.sectionHeader}
                  onClick={() => toggleSection(section.title)}
                  type="button"
                >
                  <span className={styles.sectionTitle}>{section.title}</span>
                  <span className={`${styles.sectionIcon} ${isOpen ? styles.open : ''}`}>
                    ▼
                  </span>
                </button>
                {isOpen && <div className={styles.sectionContent}>{section.children}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
