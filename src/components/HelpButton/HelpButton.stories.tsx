import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import HelpButton from './HelpButton';
import { VolumeProvider } from '../../context/VolumeContext';
import { ShepherdTourProvider } from '../../context/ShepherdTourContext';

/**
 * HelpButton component provides a circular help button with Xbox-themed styling
 * and integrates with the tour system for user guidance.
 */
const meta: Meta<typeof HelpButton> = {
  title: 'Xbox Components/HelpButton',
  component: HelpButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A circular help button with blue Xbox-themed styling that triggers the application tour when clicked.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <VolumeProvider>
        <ShepherdTourProvider>
          <div className="storybook-decorator">
            <Story />
          </div>
        </ShepherdTourProvider>
      </VolumeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default help button with blue Xbox styling
 */
export const Default: Story = {};

/**
 * Multiple help buttons showing consistent styling
 */
export const Multiple: Story = {
  render: () => (
    <div className="storybook-flex">
      <HelpButton />
      <HelpButton />
      <HelpButton />
    </div>
  ),
};

/**
 * Help button in a layout context similar to how it would appear in the app
 */
export const InLayout: Story = {
  render: () => (
    <div className="storybook-layout">
      <HelpButton />
      <div className="storybook-content">
        <h3>Help Available</h3>
        <p>Click the help button for a tour</p>
      </div>
    </div>
  ),
};
