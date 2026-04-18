---
name: no-useeffect
description: React useEffect policy banning direct useEffect in components. Use when writing React components, reviewing useEffect usage, or implementing side effects. Triggers on useEffect, useMountEffect, side effects, lifecycle.
---

# React useEffect Policy — No Direct useEffect

Direct `useEffect` calls are banned in component and page files. Most useEffect usage compensates for something React already provides better primitives for.

## Approved Escape Hatches

1. **`useMountEffect()`** — for one-time external sync on mount
2. **Custom hooks** — `useEffect` inside purpose-built hooks (`useMediaQuery`, `useDocumentTitle`, etc.)
3. **Tagged legacy** — add `// effect:audited — <reason>` comment

## Five Replacement Patterns

| Instead of... | Do this |
|---------------|---------|
| `useEffect(() => setX(deriveFromY(y)), [y])` | Compute inline: `const x = deriveFromY(y)` or `useMemo` |
| `useEffect(() => { fetch(url).then(setData) }, [url])` | `useQuery` (TanStack Query) — handles caching, cancellation |
| `useEffect(() => { if (flag) { doAction(); setFlag(false) } }, [flag])` | Call `doAction()` directly in the event handler |
| `useEffect(() => { setLocalState(initialValue) }, [propId])` | Use `key={propId}` on component to force remount |
| `useEffect(() => { loadWidget(); return () => destroyWidget() }, [])` | `useMountEffect(() => { loadWidget(); return () => destroyWidget() })` |

## Available Hooks

```typescript
// Mount-only effects
import { useMountEffect } from '@/hooks';
useMountEffect(() => {
  console.log('Mounted');
  return () => console.log('Unmounted');
});

// Client-side mount guard
import { useIsMounted } from '@/hooks';
const isMounted = useIsMounted();
if (!isMounted) return null;

// Declarative intervals
import { useInterval } from '@/hooks';
useInterval(() => setTime(Date.now()), 1000);

// Declarative timeouts
import { useTimeout } from '@/hooks';
useTimeout(() => setVisible(false), 3000);

// Declarative event listeners
import { useEventListener } from '@/hooks';
useEventListener(window, 'resize', handleResize);
```

## Smell Tests — Refactor If You See

- `useEffect(() => setX(...), [y])` — derived state, compute inline
- State that only mirrors other state or props — remove it
- `fetch()` + `setState()` inside an effect — use `useQuery`
- "set flag → effect runs → reset flag" choreography — call from event handler
- Effect resetting state when an ID/prop changes — use `key`
- Dependency arrays longer than 3 items — decompose

## Enforcement

```bash
# CI check
npm run lint:useeffect
```

Every `useEffect` in `src/components/**` and `src/app/**` must be either refactored or tagged:

```typescript
// effect:audited — Complex jQuery integration
useEffect(() => { ... }, [...]);
```

Custom hooks in `src/hooks/` are exempt.

## Detailed References

- [references/patterns.md](references/patterns.md) — Complete pattern catalog with examples
- [references/hooks-api.md](references/hooks-api.md) — Full hook implementations
