# AI Coding Agent Instructions

## Project Overview
This is a personal portfolio website built as an Xbox 360 dashboard replica using Next.js 15 with React. The core concept is immersive UI/UX with authentic Xbox navigation, animations, and audio feedback.

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

## Project Conventions

### File Structure Patterns
- `src/app/`: Next.js 15 app directory (pages and layouts)
- `src/components/`: Feature-organized components with co-located styles
- `src/data/`: Static JSON/TypeScript data files (cards, projects, etc.)
- `src/hooks/`: Custom React hooks for audio, navigation, and UI state
- `src/context/`: React context providers (volume, tour guides)

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
