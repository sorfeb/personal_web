import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import XboxCard from './XboxCard';

// Import the actual providers
import { VolumeProvider } from '../../../context/VolumeContext';

/**
 * XboxCard component displays interactive cards with hover effects,
 * mouse tracking, and optional image slideshows.
 */
const meta: Meta<typeof XboxCard> = {
  title: 'Xbox Components/XboxCard',
  component: XboxCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An interactive Xbox-themed card component with mouse tracking effects, hover sounds, and support for icon or image slideshow display.',
      },
    },
  },
  tags: ['autodocs'],  decorators: [
    (Story) => (
      <VolumeProvider>
        <div style={{ width: '300px', height: '200px' }}>
          <Story />
        </div>
      </VolumeProvider>
    ),
  ],
  argTypes: {
    title: {
      description: 'The title displayed on the card',
      control: 'text',
    },
    iconUrl: {
      description: 'URL of the icon to display (used when no images provided)',
      control: 'text',
    },
    route: {
      description: 'The route to navigate to when card is clicked',
      control: 'text',
    },
    images: {
      description: 'Array of image URLs for slideshow (optional)',
      control: 'object',
    },
    variant: {
      description: '`icon` centres an icon above the title; `game` fills the card with cover art and drops the title to the bottom edge',
      control: 'radio',
      options: ['icon', 'game'],
    },
    artUrl: {
      description: 'Cover art for the `game` variant. Missing art falls back to a flat brand panel, never to an icon',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Card with icon display
 */
export const WithIcon: Story = {
  args: {
    title: 'Dashboard',
    iconUrl: '/assets/icons/dashboard/dashboard.svg',
    route: '/dashboard',
  },
};

/**
 * Card with image slideshow
 */
export const WithImages: Story = {
  args: {
    title: 'Gallery',
    route: '/gallery',
    images: [
      '/assets/images/sample1.jpg',
      '/assets/images/sample2.jpg',
      '/assets/images/sample3.jpg',
    ],
  },
};

/**
 * Game variant: cover art fills the card and the title anchors to the bottom
 * edge over a scrim that is opaque at the bottom and clear by the top.
 */
export const GameWithArt: Story = {
  args: {
    title: 'DOOM',
    variant: 'game',
    artUrl: '/assets/games/art/doom.jpg',
    route: '/games/doom',
  },
};

/**
 * Game variant with no art on disk — the flat brand placeholder, with the title
 * still bottom-aligned. This is what every game card looks like before art lands,
 * and what a 404 degrades to.
 */
export const GameWithoutArt: Story = {
  args: {
    title: 'Commander Keen',
    variant: 'game',
    route: '/games/keen',
  },
};

/**
 * Card with long title to test text wrapping
 */
export const WithLongTitle: Story = {
  args: {
    title: 'This is a Very Long Title That Should Wrap',
    iconUrl: '/assets/icons/pages/about.svg',
    route: '/about',
  },
};

/**
 * Card without route (non-clickable)
 */
export const NonClickable: Story = {
  args: {
    title: 'Static Card',
    iconUrl: '/assets/icons/pages/info.svg',
    route: '',
  },
};
