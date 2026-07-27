# Hook Implementations

Hook implementations for useMountEffect, useIsMounted, useInterval, useTimeout, useEventListener, useAutoScroll

```typescript
// src/hooks/useMountEffect.ts
import { useEffect, EffectCallback } from 'react';

/**
 * Run an effect only once on mount (with cleanup support).
 * Replaces useEffect(() => { ... }, []) for mount-only effects.
 */
export function useMountEffect(effect: EffectCallback): void {
  useEffect(effect, []);
}

// src/hooks/useIsMounted.ts
import { useState } from 'react';
import { useMountEffect } from './useMountEffect';

/**
 * Track if the component is mounted on the client.
 * Replaces the common [mounted, setMounted] = useState(false) pattern.
 */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useMountEffect(() => {
    setMounted(true);
  });

  return mounted;
}

// src/hooks/useInterval.ts
import { useEffect, useRef } from 'react';

/**
 * Declarative interval hook with proper cleanup.
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// src/hooks/useTimeout.ts
import { useEffect, useRef } from 'react';

/**
 * Declarative timeout hook with proper cleanup.
 */
export function useTimeout(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}

// src/hooks/useEventListener.ts
import { useEffect, useRef, RefObject } from 'react';

type EventListenerTarget = Window | Document | HTMLElement | null;

/**
 * Declarative event listener with automatic cleanup.
 */
export function useEventListener<K extends keyof WindowEventMap>(
  target: Window | null,
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
 void): void;

export function useEventListener<K extends keyof DocumentEventMap>(
  target: Document | null,
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
 void): void;

export function useEventListener<K extends keyof HTMLElementEventMap>(
  target: RefObject<HTMLElement | null> | HTMLElement | null,
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
 void): void;

export function useEventListener(
  target: EventListenerTarget | RefObject<HTMLElement | null>,
  eventName: string,
  handler: (event: Event) => void,
  options?: boolean | AddEventListenerOptions
 void): void {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const element = target && 'current' in target ? target.current : target;
    if (!element) return;

    const listener: typeof handler = (event) => savedHandler.current(event);
    element.addEventListener(eventName, listener, options);

    return () => element.removeEventListener(eventName, listener, options);
  }, [target, eventName, options]);
}

// src/hooks/useAutoScroll.ts
import { useEffect, RefObject } from 'react';

/**
 * Auto-scroll an element when dependencies change.
 */
export function useAutoScroll<T extends HTMLElement>(
  ref: RefObject<T | null>,
  deps: unknown[],
  behavior: ScrollBehavior = 'smooth'
 void): void {
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
