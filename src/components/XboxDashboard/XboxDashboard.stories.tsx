import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import XboxDashboard from './XboxDashboard';

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

// Sample data for the dashboard
const sampleData = {
  home: [
    { route: '/profile', title: 'Profile', iconUrl: '/assets/icons/pages/profile.svg' },
    { route: '/projects', title: 'Projects', iconUrl: '/assets/icons/pages/projects.svg' },
    { route: '/blog', title: 'Blog', iconUrl: '/assets/icons/pages/blog.svg' },
  ],
  misc: [
    { route: '/about', title: 'About', iconUrl: '/assets/icons/pages/about.svg' },
    { route: '/certifications', title: 'Certifications', iconUrl: '/assets/icons/pages/cert.svg' },
    { route: '/leetcode', title: 'LeetCode', iconUrl: '/assets/icons/pages/leetcode.svg' },
  ],
  gallery: [
    { route: '/photos', title: 'Photos', images: ['/assets/images/sample1.jpg'] },
    { route: '/music', title: 'Music', images: ['/assets/images/sample2.jpg'] },
    { route: '/media', title: 'Media', images: ['/assets/images/sample3.jpg'] },
  ],
  credits: [
    { route: '/credits-tech', title: 'Tech Credits', iconUrl: '/assets/icons/pages/tech.svg' },
    { route: '/credits-assets', title: 'Asset Credits', iconUrl: '/assets/icons/pages/assets.svg' },
  ],
};

/**
 * XboxDashboard component displays different sections of cards with animations,
 * navigation arrows, and interactive card selection.
 */
const meta: Meta<typeof XboxDashboard> = {
  title: 'Xbox Components/XboxDashboard',
  component: XboxDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main dashboard component that displays different sections of Xbox-themed cards with smooth animations and navigation.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockVolumeProvider>
        <div style={{ height: '100vh', backgroundColor: '#0a0a0a' }}>
          <Story />
        </div>
      </MockVolumeProvider>
    ),
  ],
  argTypes: {
    activeIndex: {
      description: 'The currently active section index (0=home, 1=misc, 2=gallery, 3=credits)',
      control: {
        type: 'select',
        options: [0, 1, 2, 3],
      },
      mapping: {
        0: 'Home',
        1: 'Misc',
        2: 'Gallery',
        3: 'Credits',
      },
    },
    data: {
      description: 'Data object containing arrays of card data for each section',
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Dashboard showing home section
 */
export const HomeSection: Story = {
  args: {
    activeIndex: 0,
    data: sampleData,
  },
};

/**
 * Dashboard showing misc section
 */
export const MiscSection: Story = {
  args: {
    activeIndex: 1,
    data: sampleData,
  },
};

/**
 * Dashboard showing gallery section
 */
export const GallerySection: Story = {
  args: {
    activeIndex: 2,
    data: sampleData,
  },
};

/**
 * Dashboard showing credits section
 */
export const CreditsSection: Story = {
  args: {
    activeIndex: 3,
    data: sampleData,
  },
};
