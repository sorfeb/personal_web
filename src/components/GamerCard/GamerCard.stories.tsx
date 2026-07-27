import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import GamerCard from './GamerCard';
import { VolumeProvider } from '../../context/VolumeContext';
import { ToastProvider } from '../../context/ToastContext';
import ToastContainer from '../ToastNotification/ToastContainer';

const meta: Meta<typeof GamerCard> = {
  title: 'Xbox Components/GamerCard',
  component: GamerCard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Xbox 360 blades-era Profile screen reimagined as a business card: menu-driven two-column layout on desktop, vertically scrollable column with a bottom tab bar on mobile. Content comes from src/data/card.ts; Save Contact downloads a client-generated vCard.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <VolumeProvider>
        <ToastProvider>
          <Story />
          <ToastContainer />
        </ToastProvider>
      </VolumeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Full Profile screen. Resize the viewport below 768px to see the
 * mobile column with the bottom tab bar.
 */
export const Default: Story = {};

/**
 * Mobile viewport preset — vertically scrollable with bottom tabs.
 */
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
