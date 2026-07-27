'use client';

import { useEventListener } from '@/hooks';

/**
 * Site-wide guard that blocks native image ghost-dragging at the root,
 * so every current and future image is undraggable by default.
 *
 * The `img` rules in globals.css handle Blink/WebKit via
 * `-webkit-user-drag`; this listener covers Firefox (which has no
 * equivalent CSS) without per-component `draggable={false}` props.
 * Renders nothing — mounted once in the root layout.
 */
const ImageDragGuard = () => {
  useEventListener(
    typeof document === 'undefined' ? null : document,
    'dragstart',
    (event) => {
      if (event.target instanceof HTMLImageElement) {
        event.preventDefault();
      }
    }
  );

  return null;
};

export default ImageDragGuard;
