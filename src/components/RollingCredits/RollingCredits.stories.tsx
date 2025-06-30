import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import RollingCredits from './RollingCredits';

/**
 * RollingCredits component displays scrolling credits for assets or technologies
 * with automatic loading from JSON data.
 */
const meta: Meta<typeof RollingCredits> = {
  title: 'UI/RollingCredits',
  component: RollingCredits,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A scrolling credits component that displays either assets or technologies with rolling animation effect.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ height: '400px', width: '300px', overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    displayType: {
      description: 'Type of credits to display: 0 for assets, 1 for technologies',
      control: {
        type: 'select',
        options: [0, 1],
      },
      mapping: {
        0: 'Assets',
        1: 'Technologies',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Rolling credits showing assets
 */
export const Assets: Story = {
  args: {
    displayType: 0,
  },
};

/**
 * Rolling credits showing technologies
 */
export const Technologies: Story = {
  args: {
    displayType: 1,
  },
};
