# Frontend Component Patterns

## File Organization

```
src/components/ComponentName/
├── ComponentName.tsx          # Main component (PascalCase)
├── ComponentName.module.css   # Scoped CSS
├── ComponentName.stories.tsx  # Storybook story
├── index.ts                   # Barrel export
└── ComponentName.types.ts     # Optional: Types
```

## Modal/Dialog Pattern

Sound names must come from `AUDIO_FILES` in `src/hooks/useAudioManager.ts`. There is no
`'open'`, `'close'` or `'select'` sound.

```tsx
const [isOpen, setIsOpen] = useState(false);

const handleOpen = () => {
  playSound('unfold');
  setIsOpen(true);
};

const handleClose = () => {
  playSound('back');
  setIsOpen(false);
};
```

A modal pushes a gamepad scope. Register it with `useGamepadScope` rather than adding a
`window.addEventListener('keydown')` handler; a scope on top of the stack swallows intents
for everything beneath it.

## Xbox Card Interaction

```tsx
const handleCardClick = () => {
  navigateWithSound('/destination', 'navigation');
};
```

`navigateWithSound` already plays the sound and routes. Do not stack a second `playSound` call
in front of it, and do not `setTimeout` before navigating.

## Responsive Detection

Prefer a CSS media query (`@media (width <= 768px)`) when only styling differs. Read
`window.innerWidth` only when the two branches render different DOM or run different logic,
and guard for SSR.

```tsx
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

return isMobile ? <MobileVersion /> : <DesktopVersion />;
```

Gamepad support is desktop-layout only, matching this same gate.

## Data Fetching

```tsx
// Static data
import { projects } from '@/data/projects.json';

// Dynamic via tRPC
import { api } from '@/utils/trpc';
const { data, isLoading } = api.blog.getPosts.useQuery();
```

## Error Boundary

```tsx
class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
```

Render a fallback rather than swallowing the error into a log. `CLAUDE.md` bans debug logging.

## Performance Patterns

- Use `React.memo()` for components in lists
- Lazy load with `next/dynamic`
- Optimize images via `next/image`
- Avoid inline arrow functions in JSX props

## Styling

Load the `styling-ui` skill before writing `.module.css`. Reuse `src/components/ui/` primitives
(`Button`, `Toggle`, `Tooltip`, `Clock`) instead of hand-rolling interactive elements.