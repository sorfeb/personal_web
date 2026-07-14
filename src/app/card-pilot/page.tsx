'use client';

import React from 'react';
import GamerCard from '../../components/GamerCard';

/**
 * Pilot route for the /card Gamercard redesign.
 * Once approved, GamerCard replaces the content of /card and this route is removed.
 */
const CardPilotPage: React.FC = () => {
  return <GamerCard />;
};

export default CardPilotPage;
