import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ProfileModal } from './ProfileModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { VolumeProvider } from '../../context/VolumeContext';
import { trpc } from '../../utils/trpc';

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
});

const meta: Meta<typeof ProfileModal> = {
  title: 'Xbox Components/ProfileModal',
  component: ProfileModal,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <VolumeProvider>
            <Story />
          </VolumeProvider>
        </QueryClientProvider>
      </trpc.Provider>
    ),
  ],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls the visibility of the modal.',
    },
    onClose: {
      action: 'closed',
      description: 'Function to call when the modal should be closed.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
  },
};
