/**
 * Concept registry — a lightweight personal knowledge graph rendered as text.
 *
 * Field names follow the Open Knowledge Format (OKF v0.1 §4.1) so a future
 * migration to a real OKF bundle (one markdown file per concept) is a
 * mechanical export: `type` is the one required field; `title`,
 * `description`, `resource`, and `tags` are the recommended ones. Ids are
 * path-shaped like OKF concept IDs.
 *
 * The registry holds durable identities only. Contextual detail (model
 * version ranges, model↔harness pairings) is display text on the section
 * data below, never a node — so the graph doesn't rot per model release.
 * Status facets (`current-interest`, `learning`, `wishlist`) ride in `tags`,
 * orthogonal to the graph itself.
 */

export type ConceptType =
  | 'tech'
  | 'tool'
  | 'model'
  | 'site'
  | 'person'
  | 'project'
  | 'idea'
  | 'brand';

export interface Concept {
  /** Path-shaped id, OKF concept-ID style (`tools/claude-code`). */
  id: string;
  type: ConceptType;
  title: string;
  description?: string;
  /** Canonical URI for the underlying asset; absent for abstract ideas. */
  resource?: string;
  tags?: string[];
}

export const CONCEPTS: Concept[] = [
  {
    id: 'projects/misipns',
    type: 'project',
    title: 'MisiPNS',
    description: 'Mobile product built with React Native on PostgreSQL.',
    tags: ['current-interest'],
  },
  {
    id: 'ideas/product-engineering',
    type: 'idea',
    title: 'Product Engineering',
    description: 'Owning the product outcome, not just the ticket.',
    tags: ['current-interest'],
  },
  {
    id: 'ideas/mobile-development',
    type: 'idea',
    title: 'Mobile Development',
    tags: ['current-interest'],
  },
  {
    id: 'tech/react-native',
    type: 'tech',
    title: 'React Native',
    resource: 'https://reactnative.dev',
    tags: ['current-interest'],
  },
  {
    id: 'tech/postgresql',
    type: 'tech',
    title: 'PostgreSQL',
    resource: 'https://www.postgresql.org',
    tags: ['current-interest'],
  },
  {
    id: 'models/gemini',
    type: 'model',
    title: 'Gemini',
    description: 'Google DeepMind model family.',
  },
  {
    id: 'models/glm',
    type: 'model',
    title: 'GLM',
    description: 'Z.ai open-weight model family.',
  },
  {
    id: 'models/claude',
    type: 'model',
    title: 'Claude',
    description: 'Anthropic model family.',
  },
  {
    id: 'tools/copilot',
    type: 'tool',
    title: 'GitHub Copilot',
    resource: 'https://github.com/features/copilot',
  },
  {
    id: 'tools/claude-code',
    type: 'tool',
    title: 'Claude Code',
    description: 'Agentic coding harness in the terminal.',
    resource: 'https://claude.com/claude-code',
  },
  {
    id: 'tools/opencode',
    type: 'tool',
    title: 'opencode',
    description: 'Open-source agentic coding harness.',
    resource: 'https://opencode.ai',
  },
  {
    id: 'sites/ryoos',
    type: 'site',
    title: 'ryOS',
    description: 'Ryo Lu’s personal site as an operating system.',
    resource: 'https://os.ryo.lu',
  },
  {
    id: 'sites/levelsio',
    type: 'site',
    title: 'levels.io',
    description: 'Pieter Levels’ indie-hacker personal site.',
    resource: 'https://levels.io',
  },
  {
    id: 'ideas/japanese-americana',
    type: 'idea',
    title: 'Japanese Americana',
    description: 'Ametora — Japan’s reinterpretation of American workwear and denim.',
    tags: ['likes'],
  },
  {
    id: 'ideas/vintage-band-tees',
    type: 'idea',
    title: 'Vintage Band Tees',
    tags: ['likes'],
  },
  {
    id: 'ideas/anime-bootleg-tees',
    type: 'idea',
    title: 'Anime Bootleg Tees',
    description: '90s unlicensed anime prints — the shadier the license, the better.',
    tags: ['likes'],
  },
  {
    id: 'ideas/cd-collecting',
    type: 'idea',
    title: 'CD Collecting',
    description: 'Physical media over streams; jewel cases as artifacts.',
    tags: ['likes'],
  },
  {
    id: 'brands/redwing',
    type: 'brand',
    title: 'Red Wing',
    description: 'Heritage work boots out of Minnesota.',
    resource: 'https://www.redwingheritage.com',
    tags: ['likes'],
  },
];

const CONCEPT_INDEX = new Map(CONCEPTS.map((concept) => [concept.id, concept]));

export function getConcept(id: string): Concept | undefined {
  return CONCEPT_INDEX.get(id);
}

/* ------------------------------------------------------------------ */
/* Card page content — passages and chip sections that mention concepts */
/* ------------------------------------------------------------------ */

export interface ConceptChipSpec {
  /** Wikilink-bearing text; free text (version ranges) stays display-only. */
  label: string;
  note?: string;
}

export interface CardPassageSection {
  id: string;
  label: string;
  /** Concept this passage is about — its mentions backlink to this concept. */
  about?: string;
  text: string;
}

export interface CardChipSection {
  id: string;
  label: string;
  chips: ConceptChipSpec[];
}

/** A unit of the backlink scan: any content block that mentions concepts. */
export interface ConceptSource {
  id: string;
  label: string;
  about?: string;
  texts: string[];
}

export const CARD_INTERESTS: CardPassageSection = {
  id: 'card/interests',
  label: 'current interests',
  about: 'projects/misipns',
  text:
    'Currently building [[projects/misipns|MisiPNS]] — hands-on ' +
    '[[ideas/product-engineering|product engineering]] and ' +
    '[[ideas/mobile-development|mobile development]] with ' +
    '[[tech/react-native|React Native]] on [[tech/postgresql|PostgreSQL]].',
};

export const CARD_COLOPHON: CardChipSection = {
  id: 'card/colophon',
  label: 'colophon',
  chips: [
    {
      label: '[[models/gemini|Gemini 2.5 Pro → 3.0]]',
      note: '[[tools/copilot|Copilot]]',
    },
    {
      label: '[[models/glm|GLM 4.6 → 5.1]]',
      note: '[[tools/claude-code|Claude Code]] & [[tools/opencode|opencode]]',
    },
    {
      label: '[[models/claude|Claude 3.5 → Fable 5]]',
      note: '[[tools/claude-code|Claude Code]]',
    },
  ],
};

export const CARD_INSPIRATIONS: CardChipSection = {
  id: 'card/inspirations',
  label: 'inspirations',
  chips: [
    { label: '[[sites/ryoos]]', note: 'ryo lu' },
    { label: '[[sites/levelsio]]', note: 'pieter levels' },
  ],
};

export const CARD_LIKES: CardChipSection = {
  id: 'card/likes',
  label: 'likes',
  chips: [
    { label: '[[ideas/anime-bootleg-tees|anime bootleg tees]]' },
    { label: '[[ideas/japanese-americana|japanese americana]]' },
    { label: '[[ideas/vintage-band-tees|vintage band tees]]' },
    { label: '[[brands/redwing|red wing]]' },
    { label: '[[ideas/cd-collecting|cd collecting]]' },
  ],
};

function chipSectionToSource(section: CardChipSection): ConceptSource {
  return {
    id: section.id,
    label: section.label,
    texts: section.chips.flatMap((chip) =>
      chip.note ? [chip.label, chip.note] : [chip.label],
    ),
  };
}

export const CARD_CONCEPT_SOURCES: ConceptSource[] = [
  {
    id: CARD_INTERESTS.id,
    label: CARD_INTERESTS.label,
    about: CARD_INTERESTS.about,
    texts: [CARD_INTERESTS.text],
  },
  chipSectionToSource(CARD_COLOPHON),
  chipSectionToSource(CARD_INSPIRATIONS),
  chipSectionToSource(CARD_LIKES),
];
