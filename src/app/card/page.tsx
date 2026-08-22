'use client';

import React from 'react';
import { useMountEffect } from '@/hooks';
import { useAchievements } from '../../hooks/useAchievements';
import GamerCard from '../../components/GamerCard';

const CardPage: React.FC = () => {
  const { unlock } = useAchievements();

  // Nothing in the dashboard links here — reaching /card means someone typed the
  // route or followed it in from outside, which is the shortcut the achievement means.
  useMountEffect(() => {
    unlock('headhunter');
  });

  return <GamerCard />;
};

export default CardPage;
