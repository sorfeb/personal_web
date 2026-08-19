import type { Meta, StoryObj } from '@storybook/react';
import GameChannelCard from './GameChannelCard';
import { DOS_GAMES } from '@/data/gamesList';

const meta: Meta<typeof GameChannelCard> = {
  title: 'Components/GameChannelCard',
  component: GameChannelCard,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof GameChannelCard>;

export const Doom: Story = {
  args: { game: DOS_GAMES[0], channel: 1 },
  render: (args) => (
    <div style={{ width: 320 }}>
      <GameChannelCard {...args} />
    </div>
  ),
};

export const ChannelRow: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 300px)', gap: 24 }}>
      {DOS_GAMES.map((game, index) => (
        <GameChannelCard key={game.slug} game={game} channel={index + 1} />
      ))}
    </div>
  ),
};
