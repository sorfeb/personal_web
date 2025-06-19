import type { Meta, StoryObj } from '@storybook/react';
import LoadingScreen from './LoadingScreen';

/**
 * LoadingScreen component displays a loading animation with a spinner and text.
 * Used during page transitions or data loading states.
 */
const meta: Meta<typeof LoadingScreen> = {
  title: 'UI/LoadingScreen',
  component: LoadingScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A loading screen component with animated spinner and glowing background effect. Used during page transitions or while content is loading.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default loading screen with spinner animation
 */
export const Default: Story = {};

/**
 * Loading screen in a contained view for demonstration
 */
export const Contained: Story = {
  parameters: {
    layout: 'centered',
  },
};
