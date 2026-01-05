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

## Xbox Card Interaction

```tsx
const handleCardClick = () => {
  playSound('select');
  setTimeout(() => {
    navigateWithSound('/destination', 'navigation');
  }, 100);
};
```

## Responsive Detection

```tsx
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

return isMobile ? <MobileVersion /> : <DesktopVersion />;
```

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
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error) {
    console.error('Component error:', error);
  }
  render() {
    return this.props.children;
  }
}
```

## Performance Patterns

- Use `React.memo()` for components in lists
- Lazy load with `next/dynamic`
- Optimize images via `next/image`
- Avoid inline arrow functions in JSX props