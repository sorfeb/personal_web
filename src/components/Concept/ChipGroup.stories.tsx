import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ChipGroup from './ChipGroup';
import ConceptGraphProvider from './ConceptGraphProvider';
import { VolumeProvider } from '../../context/VolumeContext';
import {
  CARD_COLOPHON,
  CARD_CONCEPT_SOURCES,
  CARD_INSPIRATIONS,
} from '../../data/concepts';

/**
 * ChipGroup renders concept chips — standalone mentions with contextual
 * display text (version ranges, harness pairings) that stays out of the
 * concept registry.
 */
const meta: Meta<typeof ChipGroup> = {
  title: 'Concept Graph/ChipGroup',
  component: ChipGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Chips whose label and note both support [[wikilink]] mentions; free text (e.g. "GLM 4.6 → 5.1") is display-only context.',
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
              width: '460px',
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

export const Colophon: Story = {
  args: {
    chips: CARD_COLOPHON.chips,
  },
};

export const Inspirations: Story = {
  args: {
    chips: CARD_INSPIRATIONS.chips,
  },
};
