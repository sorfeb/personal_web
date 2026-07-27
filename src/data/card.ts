/**
 * Content source of truth for the /card Gamercard business card.
 * Every string rendered on the card (and embedded in the vCard) lives here.
 */

export interface CardIdentity {
  name: string;
  title: string;
  org: string;
  statusLine: string;
  tagline: string;
  location: string;
  avatarSrc: string;
}

export interface CardStats {
  projects: number;
  /** Playful nod to the Xbox metric — tune freely. */
  gamerscore: number;
  achievements: number;
}

export interface CardRole {
  company: string;
  title: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface CardProject {
  name: string;
  stack: string;
  description: string;
}

export interface CardSkillGroup {
  label: string;
  items: string[];
}

export interface CardCredential {
  title: string;
  issuer: string;
}

export interface CardContact {
  label: string;
  href: string;
  display: string;
  /** Secondary links render smaller, off the main recruiter path. */
  secondary?: boolean;
}

export const identity: CardIdentity = {
  name: 'SOROS FEBRIANO',
  title: 'Pragmatic Software Engineer',
  org: 'MisiPNS',
  statusLine: 'Online — open to interesting problems',
  tagline:
    'Purposeful, meticulously engineered software for real people — practical over trendy.',
  location: 'Jakarta, Indonesia',
  avatarSrc: '/assets/images/myBody.webp',
};

export const email = 'mail@sorosfebria.co';
export const websiteUrl = 'https://www.sorosfebria.co';

export const roles: CardRole[] = [
  {
    company: 'MisiPNS',
    title: 'Founding Product Engineer',
    period: 'Jan 2026 — Present',
    location: 'Remote',
    bullets: [
      'Built a token-based React Native UI library — 22 core / 100+ components, Material Design 3, 60fps with Reanimated',
      'A/B-tested onboarding & paywall flows, lifting conversion from 1% to 5%',
      'Optimistic UI and caching architecture with Zustand and React Query',
    ],
  },
  {
    company: 'Nanovest',
    title: 'QA Engineer',
    period: 'Aug 2025 — Jan 2026',
    location: 'Jakarta',
    bullets: [
      'Autonomous test pipeline (Python, Robot Framework, Playwright) cutting manual regression time ~80%',
      'AI agents (Claude Code Workflows) tripling test-script authoring speed',
      '99.9% suite stability; 70+ defects caught on RN New Architecture',
    ],
  },
  {
    company: 'ALVA',
    title: 'Full Stack Engineer',
    period: 'May 2025 — Jul 2025',
    location: 'Jakarta',
    bullets: [
      'Shipped the "FRnD Chat" Next.js frontend with a brand-constrained markdown pipeline',
      'Automated video workflows producing 1,000+ videos/month',
      'AI creative tools reducing editing time ~25%',
    ],
  },
];

export const projects: CardProject[] = [
  {
    name: 'Tangan Kanan',
    stack: 'Next.js · Convex · LangGraph',
    description: 'Agentic assistant platform built end-to-end.',
  },
  {
    name: 'SiNgawas',
    stack: 'Top 3 of 24 — award',
    description: 'Supervision platform; placed Top 3 of 24 teams.',
  },
  {
    name: 'EpicArcade',
    stack: 'Spring Boot · GCP · TDD',
    description: 'Microservices arcade store, test-driven on Google Cloud.',
  },
];

export const skillGroups: CardSkillGroup[] = [
  { label: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go'] },
  {
    label: 'Frontend',
    items: ['React', 'Next.js', 'React Native', 'Vue', 'TanStack', 'Tailwind', 'Zustand'],
  },
  {
    label: 'Backend & Data',
    items: ['Django', 'Spring Boot', 'PostgreSQL', 'Supabase', 'Convex'],
  },
  {
    label: 'Infra & Quality',
    items: ['Docker', 'Kubernetes', 'GCP', 'Nginx', 'CI/CD', 'Playwright', 'Grafana'],
  },
  { label: 'AI & Design', items: ['LangGraph', 'PyTorch', 'Figma', 'Storybook'] },
];

export const education = 'B.Sc. Computer Science — Universitas Indonesia (2022–2026, expected)';

export const credentials: CardCredential[] = [
  { title: 'Associate AI Engineer', issuer: 'DataCamp' },
  { title: 'Kubernetes Skill Badge', issuer: 'Google Cloud' },
  { title: 'Security Skill Badge', issuer: 'Google Cloud' },
  { title: 'Gemini Pro Skill Badge', issuer: 'Google Cloud' },
  { title: 'Top 3 of 24 — SiNgawas', issuer: 'Competition award' },
];

export const contacts: CardContact[] = [
  { label: 'GitHub', href: 'https://github.com/sorfeb', display: 'github.com/sorfeb' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/soros-febriano/',
    display: 'linkedin.com/in/soros-febriano',
  },
  { label: 'Email', href: `mailto:${email}`, display: email },
  { label: 'Website', href: websiteUrl, display: 'sorosfebria.co' },
  {
    label: 'Letterboxd',
    href: 'https://letterboxd.com/21watchingeyes/',
    display: 'beyond code',
    secondary: true,
  },
];

export const stats: CardStats = {
  projects: projects.length + roles.length,
  gamerscore: 10250,
  achievements: credentials.length,
};
