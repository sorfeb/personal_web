import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ProfileCard } from './ProfileCard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';

// Import the actual providers
import { VolumeProvider } from '../../context/VolumeContext';
import { ToastProvider } from '../../context/ToastContext';
import { AchievementProvider } from '../../context/AchievementContext';
import { trpc } from '../../utils/trpc';

// Create a query client for Storybook
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});

// Create a tRPC client for Storybook
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
});

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
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <VolumeProvider>
            <ToastProvider>
              <AchievementProvider>
                <Story />
              </AchievementProvider>
            </ToastProvider>
          </VolumeProvider>
        </QueryClientProvider>
      </trpc.Provider>
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