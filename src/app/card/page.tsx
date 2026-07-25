'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import projectsData from '../../data/projects.json';
import {
  CARD_COLOPHON,
  CARD_CONCEPT_SOURCES,
  CARD_INSPIRATIONS,
  CARD_GEAR,
  CARD_INTERESTS,
  CARD_LIKES,
} from '../../data/concepts';
import { ChipGroup, ConceptGraphProvider, Passage } from '../../components/Concept';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useMountEffect } from '../../hooks';
import { useNavigationSound } from '../../hooks/useNavigationSound';
import styles from './Card.module.css';

interface ProjectEntry {
  projectName: string;
  role: string;
  date: string;
  description: string;
  keyTechnologies: string[];
}

interface FeaturedSpec {
  match: string;
  label: string;
  stack: string;
}

interface FeaturedEntry {
  label: string;
  stack: string;
  full: string;
}

const FEATURED: FeaturedSpec[] = [
  {
    match: 'Pacilflix',
    label: 'Pacilflix',
    stack: 'Django · Postgres',
  },
  {
    match: 'EpicArcade',
    label: 'EpicArcade',
    stack: 'Spring Boot · GCP',
  },
  {
    match: 'Evaluation of Three ASR Models for Vietnamese Language',
    label: 'Vietnamese ASR Eval',
    stack: 'Whisper · IEEE',
  },
];

const CONTACTS = [
  { label: 'github', href: 'https://github.com/sorfeb' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/soros-febriano/' },
  { label: 'email', href: 'mailto:mail@sorosfebria.co' },
  { label: 'letterboxd', href: 'https://letterboxd.com/21watchingeyes/' },
] as const;

const CardPage: React.FC = () => {
  const { playSound } = useAudioManager();
  const { navigateWithSound } = useNavigationSound();

  useMountEffect(() => {
    playSound('panel');
  });

  const featured = useMemo<FeaturedEntry[]>(() => {
    const projects = projectsData as ProjectEntry[];
    const entries: FeaturedEntry[] = [];
    for (const { match, label, stack } of FEATURED) {
      const project = projects.find((p) => p.projectName.startsWith(match));
      if (project) {
        entries.push({ label, stack, full: project.projectName });
      }
    }
    return entries;
  }, []);

  const handleLinkClick = () => {
    playSound('click');
  };

  const handleDashboardReturn = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigateWithSound('/', 'navigation');
  };

  return (
    <main className={styles.page}>
      <ConceptGraphProvider sources={CARD_CONCEPT_SOURCES}>
      <div className={styles.column}>
        <div className={styles.chip}>
          <span className={styles.chipBar} aria-hidden="true" />
          sorOS / card
        </div>

        <header className={styles.identity}>
          <h1 className={styles.name}>SOROS FEBRIANO</h1>
          <p className={styles.role}>Computer Science · Universitas Indonesia</p>
        </header>

        <p className={styles.bio}>
          Building purposeful, meticulously engineered software at the seam of technology
          and art. Currently focused on ASR research and full-stack systems.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Current interests</h2>
          <Passage section={CARD_INTERESTS} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Selected work</h2>
          <ul className={styles.workList}>
            {featured.map((entry) => (
              <li key={entry.label} className={styles.workItem}>
                <span className={styles.workGlyph} aria-hidden="true">▸</span>
                <span className={styles.workName} title={entry.full}>
                  {entry.label}
                </span>
                <span className={styles.workStack}>{entry.stack}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Colophon</h2>
          <ChipGroup chips={CARD_COLOPHON.chips} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Inspirations</h2>
          <ChipGroup chips={CARD_INSPIRATIONS.chips} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Likes</h2>
          <ChipGroup chips={CARD_LIKES.chips} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Gear</h2>
          <ChipGroup chips={CARD_GEAR.chips} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Contact</h2>
          <ul className={styles.contactList}>
            {CONTACTS.map((contact) => (
              <li key={contact.label}>
                <a
                  className={styles.contactLink}
                  href={contact.href}
                  target={contact.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={contact.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  onClick={handleLinkClick}
                >
                  <span className={styles.contactGlyph} aria-hidden="true">◆</span>
                  {contact.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <footer className={styles.footer}>
          <Link
            href="/"
            className={styles.dashboardLink}
            onClick={handleDashboardReturn}
          >
            <span>[ enter the dashboard</span>
            <span className={styles.dashboardArrow} aria-hidden="true">↵</span>
            <span>]</span>
          </Link>
        </footer>
      </div>
      </ConceptGraphProvider>
    </main>
  );
};

export default CardPage;
