'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useEventListener } from '@/hooks';
import { useAudioManager } from '@/hooks/useAudioManager';
import type { ConceptSource } from '@/data/concepts';
import { buildBacklinkIndex, ConceptBacklink } from '@/utils/conceptGraph';
import ConceptPopover from './ConceptPopover';

const POPOVER_WIDTH = 320;
const POPOVER_EST_HEIGHT = 280;
const POPOVER_GAP = 8;
const VIEWPORT_MARGIN = 12;

interface PopoverState {
  conceptId: string;
  top: number;
  left: number;
  placement: 'below' | 'above';
}

interface ConceptGraphContextValue {
  activeConceptId: string | null;
  openConcept: (conceptId: string, anchor: HTMLElement) => void;
  closeConcept: () => void;
  /** Switch the open popover to another concept in place. */
  showConcept: (conceptId: string) => void;
  getBacklinks: (conceptId: string) => ConceptBacklink[];
}

const ConceptGraphContext = createContext<ConceptGraphContextValue | null>(null);

export function useConceptGraph(): ConceptGraphContextValue {
  const context = useContext(ConceptGraphContext);
  if (!context) {
    throw new Error('useConceptGraph must be used within a ConceptGraphProvider');
  }
  return context;
}

interface ConceptGraphProviderProps {
  /** Content blocks scanned for mentions to derive the backlink index. */
  sources: ConceptSource[];
  children: React.ReactNode;
}

const ConceptGraphProvider: React.FC<ConceptGraphProviderProps> = ({
  sources,
  children,
}) => {
  const { playSound } = useAudioManager();
  const [popover, setPopover] = useState<PopoverState | null>(null);

  const backlinkIndex = useMemo(() => buildBacklinkIndex(sources), [sources]);

  const getBacklinks = useCallback(
    (conceptId: string) => backlinkIndex.get(conceptId) ?? [],
    [backlinkIndex],
  );

  const openConcept = useCallback(
    (conceptId: string, anchor: HTMLElement) => {
      const rect = anchor.getBoundingClientRect();
      const placement: PopoverState['placement'] =
        rect.bottom + POPOVER_GAP + POPOVER_EST_HEIGHT > window.innerHeight &&
        rect.top > POPOVER_EST_HEIGHT
          ? 'above'
          : 'below';
      const left = Math.min(
        Math.max(rect.left, VIEWPORT_MARGIN),
        Math.max(window.innerWidth - POPOVER_WIDTH - VIEWPORT_MARGIN, VIEWPORT_MARGIN),
      );
      const top =
        placement === 'below' ? rect.bottom + POPOVER_GAP : rect.top - POPOVER_GAP;
      playSound('unfold');
      setPopover({ conceptId, top, left, placement });
    },
    [playSound],
  );

  const closeConcept = useCallback(() => {
    if (popover) {
      playSound('back');
      setPopover(null);
    }
  }, [popover, playSound]);

  const showConcept = useCallback(
    (conceptId: string) => {
      playSound('click');
      setPopover((current) => (current ? { ...current, conceptId } : current));
    },
    [playSound],
  );

  const doc = typeof document !== 'undefined' ? document : null;
  const win = typeof window !== 'undefined' ? window : null;

  useEventListener(popover ? doc : null, 'pointerdown', (event) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-concept-ui]')) return;
    closeConcept();
  });

  useEventListener(popover ? doc : null, 'keydown', (event) => {
    if (event.key === 'Escape') closeConcept();
  });

  useEventListener(popover ? win : null, 'resize', closeConcept);
  useEventListener(popover ? win : null, 'scroll', closeConcept, true);

  const value = useMemo<ConceptGraphContextValue>(
    () => ({
      activeConceptId: popover?.conceptId ?? null,
      openConcept,
      closeConcept,
      showConcept,
      getBacklinks,
    }),
    [popover, openConcept, closeConcept, showConcept, getBacklinks],
  );

  return (
    <ConceptGraphContext.Provider value={value}>
      {children}
      {popover && (
        <ConceptPopover
          conceptId={popover.conceptId}
          top={popover.top}
          left={popover.left}
          placement={popover.placement}
          backlinks={getBacklinks(popover.conceptId)}
          onShowConcept={showConcept}
          onClose={closeConcept}
        />
      )}
    </ConceptGraphContext.Provider>
  );
};

export default ConceptGraphProvider;
