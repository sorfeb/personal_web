# Data Colocation

## Problem

Blog content is fetched at runtime from Medium's RSS feed via a tRPC endpoint. This introduces:

- A runtime dependency on Medium's availability
- Latency on every page load
- No control over content formatting or metadata
- Can't add custom fields (cover images, tags, reading time)

Static data lives in `src/data/*.json` files, which works well for structured data but doesn't support rich content.

## Recommendation

### Blog Posts: Use MDX

Replace the Medium RSS dependency with local MDX files. Next.js has built-in MDX support.

```
src/
  content/
    blog/
      building-soros.mdx
      xbox-dashboard-css.mdx
  data/
    projects.json        ← keep as-is
    certifications.json  ← keep as-is
```

Each MDX file includes frontmatter for metadata:

```mdx
---
title: "Building sorOS"
date: "2025-06-15"
description: "How I built an Xbox 360 dashboard replica with Next.js"
coverImage: "/assets/blog/building-soros.jpg"
tags: ["nextjs", "css", "portfolio"]
---

Article content with **rich formatting**, code blocks, and embedded components.
```

Benefits:
- **Full control** over content and formatting
- **No runtime dependency** — content is compiled at build time
- **Type-safe frontmatter** with a Zod schema
- **Custom components** embeddable in posts (demos, interactive examples)
- **Better SEO** — each post can have its own metadata, JSON-LD, and OG image

### Structured Data: Keep JSON

`projects.json`, `certifications.json`, and similar files work well as-is. Consider adding a light Zod validation layer to catch schema issues at build time:

```tsx
import { z } from 'zod';
import projectsRaw from '../data/projects.json';

const ProjectSchema = z.object({
  projectName: z.string(),
  role: z.string(),
  date: z.string(),
  description: z.string(),
  keyTechnologies: z.array(z.string()),
});

export const projects = z.array(ProjectSchema).parse(projectsRaw);
```

## Migration Strategy

1. Install `@next/mdx` and configure `next.config.js`
2. Export existing Medium posts as MDX files
3. Create a `src/content/blog/` directory with frontmatter schema
4. Build a `getAllPosts()` utility that reads and sorts MDX files
5. Keep the Medium tRPC endpoint temporarily as a fallback
6. Remove the Medium dependency once content is migrated
