'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useNavigationSound } from '../../hooks/useNavigationSound';
import { useEventListener, useMountEffect, useScrollSpy } from '@/hooks';
import { useToast, createSystemToast } from '../ToastNotification';
import { Clock } from '../ui/Clock/Clock';
import { downloadVCard } from '../../utils/vcard';
import { identity } from '../../data/card';
import type { MenuItem, SectionId } from './sections';
import { MENU_ITEMS, SECTION_DOM_IDS, sectionDomId } from './sections';
import MenuList from './MenuList';
import TabBar from './TabBar';
import IdentityPanel from './IdentityPanel';
import ExperiencePane from './panes/ExperiencePane';
import WorkPane from './panes/WorkPane';
import SkillsPane from './panes/SkillsPane';
import ContactPane from './panes/ContactPane';
import styles from './GamerCard.module.css';

/**
 * GamerCard — Xbox 360 blades-era Profile screen as a business card.
 *
 * Desktop: two-column replica — menu list on the left drives which
 * content pane shows on the right; Ⓐ/Ⓑ footer and keyboard navigation.
 * Mobile (≤768px): one vertically scrollable column with a fixed bottom
 * tab bar; the green indicator tracks the section in view via scroll-spy.
 */
const GamerCard: React.FC = () => {
  const { playSound } = useAudioManager();
  const { navigateWithSound } = useNavigationSound();
  const { showToast } = useToast();

  const [cursorIndex, setCursorIndex] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionId>('experience');

  // Mobile scroll-spy; hidden desktop sections never intersect, so this
  // only meaningfully updates while the page scrolls on small screens.
  const spyId = useScrollSpy(SECTION_DOM_IDS);
  const spySection = (spyId?.replace('gc-', '') ?? 'profile') as SectionId;

  useMountEffect(() => {
    playSound('panel');
  });

  const handleCursorChange = (index: number) => {
    if (index !== cursorIndex) {
      setCursorIndex(index);
      playSound('hover');
    }
  };

  const handleSaveContact = () => {
    downloadVCard();
    playSound('achievement');
    showToast(createSystemToast('Contact card saved — add it to your contacts', 'success'));
  };

  const handleBack = () => {
    navigateWithSound('/', 'back');
  };

  const activateItem = (item: MenuItem) => {
    if (item.kind === 'section') {
      playSound('click');
      setActiveSection(item.id as SectionId);
    } else if (item.id === 'save-contact') {
      handleSaveContact();
    } else if (item.id === 'dashboard') {
      navigateWithSound('/', 'navigation');
    }
  };

  const handleTabSelect = (id: SectionId) => {
    playSound('click');
    const target = document.getElementById(sectionDomId(id));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  // Console-style keyboard control (desktop): ↑/↓ move the selection
  // bar, Enter activates, Escape backs out to the dashboard.
  const handleKeyDown = (event: KeyboardEvent) => {
    if (window.innerWidth <= 768) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      handleCursorChange(Math.min(cursorIndex + 1, MENU_ITEMS.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      handleCursorChange(Math.max(cursorIndex - 1, 0));
    } else if (event.key === 'Enter') {
      // Let focused interactive elements handle Enter themselves
      const target = event.target as HTMLElement | null;
      if (target?.closest('button, a, input')) return;
      activateItem(MENU_ITEMS[cursorIndex]);
    } else if (event.key === 'Escape') {
      handleBack();
    }
  };

  useEventListener(typeof window === 'undefined' ? null : window, 'keydown', handleKeyDown);

  const sectionClass = (id: SectionId) =>
    `${styles.section} ${activeSection === id ? styles.sectionActive : ''}`;

  return (
    <div className={styles.page}>
      <header className={styles.chrome}>
        <h1 className={styles.chromeTitle}>Profile</h1>
        <div className={styles.chromeAvatar} aria-hidden="true">
          <Image
            src={identity.avatarSrc}
            alt=""
            width={44}
            height={44}
            sizes="44px"
            className={styles.chromeAvatarImage}
            draggable={false}
          />
        </div>
        <Clock className={styles.chromeClock} />
      </header>

      <div className={styles.panel}>
        <div className={styles.menuColumn}>
          <MenuList
            items={MENU_ITEMS}
            cursorIndex={cursorIndex}
            onCursorChange={handleCursorChange}
            onActivate={activateItem}
          />
        </div>

        <div className={styles.rightPane}>
          <section id={sectionDomId('profile')} className={styles.identitySection}>
            <IdentityPanel
              onSaveContact={handleSaveContact}
              onHoverSound={() => playSound('hover')}
            />
          </section>

          <div className={styles.paneViewport}>
            <section id={sectionDomId('experience')} className={sectionClass('experience')}>
              <ExperiencePane />
            </section>
            <section id={sectionDomId('work')} className={sectionClass('work')}>
              <WorkPane />
            </section>
            <section id={sectionDomId('skills')} className={sectionClass('skills')}>
              <SkillsPane />
            </section>
            <section id={sectionDomId('contact')} className={sectionClass('contact')}>
              <ContactPane />
            </section>
          </div>
        </div>
      </div>

      <footer className={styles.chromeFooter}>
        <button
          type="button"
          className={styles.controlButton}
          onClick={() => activateItem(MENU_ITEMS[cursorIndex])}
          onMouseEnter={() => playSound('owawa')}
        >
          <span className={`${styles.buttonIcon} ${styles.buttonIconGreen}`}>A</span>
          <span className={styles.buttonText}>Select</span>
        </button>
        <button
          type="button"
          className={styles.controlButton}
          onClick={handleBack}
          onMouseEnter={() => playSound('owawa')}
        >
          <span className={`${styles.buttonIcon} ${styles.buttonIconRed}`}>B</span>
          <span className={styles.buttonText}>Back</span>
        </button>
      </footer>

      <TabBar activeId={spySection} onSelect={handleTabSelect} />
    </div>
  );
};

export default GamerCard;
