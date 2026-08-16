> **SUPERSEDED — do not consult or update.**
> This file is from the GitHub Copilot era. This project is now developed with agentic
> CLIs (Claude Code, opencode). The canonical guide is [`/CLAUDE.md`](../CLAUDE.md) and
> domain guidance lives in `.claude/skills/`. Kept for history only.

# AI Coding Agent Instructions

## CRITICAL RULES

### Dev Server Policy
**YOU MUST NEVER START THE DEV SERVER UNLESS THE USER HAS TOLD YOU TO.**
- Never run `npm run dev`, `npm start`, `npx tsx` or any "start/build" command
- The user is running the dev server locally - starting it again will cause conflicts
- Only run the dev server if explicitly requested

### Security: Dependency Management
**NEVER add, install, or suggest new npm packages without explicit user approval.**

Before proposing ANY new dependency:
1. Check if existing packages can solve the problem
2. Explore vanilla JS/TypeScript solutions
3. If truly necessary, request approval with:
   - **Package name & version**
   - **Why it's needed** (specific use case)
   - **Alternatives considered** (what you checked first)
   - **Security info** (npm audit, maintenance status, bundle size impact)
   - **Supply chain risk assessment**

Wait for explicit "yes" before running `npm install`. Supply chain attacks are a real threat.

### Console Logging Policy 🤐
**DO NOT use excessive console.log statements:**
- **FORBIDDEN**: `console.log()`, `console.debug()` for debugging, use ONLY IF users requests it
- **USE SPARINGLY**: `console.error()`, `console.warn()` for critical issues only
- **PREFERRED**: Proper error handling with TypeScript types and TRPCError codes

Remove all debug logs before completing work.

### Documentation & Planning Structure
**Always document feature work in organized locations:**

#### Feature Planning (Before Implementation)
Create planning documents in `.github/plans/` ONLY if user requests it and feature is significant in scope.:
```
.github/plans/
├── feature-name-plan.md
├── api-enhancement-plan.md
└── ui-redesign-plan.md
```

**Plan Format:**
```markdown
# Feature: [Name]
**Date**: YYYY-MM-DD
**Status**: Planning | In Progress | Completed
**Agent**: Frontend | Backend | Full-Stack

## Objective
[Clear description of what needs to be built]

## Technical Approach
- Architecture decisions
- Components/routers to create or modify
- Dependencies (if any - with approval)

## Implementation Steps
1. [Step with file paths]
2. [Step with file paths]
3. ...

## Testing Strategy
- [ ] Unit tests
- [ ] Integration points
- [ ] Manual testing checklist

## Security Considerations
- Authentication/authorization requirements
- Input validation needs
- Potential vulnerabilities

## Performance Considerations
- Query optimization
- Caching strategy
- Bundle size impact
```

#### Feature Documentation (After Completion)
Create completion docs in `.github/documentation/` ONLY if user requests it:
```
.github/documentation/
├── feature-name-complete.md
├── api-endpoints.md
└── component-library.md
```

**Completion Format:**
```markdown
# Feature: [Name] - Completed
**Date**: YYYY-MM-DD
**Agent**: Frontend | Backend | Full-Stack

## What Was Built
[Summary of implementation]

## Files Changed
- `src/path/to/file.tsx` - [what changed]
- `src/path/to/router.ts` - [what changed]

## API Endpoints (if applicable)
- `api.feature.getAll` - [description]
- `api.feature.create` - [description]

## Usage Examples
\`\`\`tsx
// Code example
\`\`\`

## Testing Completed
- [x] TypeScript compilation
- [x] Audio integration
- [x] Responsive design
- [x] Error handling

## Known Limitations
[Any edge cases or future improvements]
```

## Project Overview
This is a personal portfolio website built as an Xbox 360 dashboard replica using Next.js 15 with React. The core concept is immersive UI/UX with authentic Xbox navigation, animations, and audio feedback.

## Specialized Agent Roles

### When to Use Which Agent
- **Frontend Agent** (`agents/copilot-frontend.md`): UI components, styling, animations, client-side logic
- **Backend Agent** (`agents/copilot-trpc.md`): API routes, database operations, validation, server logic
- **This File**: General guidance, architecture overview, cross-cutting concerns

Delegate to specialized agents for domain-specific tasks. They have detailed patterns and conventions.

## Architecture Patterns

### Xbox Dashboard System
The main interface centers around `XboxDashboard` component with sophisticated card-based navigation:
- **Card Animation Logic**: Manual DOM manipulation for complex slide/scale animations with precise timing (250px initial gap, 0.78 decrement factor)
- **Responsive Bifurcation**: Desktop uses complex animations via DOM queries, mobile switches to `ResponsiveCardGrid` with simple grid layout
- **Section Mapping**: Four sections (home, misc, gallery, credits) mapped via index-based component rendering

### Audio Management Architecture
Global audio pooling system via `useAudioManager` hook:
- **Pool Strategy**: Pre-creates 3 `HTMLAudioElement` instances per sound type to prevent latency
- **Global State**: Uses module-level variables with client-side initialization guard (`typeof window`)
- **Volume Integration**: Centralized via `VolumeContext`, updates all pool instances simultaneously
- **Sound Types**: 13 specific PS2/Xbox sounds mapped to interaction types (hover, click, navigation, etc.)

### Navigation Sound Coupling
`useNavigationSound` hook couples audio with Next.js router:
```tsx
const { navigateWithSound } = useNavigationSound();
navigateWithSound('/path', 'navigation'); // Plays sound + navigates
```

## Development Workflows

### Essential Commands
```bash
npm run dev              # Next.js dev with Turbopack
npm run storybook        # Component development at :6006
npm run build            # Production build + sitemap generation
npm run lint             # Next.js ESLint
```

### Component Development
- **Storybook First**: All major components have `.stories.tsx` files with comprehensive examples
- **CSS Modules**: Component-scoped styles with `.module.css` pattern
- **Audio Integration**: All interactive components should use `useAudioManager` for consistent feedback
- **Documentation**: Inline comments and JSDoc for complex logic
  - Document as You Code: Make documentation part of development, not an afterthought
  - Be Descriptive but Concise: Clear explanations without verbosity
  - Update docs when changing implementation

### Backend Development
- **tRPC v11**: Type-safe API layer with Zod validation
- **Prisma v6**: Database ORM with Neon PostgreSQL adapter
- **Input Validation**: All procedures must validate inputs with Zod schemas
- **Error Handling**: Use proper `TRPCError` codes (NOT_FOUND, UNAUTHORIZED, etc.)
- **Query Optimization**: Select only needed fields, use pagination, leverage indexes

## Project Conventions

### File Structure Patterns
- `src/app/`: Next.js 15 app directory (pages and layouts)
- `src/components/`: Feature-organized components with co-located styles
- `src/data/`: Static JSON/TypeScript data files (cards, projects, etc.)
- `src/hooks/`: Custom React hooks for audio, navigation, and UI state
- `src/context/`: React context providers (volume, tour guides)
- `src/server/`: tRPC backend (routers, services, config)
- `prisma/`: Database schema and migrations
- `.github/plans/`: Feature planning documents (before implementation)
- `.github/documentation/`: Feature completion docs (after implementation)

### Component Architecture
- **Memoization**: Use `React.memo` for performance-critical components
- **Audio Hooks**: Always destructure `{ playSound }` from `useAudioManager`
- **Client Components**: Mark interactive components with `'use client'`
- **Responsive Logic**: Check `window.innerWidth <= 768` for mobile behavior

### CSS Patterns
- **CSS Modules**: All component styles use `.module.css` with descriptive class names
- **Animation Timing**: Use `0.5s ease` for card transitions, `0.3s ease` for hover states
- **Transform Origins**: Set `transform-origin: center` for scaling animations


## Key Integration Points

### Context Dependencies
- Wrap app with `VolumeProvider` for audio functionality
- `ShepherdTourProvider` for guided tours (optional feature)

### External Services
- **Vercel Analytics**: Integrated via `@vercel/analytics`
- **Cloudinary**: Next.js integration for optimized images
- **Spotify API**: Mosaic playlist images (see `remotePatterns` in `next.config.mjs`)

### Animation Coordination
Complex card animations require precise timing:
1. DOM queries for card elements
2. Manual transform/opacity manipulation
3. SetTimeout coordination (100ms for state updates, 500ms for animations)
4. Z-index recalculation during transitions

## Debugging Notes
- **Audio Issues**: Check client-side initialization guard and pool creation
- **Animation Glitches**: Verify CSS transition properties and DOM query selectors
- **Mobile Responsiveness**: Test component switching logic at 768px breakpoint
- **Storybook**: Use for isolated component testing with mocked contexts
- **Backend Issues**: Check Prisma schema, validate Zod schemas, review tRPC error codes
- **Type Errors**: Run `npm run compile` to check TypeScript across the entire project

## Task Workflow

### For New Features:
1. **Plan**: Create `.github/plans/feature-name-plan.md`
2. **Implement**: Follow specialized agent guidelines
3. **Verify**: Run compilation, check functionality in browser
4. **Document**: Create `.github/documentation/feature-name-complete.md`
5. **Review**: Verify checklist above

### For Bug Fixes:
1. **Investigate**: Identify root cause
2. **Fix**: Implement solution following conventions
3. **Verify**: Confirm fix works in dev environment
4. **Document**: Update existing docs if architecture changed

### For Refactoring:
1. **Plan**: Document what's being refactored and why
2. **Refactor**: Make changes incrementally
3. **Verify**: Ensure no behavior changes in browser
4. **Document**: Update relevant documentation
