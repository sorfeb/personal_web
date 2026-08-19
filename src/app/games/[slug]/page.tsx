import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import GamePlayer from '@/components/GamePlayer';
import { DOS_GAMES, getGameBySlug } from '@/data/gamesList';

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return DOS_GAMES.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) return { title: 'Games' };
  return {
    title: `${game.title} (${game.year})`,
    description: `Play ${game.title} — ${game.episode} — in the browser.`,
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  return <GamePlayer game={game} />;
}
