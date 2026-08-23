'use client';

import React, { useRef, useState } from 'react';
import { Info, Settings, Flag } from 'lucide-react';
import PageLayout from '@/components/PageLayout/PageLayout';
import Tabs, { type TabItem, type TabsHandle } from '@/components/ui/Tabs';
import { PAGE_SCOPE_ID } from '@/constants/pageNavigation';
import { useGamepadScope } from '@/hooks/useGamepadScope';
import { useIsMobile } from '@/utils/responsiveUtils';
import { OPEN_ROADMAP_COUNT } from '@/data/roadmap';
import AboutPanel from './_panels/AboutPanel';
import SystemPanel from './_panels/SystemPanel';
import RoadmapPanel from './_panels/RoadmapPanel';
import styles from './About.module.css';

export interface StackEntry {
  label: string;
  version?: string;
  note?: string;
}

export interface SystemSummary {
  /** Current dashboard version, from package.json. */
  version: string;
  /** Date of the newest release in CHANGELOG.md, when it has one. */
  latestDate?: string;
  releaseCount: number;
  stack: readonly StackEntry[];
}

interface AboutViewProps {
  system: SystemSummary;
}

type AboutTab = 'about' | 'system' | 'roadmap';

const DEFAULT_TAB: AboutTab = 'about';

/**
 * About: the Xbox 360 Guide header, rebuilt.
 *
 * The counts on the inactive tabs are the point of the original pattern: the
 * Guide let you see there were no messages waiting without opening the tab.
 * So System carries the version and Roadmap carries its open-item count, while
 * About is a plain named tab because it has no number worth reading.
 *
 * This component renders PageLayout rather than living inside it, which is
 * load-bearing. PageLayout contributes the directional handlers to the same
 * 'page' scope, and registerScope takes its per-scope config from whichever
 * contributor registers first. React commits child effects before parent
 * effects, so contributing from inside PageLayout.Body would register first
 * and strip PageLayout's restoreFocusOnPop.
 */
const AboutView = ({ system }: AboutViewProps) => {
  const [activeTab, setActiveTab] = useState<AboutTab>(DEFAULT_TAB);
  const tabsRef = useRef<TabsHandle>(null);
  const isMobile = useIsMobile(768);

  /*
   * LB and RB switch tabs, matching the real Guide. The d-pad deliberately
   * does not: a roving tabindex leaves the inactive tabs at tabIndex -1, and
   * useSpatialNavigation skips those, so left and right stay with PageLayout's
   * spatial navigation and never fight the tab bar for the same press.
   */
  useGamepadScope({
    id: PAGE_SCOPE_ID,
    enabled: !isMobile,
    handlers: {
      pageLeft: () => tabsRef.current?.selectRelative(-1),
      pageRight: () => tabsRef.current?.selectRelative(1),
    },
  });

  const items: readonly TabItem[] = [
    { value: 'about', label: 'About', icon: <Info size={18} /> },
    {
      value: 'system',
      label: 'System',
      icon: <Settings size={18} />,
      badge: system.version,
      badgeLabel: `version ${system.version}`,
    },
    {
      value: 'roadmap',
      label: 'Roadmap',
      icon: <Flag size={18} />,
      badge: OPEN_ROADMAP_COUNT,
      badgeLabel: `${OPEN_ROADMAP_COUNT} items not yet shipped`,
    },
  ];

  return (
    <PageLayout title="About">
      <PageLayout.Header />
      <PageLayout.Body>
        <Tabs
          ref={tabsRef}
          items={items}
          value={activeTab}
          onChange={(value) => setActiveTab(value as AboutTab)}
          label="About sections"
          className={styles.tabs}
        >
          <Tabs.Panel value="about">
            <AboutPanel />
          </Tabs.Panel>
          <Tabs.Panel value="system">
            <SystemPanel system={system} />
          </Tabs.Panel>
          <Tabs.Panel value="roadmap">
            <RoadmapPanel />
          </Tabs.Panel>
        </Tabs>
      </PageLayout.Body>
    </PageLayout>
  );
};

export default AboutView;
