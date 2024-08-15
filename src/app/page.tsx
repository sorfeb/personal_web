import Image from "next/image";
import styles from "./page.module.css";
import type { GetStaticProps, NextPage } from 'next';
import React, { useEffect, useState } from 'react';

import XboxDashboard from './components/XboxDashboard';
import XboxCard from './components/XboxCard';
import ScrollingMenu from './components/ScrollingMenu';

export default function Home() {
  return (
    <div className="screen">
      <ScrollingMenu items={["Home", "Games", "Store", "Community", "Profile", "Settings", "Media"]} />
      <XboxDashboard />
    </div>
  );
}


