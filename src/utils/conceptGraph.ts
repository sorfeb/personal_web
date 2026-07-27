/**
 * Backlink index derivation — the graph's edges are mention-derived,
 * Wikipedia-style: forward links are authored in text, backlinks computed.
 */

import type { ConceptSource } from '../data/concepts';
import { extractConceptIds } from './wikilinks';

export interface ConceptBacklink {
  sourceId: string;
  sourceLabel: string;
  /** When the source is about a concept, backlinks point at that concept. */
  aboutConceptId?: string;
}

export function buildBacklinkIndex(
  sources: ConceptSource[],
): Map<string, ConceptBacklink[]> {
  const index = new Map<string, ConceptBacklink[]>();

  for (const source of sources) {
    const mentioned = new Set(source.texts.flatMap(extractConceptIds));
    for (const conceptId of mentioned) {
      if (conceptId === source.about) continue;
      const backlinks = index.get(conceptId) ?? [];
      backlinks.push({
        sourceId: source.id,
        sourceLabel: source.label,
        aboutConceptId: source.about,
      });
      index.set(conceptId, backlinks);
    }
  }

  return index;
}
