import { useEffect, useRef, RefObject } from 'react';

type EventListenerTarget = Window | Document | HTMLElement | null;

export function useEventListener<K extends keyof WindowEventMap>(
  target: Window | null,
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): void;

export function useEventListener<K extends keyof DocumentEventMap>(
  target: Document | null,
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): void;

export function useEventListener<K extends keyof HTMLElementEventMap>(
  target: RefObject<HTMLElement | null> | HTMLElement | null,
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): void;

/**
 * Declarative event listener with automatic cleanup.
 * Accepts a Window, Document, HTMLElement, or a ref to an HTMLElement.
 * Pass `target = null` to disable.
 */
export function useEventListener(
  target: EventListenerTarget | RefObject<HTMLElement | null>,
  eventName: string,
  handler: (event: Event) => void,
  options?: boolean | AddEventListenerOptions,
): void {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    let element: EventTarget | null = null;
    if (target && typeof target === 'object' && 'current' in target) {
      element = target.current;
    } else {
      element = target as EventTarget | null;
    }
    if (!element) return;

    const listener = (event: Event) => savedHandler.current(event);
    element.addEventListener(eventName, listener, options);

    return () => element.removeEventListener(eventName, listener, options);
  }, [target, eventName, options]);
}
