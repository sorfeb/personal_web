import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ProfileModal } from './ProfileModal';
import StoryProviders from '../Providers/StoryProviders';

const meta: Meta<typeof ProfileModal> = {
  title: 'Xbox Components/ProfileModal',
  component: ProfileModal,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <StoryProviders>
        <Story />
      </StoryProviders>
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
