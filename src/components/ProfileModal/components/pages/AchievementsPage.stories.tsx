import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import AchievementsPage from './AchievementsPage';
import StoryProviders from '../../../Providers/StoryProviders';

const meta: Meta<typeof AchievementsPage> = {
  title: 'Xbox Components/AchievementsPage',
  component: AchievementsPage,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Xbox 360-style achievements list rendered from the shared catalog. Locked tiles are dimmed; secret achievements stay masked until unlocked. State comes from the local achievement engine (localStorage) — unlock a few via the running app or /toast-demo to see earned tiles.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <StoryProviders>
        <div style={{ maxWidth: 560, background: 'var(--color-bg-overlay)' }}>
          <Story />
        </div>
      </StoryProviders>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default: reflects whatever progress exists in this browser's localStorage.
 * A fresh profile shows every tile locked and the two secrets masked.
 */
export const Default: Story = {};
