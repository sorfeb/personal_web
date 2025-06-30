import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import PageLayout from './PageLayout';

// Import the actual providers
import { VolumeProvider } from '../../context/VolumeContext';

/**
 * PageLayout component provides a consistent layout structure for pages
 * with title, close button, animations, and optional window styling.
 */
const meta: Meta<typeof PageLayout> = {
  title: 'Layout/PageLayout',
  component: PageLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A layout component that provides consistent page structure with animated transitions, close functionality, and Xbox-themed styling.',
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
  argTypes: {
    title: {
      description: 'The page title displayed at the top',
      control: 'text',
    },
    showWindow: {
      description: 'Whether to show the content in a window container',
      control: 'boolean',
    },
    children: {
      description: 'The content to be displayed within the layout',
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default page layout with window styling
 */
export const Default: Story = {
  args: {
    title: 'Sample Page',
    showWindow: true,
    children: (
      <div style={{ padding: '20px', color: 'white' }}>
        <h2>Page Content</h2>
        <p>This is sample content within the page layout.</p>
      </div>
    ),
  },
};

/**
 * Page layout without window container
 */
export const WithoutWindow: Story = {
  args: {
    title: 'No Window Layout',
    showWindow: false,
    children: (
      <div style={{ padding: '20px', color: 'white' }}>
        <h2>Direct Content</h2>
        <p>Content displayed without window container.</p>
      </div>
    ),
  },
};

/**
 * Page layout with rich content
 */
export const WithRichContent: Story = {
  args: {
    title: 'Rich Content Page',
    showWindow: true,
    children: (
      <div style={{ padding: '20px', color: 'white' }}>
        <h2>Rich Content Example</h2>
        <p>This demonstrates how the layout handles various content types.</p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
          <li>List item 3</li>
        </ul>
        <button style={{ padding: '10px', marginTop: '10px' }}>Sample Button</button>
      </div>
    ),
  },
};
