# Component Structure

## Current State

The codebase already uses some good patterns:
- CSS Modules for scoped styling
- `PageLayout` compound component (`PageLayout.Header`, `PageLayout.Body`)
- `React.memo` for performance-critical components

## Recommendations

### Lean Into Compound Components

The `PageLayout` pattern is good — extend it to other complex components:

```tsx
// Example: ProjectCard compound component
<ProjectCard>
  <ProjectCard.Header title="sorOS" date="2025" />
  <ProjectCard.Tech items={['Next.js', 'tRPC', 'Prisma']} />
  <ProjectCard.Description>
    Xbox 360-inspired portfolio website.
  </ProjectCard.Description>
  <ProjectCard.Links github="..." live="..." />
</ProjectCard>
```

This is more flexible than a single component with 10+ props and makes the markup self-documenting.

### Skip Storybook (Unless Actively Used)

Storybook adds maintenance overhead:
- Stories go stale when components change
- Extra dev dependency and config to maintain
- Build time increases

For a personal portfolio, **use the actual pages as your component playground**. The existing `/design-system` page already serves this purpose. Keep Storybook only if you're actively using it during development.

### File Structure

Keep the current flat component structure but be consistent:

```
src/components/
  PageLayout/
    PageLayout.tsx
    PageLayout.module.css
    index.ts              ← re-export for clean imports
  ProjectCard/
    ProjectCard.tsx
    ProjectCard.module.css
    ProjectCard.test.tsx  ← only if the component has complex logic
    index.ts
```

### Avoid Over-Abstraction

Don't create wrapper components unless they're used in 3+ places. Three similar lines of JSX is better than a premature `<IconLabel>` abstraction.
