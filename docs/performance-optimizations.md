# Performance Optimizations

## Dynamic Imports for Heavy Pages

Some pages load large dependencies that aren't needed on initial navigation. Use `next/dynamic` to code-split them:

```tsx
// src/app/design-system/page.tsx
import dynamic from 'next/dynamic';

const ColorTab = dynamic(() => import('./tabs/ColorTab'), {
  loading: () => <TabSkeleton />,
});

const TypographyTab = dynamic(() => import('./tabs/TypographyTab'), {
  loading: () => <TabSkeleton />,
});
```

Priority candidates for dynamic imports:
- `/design-system` — multiple heavy tab components
- `/media` — Cloudinary image gallery
- `/photos` — Cloudinary image gallery
- `/chatroom` — real-time chat dependencies

## CRT Overlay Performance

The CRT scanline/filter overlay uses an SVG filter that is expensive to render, especially on mobile devices and low-powered hardware.

### Current Issue

The CRT overlay applies to the entire viewport on all devices, causing:
- Dropped frames on mobile
- High GPU usage on low-end devices
- Battery drain

### Recommended Fix

Disable the CRT filter on mobile via CSS rather than JavaScript to avoid layout shift:

```css
/* CRTOverlay.module.css */
.overlay {
  /* existing CRT styles */
}

@media (max-width: 768px) {
  .overlay {
    display: none;
  }
}
```

Or reduce the effect intensity on mobile instead of removing it entirely:

```css
@media (max-width: 768px) {
  .overlay {
    opacity: 0.3;
    /* disable the expensive SVG filter, keep just the scanlines */
    filter: none;
  }
}
```

## Image Optimization

The site already uses `next-cloudinary` (`CldImage`) for photos and media, which handles optimization well. For any remaining standard images:

- Use `next/image` for local assets that need sizing/format optimization
- Add `loading="lazy"` to below-the-fold images (Next.js Image does this by default)
- Use `priority` prop on above-the-fold hero images

## Bundle Analysis

Run the Next.js bundle analyzer periodically to catch regressions:

```bash
npm install --save-dev @next/bundle-analyzer
```

```js
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

```bash
ANALYZE=true npm run build
```
