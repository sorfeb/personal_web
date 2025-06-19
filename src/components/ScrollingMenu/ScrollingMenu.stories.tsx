import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ScrollingMenu from './ScrollingMenu';

// Mock context providers for Storybook
const MockVolumeProvider = ({ children }: { children: React.ReactNode }) => {
  const VolumeContext = React.createContext({
    volume: 0.5,
    setVolume: () => {},
  });
  
  return (
    <VolumeContext.Provider value={{ volume: 0.5, setVolume: () => {} }}>
      {children}
    </VolumeContext.Provider>
  );
};

/**
 * ScrollingMenu component provides a vertical scrollable menu with sound effects
 * and selection highlighting. Supports mouse wheel navigation.
 */
const meta: Meta<typeof ScrollingMenu> = {
  title: 'Xbox Components/ScrollingMenu',
  component: ScrollingMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A scrollable menu component with Xbox-themed styling, sound effects on navigation, and wheel scroll support.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockVolumeProvider>
        <div style={{ height: '300px', width: '200px' }}>
          <Story />
        </div>
      </MockVolumeProvider>
    ),
  ],
  argTypes: {
    items: {
      description: 'Array of menu items to display',
      control: 'object',
    },
    onSelectionChange: {
      description: 'Callback function when selection changes',
      action: 'selection changed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default scrolling menu with sample items
 */
export const Default: Story = {
  args: {
    items: ['Home', 'About', 'Projects', 'Contact', 'Blog'],
    onSelectionChange: (index: number) => console.log('Selected:', index),
  },
};

/**
 * Long menu with many items to demonstrate scrolling
 */
export const LongMenu: Story = {
  args: {
    items: [
      'Dashboard',
      'Profile',
      'Settings',
      'Messages',
      'Friends',
      'Games',
      'Store',
      'Media',
      'Downloads',
      'Achievements',
      'Help',
      'Sign Out',
    ],
    onSelectionChange: (index: number) => console.log('Selected:', index),
  },
};

/**
 * Short menu with few items
 */
export const ShortMenu: Story = {
  args: {
    items: ['Yes', 'No'],
    onSelectionChange: (index: number) => console.log('Selected:', index),
  },
};
