# useEffect Replacement Patterns

Complete catalog of patterns to replace useEffect with better alternatives.

## Pattern 1: Derived State

### Problem
Using useEffect to compute values from other values.

```typescript
// BAD - Derived state via effect
const [fullName, setFullName] = useState('');

useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

### Solution
Compute inline or use useMemo.

```typescript
// GOOD - Compute inline
const fullName = `${firstName} ${lastName}`;

// GOOD - Memoize expensive computations
const sortedItems = useMemo(
  () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);
```

---

## Pattern 2: Data Fetching

### Problem
Fetching data inside useEffect.

```typescript
// BAD - Manual fetch in effect
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, [userId]);
```

### Solution
Use TanStack Query (already installed).

```typescript
// GOOD - TanStack Query
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetch(`/api/users/${userId}`).then(res => res.json()),
  enabled: !!userId,
});
```

### tRPC Integration

```typescript
// GOOD - tRPC with callback
const { data: tracks } = trpc.spotify.getPlaylistTracks.useQuery(
  { playlistId },
  {
    enabled: !!playlistId,
    onSuccess: (data) => {
      if (data.length > 0) {
        setCurrentPlaylist(data);
        showPlayer();
      }
    },
  }
);
```

---

## Pattern 3: Event Handler Actions

### Problem
Triggering actions via state flags.

```typescript
// BAD - Flag-based effect
const [shouldNavigate, setShouldNavigate] = useState(false);

useEffect(() => {
  if (shouldNavigate) {
    router.push('/dashboard');
    setShouldNavigate(false);
  }
}, [shouldNavigate, router]);

const handleSubmit = () => {
  // ... validation
  setShouldNavigate(true);
};
```

### Solution
Call actions directly in event handlers.

```typescript
// GOOD - Direct action
const handleSubmit = () => {
  // ... validation
  router.push('/dashboard');
};
```

---

## Pattern 4: Reset State on Prop Change

### Problem
Resetting form/state when an ID changes.

```typescript
// BAD - Effect to reset state
const [formData, setFormData] = useState(initialValues);

useEffect(() => {
  setFormData(initialValues);
}, [userId]);
```

### Solution
Use key prop to remount component.

```typescript
// GOOD - Key prop remounts component
<UserForm key={userId} userId={userId} />
```

This causes the component to unmount and remount when `userId` changes, naturally resetting all state.

---

## Pattern 5: Mount-Only Effects

### Problem
Running code once on mount.

```typescript
// BAD - Raw useEffect
useEffect(() => {
  console.log('Component mounted');
  loadInitialData();
}, []);
```

### Solution
Use useMountEffect hook.

```typescript
// GOOD - Named hook
import { useMountEffect } from '@/hooks';

useMountEffect(() => {
  console.log('Component mounted');
  loadInitialData();
});
```

---

## Pattern 6: Event Listeners

### Problem
Adding event listeners with cleanup.

```typescript
// BAD - Manual event listener management
useEffect(() => {
  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### Solution
Use useEventListener hook.

```typescript
// GOOD - Declarative event listener
import { useEventListener } from '@/hooks';

const [width, setWidth] = useState(window.innerWidth);

useEventListener(window, 'resize', () => {
  setWidth(window.innerWidth);
});
```

---

## Pattern 7: Intervals

### Problem
Setting up intervals with cleanup.

```typescript
// BAD - Manual interval management
useEffect(() => {
  const interval = setInterval(() => {
    setTime(Date.now());
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

### Solution
Use useInterval hook.

```typescript
// GOOD - Declarative interval
import { useInterval } from '@/hooks';

const [time, setTime] = useState(Date.now());

useInterval(() => {
  setTime(Date.now());
}, 1000);
```

---

## Pattern 8: Timeouts

### Problem
Setting timeouts with cleanup.

```typescript
// BAD - Manual timeout management
useEffect(() => {
  const timeout = setTimeout(() => {
    setVisible(false);
  }, 3000);

  return () => clearTimeout(timeout);
}, []);
```

### Solution
Use useTimeout hook.

```typescript
// GOOD - Declarative timeout
import { useTimeout } from '@/hooks';

const [visible, setVisible] = useState(true);

useTimeout(() => {
  setVisible(false);
}, 3000);
```

---

## Pattern 9: Client-Side Only Rendering

### Problem
Avoiding SSR hydration mismatches.

```typescript
// BAD - Manual mounted state
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) {
  return null;
}
```

### Solution
Use useIsMounted hook.

```typescript
// GOOD - Named hook
import { useIsMounted } from '@/hooks';

const isMounted = useIsMounted();

if (!isMounted) {
  return null;
}
```

---

## Pattern 10: Conditional Event Listeners

### Problem
Adding/removing listeners based on state.

```typescript
// BAD - Conditional listener in effect
useEffect(() => {
  if (!isDragging) return;

  const handleMouseMove = (e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  window.addEventListener('mousemove', handleMouseMove);
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, [isDragging]);
```

### Solution
Use useEventListener with null check or condition in callback.

```typescript
// GOOD - Conditional via callback
import { useEventListener } from '@/hooks';

useEventListener(window, 'mousemove', (e) => {
  if (!isDragging) return;
  setPosition({ x: e.clientX, y: e.clientY });
});
```

Or use a ref to track the condition:

```typescript
const isDraggingRef = useRef(isDragging);
isDraggingRef.current = isDragging;

useEventListener(window, 'mousemove', (e) => {
  if (!isDraggingRef.current) return;
  setPosition({ x: e.clientX, y: e.clientY });
});
```
