import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import XboxCard from './XboxCard';

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
 * XboxCard component displays interactive cards with hover effects,
 * mouse tracking, and optional image slideshows.
 */
const meta: Meta<typeof XboxCard> = {
  title: 'Xbox Components/XboxCard',
  component: XboxCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An interactive Xbox-themed card component with mouse tracking effects, hover sounds, and support for icon or image slideshow display.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockVolumeProvider>
        <div style={{ width: '300px', height: '200px' }}>
          <Story />
        </div>
      </MockVolumeProvider>
    ),
  ],
  argTypes: {
    title: {
      description: 'The title displayed on the card',
      control: 'text',
    },
    iconUrl: {
      description: 'URL of the icon to display (used when no images provided)',
      control: 'text',
    },
    route: {
      description: 'The route to navigate to when card is clicked',
      control: 'text',
    },
    images: {
      description: 'Array of image URLs for slideshow (optional)',
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Card with icon display
 */
export const WithIcon: Story = {
  args: {
    title: 'Dashboard',
    iconUrl: '/assets/icons/dashboard/dashboard.svg',
    route: '/dashboard',
  },
};

/**
 * Card with image slideshow
 */
export const WithImages: Story = {
  args: {
    title: 'Gallery',
    route: '/gallery',
    images: [
      '/assets/images/sample1.jpg',
      '/assets/images/sample2.jpg',
      '/assets/images/sample3.jpg',
    ],
  },
};

/**
 * Card with long title to test text wrapping
 */
export const WithLongTitle: Story = {
  args: {
    title: 'This is a Very Long Title That Should Wrap',
    iconUrl: '/assets/icons/pages/about.svg',
    route: '/about',
  },
};

/**
 * Card without route (non-clickable)
 */
export const NonClickable: Story = {
  args: {
    title: 'Static Card',
    iconUrl: '/assets/icons/pages/info.svg',
    route: '',
  },
};
