# Feature Planning Template

Use this structure for the Linear design document (project `personal_web`):

---

```markdown
# Feature: [Feature Name]

**Date**: YYYY-MM-DD
**Status**: Planning | In Progress | Completed
**Type**: Frontend | Backend | Full-Stack

## Objective

[Clear description of what needs to be built and why]

**User Story**: As a [user type], I want to [action] so that [benefit].

## Technical Approach

### Architecture Decisions
- [Decision 1 and rationale]
- [Decision 2 and rationale]

### Components to Create/Modify
| Component | Action | Purpose |
|-----------|--------|---------|
| ComponentName | Create | [Purpose] |
| ExistingComponent | Modify | [What changes] |

### API Endpoints (if applicable)
| Endpoint | Type | Auth | Purpose |
|----------|------|------|---------|
| feature.getAll | Query | Public | [Purpose] |
| feature.create | Mutation | Protected | [Purpose] |

### Database Changes (if applicable)
- [ ] New model needed
- [ ] Schema migration required
- [ ] Indexes to add

## Implementation Steps

### Phase 1: [Name]
1. [ ] Step 1 - `src/path/to/file.tsx`
2. [ ] Step 2 - `src/path/to/file.ts`

### Phase 2: [Name]
3. [ ] Step 3 - `src/path/to/file.tsx`
4. [ ] Step 4 - `src/path/to/file.module.css`

## Xbox Integration

### Audio Feedback
| Interaction | Sound Type |
|-------------|------------|
| [Action] | [Sound] |

### Animations
- Hover: 0.3s ease
- Transitions: 0.5s ease
- [Specific animation notes]

### Responsive Behavior
- **Desktop (>768px)**: [Behavior]
- **Mobile (<=768px)**: [Behavior]

## Testing Strategy

### Automated Tests
- [ ] Unit tests for [component/function]
- [ ] Integration tests for [feature]

### Manual Testing Checklist
- [ ] Audio plays correctly
- [ ] Responsive at 768px breakpoint
- [ ] Keyboard navigation works
- [ ] Error states handled
- [ ] Loading states shown

## Security Considerations

- [ ] Input validation with Zod
- [ ] Auth checks on protected routes
- [ ] Resource ownership verification
- [ ] No sensitive data exposure

## Performance Considerations

- [ ] React.memo for list items
- [ ] Lazy loading if needed
- [ ] Database query optimization
- [ ] Bundle size impact

## Dependencies

- [ ] No new dependencies required
- OR
- [ ] Dependency approval needed: `package-name@version`
  - Purpose: [why needed]
  - Alternatives checked: [what you tried]

## Success Criteria

- [ ] Feature works as described
- [ ] TypeScript compiles without errors
- [ ] No console.log statements
- [ ] Audio integration complete
- [ ] Responsive design verified
- [ ] Documentation created

## Open Questions

1. [Question needing clarification]
2. [Decision pending user input]

---

**Approved by**: [User approval note]
**Implementation started**: [Date]
```

---

## Completion Documentation Template

After implementation, create `.github/documentation/feature-name-complete.md`:

```markdown
# Feature: [Name] - Completed

**Date**: YYYY-MM-DD
**Design record**: Linear document · **Issue**: SOR-XXX

## Summary

[Brief description of what was built]

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `src/path/file.tsx` | Created | [What it does] |
| `src/path/file.ts` | Modified | [What changed] |

## API Endpoints (if applicable)

### `api.feature.getAll`
- **Type**: Query
- **Auth**: Public
- **Returns**: `Feature[]`

### `api.feature.create`
- **Type**: Mutation
- **Auth**: Protected
- **Input**: `{ title: string }`
- **Returns**: `Feature`

## Usage Examples

```tsx
// Example component usage
import FeatureComponent from '@/components/FeatureComponent';

<FeatureComponent title="Example" onClick={handleClick} />
```

```tsx
// Example API usage
const { data } = api.feature.getAll.useQuery();
```

## Testing Completed

- [x] TypeScript compilation
- [x] Audio integration verified
- [x] Responsive design at 768px
- [x] Error handling tested
- [x] Manual QA in browser

## Known Limitations

- [Limitation 1]
- [Edge case not handled]

## Future Enhancements

- [Potential improvement 1]
- [Feature that could be added]
```