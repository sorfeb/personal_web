import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['chrome', 'metallic', 'glass', 'ghost', 'solid', 'danger'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    shape: { control: 'select', options: ['rect', 'pill', 'circle'] },
    badge: { control: 'select', options: [undefined, 'A', 'B', 'X', 'Y'] },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Solid: Story = {
  args: { children: 'Save Contact', variant: 'solid' },
};

export const ControllerChrome: Story = {
  args: { children: 'Select', variant: 'chrome', badge: 'A' },
};

export const ControllerBack: Story = {
  args: { children: 'Back', variant: 'chrome', badge: 'B' },
};

export const Metallic: Story = {
  args: { children: 'Open Player', variant: 'metallic' },
};

export const GhostClose: Story = {
  args: { children: '✕', variant: 'ghost', shape: 'circle', iconOnly: true, 'aria-label': 'Close' },
};

export const Danger: Story = {
  args: { children: 'Close Player', variant: 'danger' },
};

export const Loading: Story = {
  args: { children: 'Signing in…', variant: 'solid', loading: true },
};

export const Glowing: Story = {
  args: { children: 'Achievement', variant: 'solid', glow: true },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: 24 }}>
      <Button variant="solid">Solid</Button>
      <Button variant="chrome" badge="A">
        Chrome
      </Button>
      <Button variant="metallic">Metallic</Button>
      <Button variant="glass">Glass</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};
