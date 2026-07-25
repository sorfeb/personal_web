'use client';

import React from 'react';
import { useAudioManager } from '@/hooks/useAudioManager';
import { getConcept } from '@/data/concepts';
import type { ConceptBacklink } from '@/utils/conceptGraph';
import styles from './ConceptPopover.module.css';

interface ConceptPopoverProps {
  conceptId: string;
  top: number;
  left: number;
  placement: 'below' | 'above';
  backlinks: ConceptBacklink[];
  onShowConcept: (conceptId: string) => void;
  onClose: () => void;
}

function formatTag(tag: string): string {
  return tag.replace(/-/g, ' ');
}

const ConceptPopover: React.FC<ConceptPopoverProps> = ({
  conceptId,
  top,
  left,
  placement,
  backlinks,
  onShowConcept,
  onClose,
}) => {
  const { playSound } = useAudioManager();
  const concept = getConcept(conceptId);

  if (!concept) return null;

  const meta = [concept.type, ...(concept.tags ?? []).map(formatTag)].join(' · ');
  let resourceHost: string | null = null;
  if (concept.resource) {
    try {
      resourceHost = new URL(concept.resource).hostname;
    } catch {
      resourceHost = concept.resource;
    }
  }

  return (
    <div
      className={`${styles.popover} ${placement === 'above' ? styles.above : ''}`}
      style={{ '--popover-top': `${top}px`, '--popover-left': `${left}px` } as React.CSSProperties}
      role="dialog"
      aria-label={concept.title}
      data-concept-ui
      tabIndex={-1}
      ref={(element) => element?.focus({ preventScroll: true })}
    >
      <div className={styles.header}>
        <span className={styles.meta}>{meta}</span>
        <button
          type="button"
          className={styles.close}
          aria-label="Close"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <h3 className={styles.title}>{concept.title}</h3>

      {concept.description && (
        <p className={styles.description}>{concept.description}</p>
      )}

      {concept.rationale && (
        <p className={styles.rationale}>{concept.rationale}</p>
      )}

      {concept.resource && (
        <a
          className={styles.resource}
          href={concept.resource}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playSound('click')}
        >
          {resourceHost}
          <span className={styles.resourceArrow} aria-hidden="true">↗</span>
        </a>
      )}

      {backlinks.length > 0 && (
        <div className={styles.backlinks}>
          <span className={styles.backlinksLabel}>also in</span>
          <ul className={styles.backlinkList}>
            {backlinks.map((backlink) => {
              const about = backlink.aboutConceptId
                ? getConcept(backlink.aboutConceptId)
                : undefined;
              return (
                <li key={backlink.sourceId}>
                  {about ? (
                    <button
                      type="button"
                      className={styles.backlinkButton}
                      onMouseEnter={() => playSound('hover')}
                      onClick={() => onShowConcept(about.id)}
                    >
                      {about.title}
                    </button>
                  ) : (
                    <span className={styles.backlinkText}>{backlink.sourceLabel}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ConceptPopover;
