'use client';

import React, { useMemo } from 'react';
import { parseWikilinks } from '@/utils/wikilinks';
import ConceptMention from './ConceptMention';

interface WikilinkTextProps {
  /** Text with `[[concept-id]]` / `[[concept-id|display]]` mentions. */
  text: string;
}

const WikilinkText: React.FC<WikilinkTextProps> = ({ text }) => {
  const segments = useMemo(() => parseWikilinks(text), [text]);

  return (
    <>
      {segments.map((segment, index) =>
        segment.kind === 'text' ? (
          <React.Fragment key={index}>{segment.text}</React.Fragment>
        ) : (
          <ConceptMention
            key={index}
            conceptId={segment.conceptId}
            display={segment.display}
          />
        ),
      )}
    </>
  );
};

export default WikilinkText;
