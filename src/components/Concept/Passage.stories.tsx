import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Passage from './Passage';
import ConceptGraphProvider from './ConceptGraphProvider';
import { VolumeProvider } from '../../context/VolumeContext';
import { CARD_CONCEPT_SOURCES, CARD_INTERESTS } from '../../data/concepts';

/**
 * Passage renders prose whose `[[wikilink]]` mentions become tappable
 * concept links. Tapping a mention opens the shared concept popover with
 * status, description, outbound link, and derived backlinks.
 */
const meta: Meta<typeof Passage> = {
  title: 'Concept Graph/Passage',
  component: Passage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Prose with live concept mentions. Wrap consumers in ConceptGraphProvider so mentions share one popover and backlink index.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <VolumeProvider>
        <ConceptGraphProvider sources={CARD_CONCEPT_SOURCES}>
          <div
            style={{
              width: '420px',
              padding: '2rem',
              background: 'hsl(0 0% 4%)',
              color: 'hsl(0 0% 90%)',
            }}
          >
            <Story />
          </div>
        </ConceptGraphProvider>
      </VolumeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CurrentInterests: Story = {
  args: {
    section: CARD_INTERESTS,
  },
};

export const UnknownConceptFallback: Story = {
  args: {
    section: {
      id: 'story/unknown',
      label: 'unknown mention',
      text: 'Mentions of [[not/registered|unregistered concepts]] render as plain text.',
    },
  },
};
