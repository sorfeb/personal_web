import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Games',
  description:
    'Play classic DOS shareware — DOOM, Wolfenstein 3D and Commander Keen — right in the browser, on a virtual CRT.',
};

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
