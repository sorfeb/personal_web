import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ProfileCard } from './ProfileCard';

// Import the actual providers
import { VolumeProvider } from '../../context/VolumeContext';
import { ShepherdTourProvider } from '../../context/ShepherdTourContext';

const meta: Meta<typeof ProfileCard> = {
  title: 'Xbox Components/ProfileCard',
  component: ProfileCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An Xbox-themed profile card that displays user information with interactive sound effects and gamerscore display.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <VolumeProvider>
        <ShepherdTourProvider>
          <Story />
        </ShepherdTourProvider>
      </VolumeProvider>
    ),
  ],
  argTypes: {
    name: {
      description: 'The display name of the user',
      control: 'text',
    },
    level: {
      description: 'The user level as a string',
      control: 'text',
    },
    gamerscore: {
      description: 'The user gamerscore as a number',
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Soros',
    level: '50',
    gamerscore: 12500,
  },
};

export const HighScore: Story = {
  args: {
    name: 'Xbox Legend',
    level: '99',
    gamerscore: 999999,
  },
};

export const NewUser: Story = {
  args: {
    name: 'Rookie',
    level: '1',
    gamerscore: 0,
  },
};