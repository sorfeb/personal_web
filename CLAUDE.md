# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!-- intent-skills:start -->
## Skill Loading

Before substantial work:
- Skill check: run `npx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

## Build & Development Commands

```bash
npm run dev          # Next.js dev server with Turbopack (port 3000)
npm run build        # Production build + sitemap generation
npm run lint         # ESLint (next/core-web-vitals + storybook rules)
npm run lint:css     # Stylelint (design-token enforcement; warnings must not increase)
npm run compile      # TypeScript type checking
npm run storybook    # Component development environment (port 6006)
```

## Critical Rules

- **Never start the dev server** unless explicitly requested - user runs it locally
- **Never install packages** without explicit approval - always check existing packages first
- **Avoid console.log** - use proper error handling; remove debug logs before completing work
- **Design tokens, not literals** - never hardcode colors, radii, or transition timings in CSS; use `var(--*)` from `src/app/design-tokens.css` (add missing tokens there first). Boy-scout rule: any `.module.css` line you touch that has a hardcoded color gets tokenized; new CSS must pass `npm run lint:css` with zero new warnings
- **Prefer `ui/` primitives** - use `src/components/ui/Button` (and `ui/Toggle`) instead of hand-rolling buttons; audio feedback and focus-visible are built in

## Architecture Overview

This is a personal portfolio website styled as an Xbox 360 dashboard replica built with Next.js 15, tRPC, and Prisma.

### Audio System
The `useAudioManager` hook implements a global audio pooling system:
- Pre-creates 3 `HTMLAudioElement` instances per sound type to prevent latency
- Module-level variables with client-side initialization guard (`typeof window`)
- Volume controlled via `VolumeContext` - updates all pool instances simultaneously
- 13 sound types mapped to interactions (hover, click, navigation, etc.)

Use `useNavigationSound` to couple audio with Next.js router navigation:
```tsx
const { navigateWithSound } = useNavigationSound();
navigateWithSound('/path', 'navigation');
```

### tRPC Backend
- **Router location**: `src/server/routers/_app.ts` combines all routers
- **Available routers**: messages, user, spotify, blog
- **Patterns**: Zod validation on all inputs, proper TRPCError codes, select only needed fields
- **Database**: Prisma v6 with Neon PostgreSQL adapter (`prisma/schema.prisma`)

### Component Patterns
- CSS Modules (`.module.css`) for all component styles
- `'use client'` directive for interactive components
- `React.memo` for performance-critical components
- Always destructure `{ playSound }` from `useAudioManager` for audio feedback
- Mobile breakpoint: `window.innerWidth <= 768`

### Animation Timing
- Card transitions: `0.5s ease`
- Hover states: `0.3s ease`
- Transform origin: `center` for scaling animations

## Key Files

- `src/context/VolumeContext.tsx` - Global volume state provider
- `src/hooks/useAudioManager.ts` - Audio pooling system
- `src/server/routers/_app.ts` - tRPC router registry
- `src/utils/trpc.ts` - tRPC client configuration
