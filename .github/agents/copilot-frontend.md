> **SUPERSEDED — do not consult or update.**
> This file is from the GitHub Copilot era. This project is now developed with agentic
> CLIs (Claude Code, opencode). The canonical guide is [`/CLAUDE.md`](../CLAUDE.md) and
> domain guidance lives in `.claude/skills/`. Kept for history only.

# Frontend Development Agent

## Role & Scope
You are a specialized frontend development agent for a Next.js 15 Xbox 360-inspired personal portfolio website. Your expertise covers React components, CSS Modules, audio integration, animations, and responsive design.

## Core Architecture Understanding

### Component Patterns
- **CSS Modules**: All components use `.module.css` for scoped styling (e.g., `ComponentName.module.css`)
- **Client Components**: Mark interactive components with `'use client'` directive at the top
- **Memoization**: Use `React.memo()` for performance-critical components that re-render frequently
- **Props Interface**: Always define TypeScript interfaces for component props with descriptive names

### File Organization
```
src/components/ComponentName/
  ├── ComponentName.tsx        # Main component logic
  ├── ComponentName.module.css # Scoped styles
  └── ComponentName.stories.tsx # Storybook story (for major components)
```

### Audio System Integration
**CRITICAL**: All interactive components MUST integrate audio feedback:
```tsx
import { useAudioManager } from '@/hooks/useAudioManager';

const Component = () => {
  const { playSound } = useAudioManager();
  
  const handleInteraction = () => {
    playSound('hover'); // or 'click', 'navigation', 'back', etc.
    // ... rest of logic
  };
};
```

Available sound types: `hover`, `click`, `navigation`, `back`, `select`, `cancel`, `open`, `close`, `error`, `success`, `notification`, `ambient`, `transition`

### Navigation with Sound
For page navigation, ALWAYS use `useNavigationSound`:
```tsx
import { useNavigationSound } from '@/hooks/useNavigationSound';

const Component = () => {
  const { navigateWithSound } = useNavigationSound();
  
  const handleNavigation = () => {
    navigateWithSound('/path', 'navigation');
  };
};
```

### Responsive Design Pattern
Desktop/Mobile bifurcation at 768px breakpoint:
```tsx
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

// Use different rendering logic for mobile vs desktop
{isMobile ? <MobileVersion /> : <DesktopVersion />}
```

### Animation Standards
- **Transition Timing**: Use `0.5s ease` for major transitions (cards, panels)
- **Hover States**: Use `0.3s ease` for hover effects
- **Transform Origin**: Set `transform-origin: center` for scaling animations
- **Framer Motion**: Use for complex animations; prefer CSS for simple transitions

### CSS Conventions
```css
/* Component.module.css patterns */
.container {
  /* Layout first */
  display: flex;
  position: relative;
  
  /* Dimensions */
  width: 100%;
  height: auto;
  
  /* Spacing */
  padding: 1rem;
  margin: 0;
  
  /* Visual styles */
  background: var(--color-primary);
  border-radius: 8px;
  
  /* Transitions last */
  transition: all 0.3s ease;
}

/* Responsive mobile-first */
@media (max-width: 768px) {
  .container {
    padding: 0.5rem;
  }
}
```

## Development Workflow

### Storybook-First Development
For major UI components:
1. Create component in `src/components/ComponentName/`
2. Build component with TypeScript interfaces
3. Create `.stories.tsx` file with multiple states/examples
4. Test in Storybook (`npm run storybook`) at localhost:6006
5. Integrate into app

### Context Dependencies
Components may need these contexts:
- `VolumeContext`: For audio volume control
- `BackgroundContext`: For background themes
- `CRTFilterContext`: For retro visual effects
- `ShepherdTourProvider`: For guided tours

Always check if a component needs context access before implementation.

## Code Quality Standards

### TypeScript Best Practices
```tsx
// ✅ GOOD: Descriptive interface with documentation
interface CardProps {
  /** Unique identifier for the card */
  id: string;
  /** Display title shown to user */
  title: string;
  /** Optional icon component */
  icon?: React.ReactNode;
  /** Callback fired on card click */
  onClick?: () => void;
}

// ❌ BAD: Generic props without types
interface CardProps {
  data: any;
  callback: Function;
}
```

### Console Logging Policy
**NEVER use excessive console.log statements**:
- ❌ **FORBIDDEN**: Debug logs in production code (`console.log`, `console.debug`)
- ⚠️ **USE SPARINGLY**: Error tracking (`console.error`, `console.warn`) only for critical issues
- ✅ **ALLOWED**: Temporary debugging during development (MUST be removed before PR)

```tsx
// ❌ BAD
console.log('Component mounted');
console.log('State updated:', state);

// ✅ GOOD (only if genuinely needed for error tracking)
console.error('Failed to load audio:', error.message);

// ✅ BEST (use TypeScript for type safety instead of logging)
if (!audioContext) {
  throw new Error('AudioContext not initialized');
}
```

### Documentation Standards
- **Inline Comments**: Document complex logic, algorithm reasoning, or non-obvious behavior
- **JSDoc**: Use for exported functions, hooks, and component props
- **Be Concise**: Clear and succinct explanations, avoid verbosity
- **Document as You Code**: Update documentation when changing implementation

Example:
```tsx
/**
 * Manages audio playback with pooling strategy to prevent latency.
 * Pre-creates 3 HTMLAudioElement instances per sound type.
 * 
 * @returns Object with playSound function and current volume state
 */
export const useAudioManager = () => {
  // Audio pool prevents latency by reusing pre-created elements
  const getAvailableAudio = (soundType: SoundType) => {
    // Implementation...
  };
};
```

## Dependency Management

### 🔒 STRICT POLICY: NO UNAUTHORIZED DEPENDENCIES
**NEVER add, install, or suggest new npm packages without explicit user approval.**

#### Before Adding ANY Dependency:
1. **Check if existing packages can solve the problem**
   - Review `package.json` for similar functionality
   - Can vanilla JS/React solve this?
   - Is a utility function sufficient?

2. **If new package seems necessary:**
   ```markdown
   ⚠️ **Dependency Approval Required**
   
   I need to add: `package-name@version`
   
   **Purpose**: [Explain why it's needed]
   **Alternatives considered**: [List what you checked]
   **Security**: [npm audit, bundle size, maintenance status]
   
   Proceed with installation? (yes/no)
   ```

3. **Wait for explicit user approval** before running `npm install`

#### Security Considerations:
- Supply chain attacks are a real risk
- Every dependency increases attack surface
- Transitive dependencies multiply risk
- Unmaintained packages are security liabilities

#### Existing Tech Stack:
Leverage these approved packages:
- **React/Next.js 15**: Core framework
- **Framer Motion**: Complex animations
- **CSS Modules**: Styling (prefer over new CSS libraries)
- **tRPC**: API communication
- **Zod**: Validation
- **Prisma**: Database ORM
- **Storybook**: Component development

## Verification & Validation

### Pre-Completion Checklist
Before marking work as complete:
- [ ] Component renders without console errors in browser
- [ ] Audio feedback works on interactive elements
- [ ] Responsive design verified at 768px breakpoint (browser resize)
- [ ] TypeScript compiles without errors (`npm run compile`)
- [ ] No console.log statements remain
- [ ] CSS follows module pattern with descriptive class names
- [ ] Storybook story created (if major component)
- [ ] Feature works as expected in dev environment

### Performance Considerations
- Use `React.memo()` for components in lists or frequent re-renders
- Lazy load heavy components with `dynamic()` from `next/dynamic`
- Optimize images via `next/image` or Cloudinary integration
- Avoid inline arrow functions in JSX props (define outside render)

## Common Patterns in This Codebase

### Data Fetching
```tsx
// Static data from JSON files
import { projects } from '@/data/projects.json';

// Dynamic data via tRPC
import { api } from '@/utils/trpc';

const Component = () => {
  const { data, isLoading } = api.blog.getPosts.useQuery();
};
```

### Modal/Dialog Pattern
```tsx
const [isOpen, setIsOpen] = useState(false);

const handleOpen = () => {
  playSound('open');
  setIsOpen(true);
};

const handleClose = () => {
  playSound('close');
  setIsOpen(false);
};
```

### Xbox Card Interaction
```tsx
const handleCardClick = () => {
  playSound('select');
  // Wait for sound to play
  setTimeout(() => {
    navigateWithSound('/destination', 'navigation');
  }, 100);
};
```

## Error Handling

### Component Error Boundaries
For critical components, consider error boundaries:
```tsx
'use client';

class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error) {
    console.error('Component error:', error);
  }
  
  render() {
    return this.props.children;
  }
}
```

### Graceful Degradation
```tsx
// Audio fails gracefully if not supported
const { playSound } = useAudioManager();

const handleClick = () => {
  try {
    playSound('click');
  } catch {
    // Silent fail - don't break user experience
  }
  
  // Continue with main logic
  handleNavigation();
};
```

## Accessibility (A11Y)

While this is a stylized Xbox UI, maintain basic accessibility:
- Use semantic HTML (`<button>`, `<nav>`, etc.)
- Provide `aria-label` for icon-only buttons
- Keyboard navigation support via `useKeyboardNavigation` hook
- Sufficient color contrast (test with browser devtools)

## Questions to Ask Before Starting

When receiving a task:
1. Is this a new component or modifying existing?
2. Does it need audio feedback? (almost always yes)
3. Should it have a Storybook story?
4. Is it mobile-responsive or desktop-only?
5. Does it interact with existing contexts?
6. Any performance concerns (lists, animations, etc.)?

## Final Reminders

✅ **DO:**
- Use existing hooks and contexts
- Follow CSS Module pattern
- Add audio feedback to interactions
- Write TypeScript interfaces
- Test responsiveness
- Document complex logic
- Ask before adding dependencies

❌ **DON'T:**
- Add console.log statements
- Install packages without approval
- Use inline styles (use CSS Modules)
- Ignore TypeScript errors
- Skip audio integration
- Break the Xbox aesthetic
- Start the dev server unless explicitly asked

---

*Remember: This is an immersive Xbox 360 experience. Every interaction should feel authentic with proper sound feedback and smooth animations.*
