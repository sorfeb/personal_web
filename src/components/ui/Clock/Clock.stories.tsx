import type { Meta, StoryObj } from '@storybook/react';
import { Clock } from './Clock';

const meta: Meta<typeof Clock> = {
  title: 'Components/UI/Clock',
  component: Clock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Clock>;

export const Default: Story = {
  args: {
    format: '12h',
    showSeconds: false
  }
};

export const WithSeconds: Story = {
  args: {
    format: '12h',
    showSeconds: true
  }
};