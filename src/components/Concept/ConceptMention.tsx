'use client';

import React, { memo } from 'react';
import { useAudioManager } from '@/hooks/useAudioManager';
import { getConcept } from '@/data/concepts';
import { useConceptGraph } from './ConceptGraphProvider';
import styles from './ConceptMention.module.css';

interface ConceptMentionProps {
  conceptId: string;
  /** Display override from `[[id|display]]`; falls back to the concept title. */
  display?: string;
}

const ConceptMention = memo<ConceptMentionProps>(({ conceptId, display }) => {
  const { playSound } = useAudioManager();
  const { activeConceptId, openConcept, closeConcept } = useConceptGraph();

  const concept = getConcept(conceptId);
  if (!concept) {
    return <>{display ?? conceptId}</>;
  }

  const active = activeConceptId === conceptId;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (active) {
      closeConcept();
    } else {
      openConcept(conceptId, event.currentTarget);
    }
  };

  return (
    <button
      type="button"
      className={`${styles.mention} ${active ? styles.active : ''}`}
      aria-expanded={active}
      data-concept-ui
      onMouseEnter={() => playSound('hover')}
      onClick={handleClick}
    >
      {display ?? concept.title}
    </button>
  );
});

ConceptMention.displayName = 'ConceptMention';

export default ConceptMention;
