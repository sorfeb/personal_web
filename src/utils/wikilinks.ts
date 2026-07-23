/**
 * Wikilink parsing for concept mentions inside plain strings.
 * Syntax: `[[concept-id]]` or `[[concept-id|display text]]`.
 */

export interface WikilinkTextSegment {
  kind: 'text';
  text: string;
}

export interface WikilinkMentionSegment {
  kind: 'mention';
  conceptId: string;
  display?: string;
}

export type WikilinkSegment = WikilinkTextSegment | WikilinkMentionSegment;

const WIKILINK_PATTERN = /\[\[([^[\]|]+)(?:\|([^[\]]+))?\]\]/g;

export function parseWikilinks(text: string): WikilinkSegment[] {
  const segments: WikilinkSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(WIKILINK_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ kind: 'text', text: text.slice(lastIndex, index) });
    }
    segments.push({
      kind: 'mention',
      conceptId: match[1].trim(),
      display: match[2]?.trim(),
    });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ kind: 'text', text: text.slice(lastIndex) });
  }

  return segments;
}

export function extractConceptIds(text: string): string[] {
  return parseWikilinks(text)
    .filter((segment): segment is WikilinkMentionSegment => segment.kind === 'mention')
    .map((segment) => segment.conceptId);
}
