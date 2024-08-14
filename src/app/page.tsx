import Image from "next/image";
import styles from "./page.module.css";
import type { GetStaticProps, NextPage } from 'next';
import React, { useEffect, useState } from 'react';

import XboxDashboard from './components/XboxDashboard';
import XboxCard from './components/XboxCard';

export default function Home() {
  return (
    <div>
      <XboxDashboard />
    </div>
  );
}


