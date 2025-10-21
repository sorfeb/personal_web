# Documentation Template

Use this template when documenting completed features. Copy and rename to match your feature name.

---

# Feature: [Feature Name] - Completed ✅
**Completion Date**: YYYY-MM-DD  
**Implementation Date**: YYYY-MM-DD  
**Agent**: Frontend | Backend | Full-Stack  
**Related Plan**: `.github/plans/[plan-name].md`

## Summary
[Brief overview of what was built and its purpose]

## What Was Built

### Components Created
- **`ComponentName`** (`src/components/ComponentName/`)
  - Purpose: [What it does]
  - Props: [Key props interface]
  - Audio: [Sound types integrated]
  - Responsive: [Mobile/desktop behavior]

### API Endpoints Created
- **`api.feature.endpoint`**
  - Type: Query | Mutation
  - Auth: Public | Protected
  - Input: [Zod schema summary]
  - Output: [Return type]
  - Purpose: [What it does]

### Database Changes
- **Model**: `ModelName` (`prisma/schema.prisma`)
  - Fields added: [List fields]
  - Relations: [List relations]
  - Indexes: [List indexes]
  - Migration: `[migration-name]`

## Files Changed

### Created
```
src/
├── app/[route]/page.tsx
├── components/[ComponentName]/
│   ├── [ComponentName].tsx
│   ├── [ComponentName].module.css
│   └── [ComponentName].stories.tsx
├── server/routers/[name].ts
└── hooks/[useCustomHook].ts
```

### Modified
- `src/server/index.ts` - Added router to appRouter
- `src/app/layout.tsx` - [What changed]
- `src/data/[datafile].ts` - [What changed]

### Detailed Changes
- **`src/components/ComponentName/ComponentName.tsx`**
  - Created main component with TypeScript interface
  - Integrated `useAudioManager` for sound feedback
  - Added responsive logic for mobile/desktop
  - Memoized with `React.memo()` for performance

- **`src/server/routers/feature.ts`**
  - Created tRPC router with [N] procedures
  - Added Zod validation schemas
  - Implemented authentication checks
  - Optimized database queries

## API Documentation

### Queries

#### `api.feature.getAll`
```typescript
// Purpose: Retrieve all feature items
// Auth: Public
// Input: None
// Output: Feature[]

const { data, isLoading } = api.feature.getAll.useQuery();
```

#### `api.feature.getById`
```typescript
// Purpose: Retrieve single feature by ID
// Auth: Public
// Input: { id: string }
// Output: Feature | null

const { data } = api.feature.getById.useQuery({ 
  id: 'feature-id' 
});
```

### Mutations

#### `api.feature.create`
```typescript
// Purpose: Create new feature item
// Auth: Protected (requires authentication)
// Input: { title: string, content: string }
// Output: Feature

const createMutation = api.feature.create.useMutation({
  onSuccess: () => {
    utils.feature.getAll.invalidate();
  },
});

createMutation.mutate({
  title: 'Feature Title',
  content: 'Feature content...',
});
```

## Component Usage Examples

### Basic Usage
```tsx
import { ComponentName } from '@/components/ComponentName/ComponentName';

export default function Page() {
  return (
    <ComponentName
      title="Example"
      onClick={() => console.log('clicked')}
    />
  );
}
```

### With tRPC Integration
```tsx
'use client';

import { api } from '@/utils/trpc';
import { ComponentName } from '@/components/ComponentName/ComponentName';

export default function Page() {
  const { data, isLoading } = api.feature.getAll.useQuery();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <>
      {data?.map(item => (
        <ComponentName key={item.id} {...item} />
      ))}
    </>
  );
}
```

### Advanced Usage (with audio & navigation)
```tsx
'use client';

import { useAudioManager } from '@/hooks/useAudioManager';
import { useNavigationSound } from '@/hooks/useNavigationSound';
import { ComponentName } from '@/components/ComponentName/ComponentName';

export default function Page() {
  const { playSound } = useAudioManager();
  const { navigateWithSound } = useNavigationSound();
  
  const handleClick = () => {
    playSound('select');
    setTimeout(() => {
      navigateWithSound('/destination', 'navigation');
    }, 100);
  };
  
  return <ComponentName onClick={handleClick} />;
}
```

## Storybook Stories

View component variants in Storybook:
```bash
npm run storybook
# Navigate to: Components/ComponentName
```

Available stories:
- Default
- With Loading State
- With Error State
- Mobile View
- [Other variants]

## Database Schema

### Model Definition
```prisma
model Feature {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  title     String   @db.VarChar(255)
  content   String   @db.Text
  
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@map("features")
}
```

### Migration Applied
```bash
npx prisma migrate dev --name add_feature_model
```

## Verification Completed

### Pre-Completion Checklist
- [x] TypeScript compiles without errors (`npm run compile`)
- [x] ESLint passes (`npm run lint`)
- [x] Audio integration works on all interactive elements
- [x] Responsive design verified at 768px breakpoint
- [x] Storybook story displays correctly
- [x] No console.log statements in production code
- [x] Input validation with Zod on all API endpoints
- [x] Error handling with proper TRPCError codes
- [x] Authentication/authorization checks implemented
- [x] Database queries optimized

### Manual Verification Results
- ✅ Component renders correctly in browser
- ✅ API endpoints return expected data (verified in devtools)
- ✅ Audio feedback plays on interactions
- ✅ Mobile responsive (≤768px) - verified by browser resize
- ✅ Desktop layout (>768px) - verified in browser
- ✅ Keyboard navigation works (if applicable)
- ✅ Loading states display properly
- ✅ Error states handled gracefully
- ✅ No console errors or warnings

## Performance Metrics

### Frontend
- Component memoization: [Yes/No]
- Lazy loading: [Yes/No]
- Bundle size impact: [+X KB]
- Render performance: [Notes]

### Backend
- Query optimization: [What was optimized]
- Average response time: [Xms]
- Database indexes: [List indexes added]
- Caching strategy: [React Query config]

## Known Limitations

### Current Limitations
- [Limitation 1 with explanation]
- [Limitation 2 with explanation]

### Edge Cases
- [Edge case 1 and how it's handled]
- [Edge case 2 and how it's handled]

## Future Enhancements

### Planned Improvements
- [ ] Enhancement 1
- [ ] Enhancement 2
- [ ] Enhancement 3

### Technical Debt
- [Any shortcuts taken that should be revisited]

## Security Audit

### Security Measures Implemented
- ✅ Input validation with Zod
- ✅ Authentication checks on protected routes
- ✅ Authorization checks for resource access
- ✅ SQL injection prevention (via Prisma)
- ✅ XSS prevention (sanitized inputs)
- ✅ No sensitive data in client logs

### Security Considerations
- [Any security notes or warnings]

## Dependencies Added
⚠️ **None** (preferred)

OR (if approved by user):
- `package-name@version` - [Justification and security audit results]

## Migration Guide

### For Other Developers
To use this feature:
1. Pull latest code
2. Run `npm install` (if dependencies added)
3. Run `npx prisma generate` (for database changes)
4. Run `npx prisma migrate dev` (apply migrations)
5. Restart dev server

### Breaking Changes
- [None] OR [List breaking changes]

## Troubleshooting

### Common Issues

**Issue**: Component not rendering
- **Solution**: Check that `'use client'` directive is present

**Issue**: Audio not playing
- **Solution**: Verify `VolumeProvider` wraps the component tree

**Issue**: tRPC error
- **Solution**: Check Zod schema validation and error messages

## Related Documentation
- Original Plan: `.github/plans/[plan-name].md`
- Component Storybook: `src/components/ComponentName/ComponentName.stories.tsx`
- API Router: `src/server/routers/[name].ts`
- Database Schema: `prisma/schema.prisma`

## Maintainer Notes
[Any additional context for future maintainers]

---

**Feature Status**: ✅ Complete and Deployed  
**Last Updated**: YYYY-MM-DD
