import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import VolumeControl from './VolumeControl';

// Import the actual providers
import { VolumeProvider } from '../../context/VolumeContext';

/**
 * VolumeControl component provides an interactive volume slider
 * with speaker icon for adjusting audio levels.
 */
const meta: Meta<typeof VolumeControl> = {
  title: 'UI/VolumeControl',
  component: VolumeControl,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A volume control component with speaker icon and slider for adjusting audio levels throughout the application.',
      },
    },
  },
  tags: ['autodocs'],  decorators: [
    (Story) => (
      <VolumeProvider>
        <Story />
      </VolumeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default volume control with interactive slider
 */
export const Default: Story = {};

const GameVolumeDemo = () => {
  const [volume, setVolume] = React.useState(0.4);
  return (
    <VolumeControl
      value={volume}
      onChange={setVolume}
      icon="/assets/icons/dashboard/games/doom.svg"
      label="DOOM volume"
    />
  );
};

/**
 * Controlled mode with a game badge on the left edge — the in-game volume
 * pill. Local state only; the global VolumeContext is never written.
 */
export const GameBadge: Story = {
  render: () => <GameVolumeDemo />,
};

/**
 * Volume control in a dark container to show styling
 */
export const InDarkContainer: Story = {
  decorators: [
    (Story) => (
      <VolumeProvider>
        <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
          <Story />
        </div>
      </VolumeProvider>
    ),
  ],
};
