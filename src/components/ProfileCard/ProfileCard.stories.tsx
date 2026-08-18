import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ProfileCard } from './ProfileCard';
import StoryProviders from '../Providers/StoryProviders';

const meta: Meta<typeof ProfileCard> = {
  title: 'Xbox Components/ProfileCard',
  component: ProfileCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An Xbox-themed profile card that displays authenticated user information with interactive sound effects and gamerscore display. Automatically fetches user data via tRPC with guest mode fallback.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <StoryProviders>
        <Story />
      </StoryProviders>
    ),
  ],
  argTypes: {
    name: {
      description: 'Override the display name (for testing/demo purposes)',
      control: 'text',
    },
    gamerscore: {
      description: 'Override the gamerscore (for testing/demo purposes)',
      control: 'number',
    },
    avatar: {
      description: 'Override the avatar filename (for testing/demo purposes)',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default story - shows the actual tRPC data fetch
 * Will display "Guest" mode if no authentication
 */
export const Default: Story = {
  args: {},
};

/**
 * Demo story with override props showing authenticated user
 */
export const AuthenticatedUser: Story = {
  args: {
    name: 'Soros',
    gamerscore: 12500,
    avatar: '2000c.png',
  },
};

/**
 * High score user demonstration
 */
export const HighScore: Story = {
  args: {
    name: 'Xbox Legend',
    gamerscore: 999999,
    avatar: '20001.png',
  },
};

/**
 * New user with minimal gamerscore
 */
export const NewUser: Story = {
  args: {
    name: 'Rookie',
    gamerscore: 0,
    avatar: '20002.png',
  },
};

/**
 * Guest mode demonstration (explicitly shown)
 */
export const GuestMode: Story = {
  args: {
    name: 'Guest',
    gamerscore: 0,
    avatar: 'guest_gamerpic.svg',
  },
};