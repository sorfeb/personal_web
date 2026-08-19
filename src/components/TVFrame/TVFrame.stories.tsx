import type { Meta, StoryObj } from '@storybook/react';
import TVFrame from './TVFrame';

const meta: Meta<typeof TVFrame> = {
  title: 'Components/TVFrame',
  component: TVFrame,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof TVFrame>;

const TestPattern = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
    }}
  >
    {['#c0c0c0', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0'].map(
      (color) => (
        <div key={color} style={{ background: color }} />
      ),
    )}
  </div>
);

export const PoweredOn: Story = {
  args: { powered: true, label: 'DOOM · 1993' },
  render: (args) => (
    <div style={{ width: 560 }}>
      <TVFrame {...args}>
        <TestPattern />
      </TVFrame>
    </div>
  ),
};

export const PoweredOff: Story = {
  args: { powered: false, label: 'DOOM · 1993' },
  render: (args) => (
    <div style={{ width: 560 }}>
      <TVFrame {...args}>
        <TestPattern />
      </TVFrame>
    </div>
  ),
};

export const CardSized: Story = {
  args: { powered: true, label: 'Commander Keen' },
  render: (args) => (
    <div style={{ width: 260 }}>
      <TVFrame {...args}>
        <TestPattern />
      </TVFrame>
    </div>
  ),
};
