import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Info, Settings, Flag, Palette, Type } from 'lucide-react';
import Tabs, { type TabItem } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'WAI-ARIA tabs with a roving tabindex: the whole tablist is one tab stop and ' +
          'arrows move within it. Selection is controlled. Try Tab, then arrows, then ' +
          'Home and End.',
      },
    },
  },
};

export default meta;

/**
 * Tabs is controlled by design, so every story owns the state. `initial` picks
 * which tab opens; everything else is passed straight through.
 */
const Harness = ({
  items,
  initial,
  ...rest
}: {
  items: readonly TabItem[];
  initial: string;
} & Partial<React.ComponentProps<typeof Tabs>>) => {
  const [value, setValue] = useState(initial);

  return (
    <div style={{ width: 640, maxWidth: '100%' }}>
      <Tabs items={items} value={value} onChange={setValue} label="Story tabs" {...rest}>
        {items.map((item) => (
          <Tabs.Panel key={item.value} value={item.value}>
            <p style={{ padding: '1rem 0' }}>
              Panel content for <strong>{item.label}</strong>.
            </p>
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
};

type Story = StoryObj<typeof Harness>;

const GUIDE_ITEMS: readonly TabItem[] = [
  { value: 'about', label: 'About', icon: <Info size={18} /> },
  {
    value: 'system',
    label: 'System',
    icon: <Settings size={18} />,
    badge: '1.5.1',
    badgeLabel: 'version 1.5.1',
  },
  {
    value: 'roadmap',
    label: 'Roadmap',
    icon: <Flag size={18} />,
    badge: 6,
    badgeLabel: '6 open items',
  },
];

/** The shape the About page uses: one wide named tab, two counted ones. */
export const Guide: Story = {
  render: () => <Harness items={GUIDE_ITEMS} initial="about" />,
};

/** Opening on a badged tab shows the active tab taking the width. */
export const GuideOnBadgedTab: Story = {
  render: () => <Harness items={GUIDE_ITEMS} initial="roadmap" />,
};

export const Segmented: Story = {
  render: () => (
    <Harness
      variant="segmented"
      initial="typography"
      items={[
        { value: 'typography', label: 'Typography', icon: <Type size={18} /> },
        { value: 'colors', label: 'Colors', icon: <Palette size={18} /> },
        { value: 'toast', label: 'Toast', icon: <Info size={18} /> },
      ]}
    />
  ),
};

/** Disabled tabs are skipped by arrows and by the gamepad's selectRelative. */
export const WithDisabledTab: Story = {
  render: () => (
    <Harness
      initial="about"
      items={[
        { value: 'about', label: 'About', icon: <Info size={18} /> },
        { value: 'system', label: 'System', icon: <Settings size={18} />, badge: '1.5.1' },
        { value: 'soon', label: 'Not yet', icon: <Flag size={18} />, disabled: true },
      ]}
    />
  ),
};

/** Long labels ellipsize rather than pushing the badges off the bar. */
export const LongLabels: Story = {
  render: () => (
    <Harness
      initial="one"
      items={[
        { value: 'one', label: 'A tab label long enough to need truncating', icon: <Info size={18} /> },
        { value: 'two', label: 'Another fairly long label here', icon: <Settings size={18} />, badge: 42 },
      ]}
    />
  ),
};

export const Vertical: Story = {
  render: () => <Harness items={GUIDE_ITEMS} initial="about" orientation="vertical" />,
};
