> **SUPERSEDED — do not consult or update.**
> This file is from the GitHub Copilot era. This project is now developed with agentic
> CLIs (Claude Code, opencode). The canonical guide is [`/CLAUDE.md`](../CLAUDE.md) and
> domain guidance lives in `.claude/skills/`. Kept for history only.

# Quick Reference: Agent Instructions

## 🚀 Quick Start

### Starting a New Feature
```bash
# 1. Create planning document
cp .github/plans/TEMPLATE.md .github/plans/my-feature-plan.md

# 2. Tell AI agent:
"Using the Frontend Agent, implement the feature according to .github/plans/my-feature-plan.md"

# 3. After completion, document:
cp .github/documentation/TEMPLATE.md .github/documentation/my-feature-complete.md
```

## 🎯 Agent Selection Guide

| I need to... | Use this agent | Prompt example |
|--------------|----------------|----------------|
| Build a React component | Frontend Agent | "Using the Frontend Agent, create a ProfileCard component with audio feedback" |
| Create an API endpoint | Backend Agent | "Using the Backend Agent, add a tRPC router for blog posts with Zod validation" |
| Full-stack feature | Both agents | "Using both agents, implement a chat feature with WebSocket backend and React UI" |
| Plan a feature | Main instructions | "Help me plan a new photo gallery feature - create a planning document" |
| General architecture question | Main instructions | "What's the best approach for adding authentication to this page?" |

## ⚠️ Critical Rules (ALWAYS ENFORCE)

### 1. Dev Server
```bash
❌ NEVER: npm run dev (unless user explicitly asks)
✅ User runs dev server locally
```

### 2. Dependencies
```bash
❌ NEVER: npm install <package> (without approval)
✅ ALWAYS: Ask user first with security justification
```

### 3. Console Logging
```typescript
❌ FORBIDDEN: console.log('debugging...') 
⚠️ RARE: console.error('Critical error:', err)
✅ PREFERRED: throw new TRPCError({ code: 'NOT_FOUND' })
```

## 📁 Documentation Structure

```
.github/
├── plans/              ← Feature planning (BEFORE coding)
│   ├── TEMPLATE.md
│   └── feature-name-plan.md
│
└── documentation/      ← Feature completion (AFTER coding)
    ├── TEMPLATE.md
    └── feature-name-complete.md
```

## ✅ Pre-Completion Checklist

Copy this to every task:

```markdown
- [ ] TypeScript compiles (`npm run compile`)
- [ ] No console.log statements
- [ ] Audio integration (if frontend)
- [ ] Input validation (if backend)
- [ ] Error handling
- [ ] Responsive design verified in browser
- [ ] Planning doc created
- [ ] Completion doc created
- [ ] No unauthorized dependencies
- [ ] Feature verified in dev environment
```

## 🎨 Frontend Quick Patterns

### Audio Integration
```tsx
import { useAudioManager } from '@/hooks/useAudioManager';

const Component = () => {
  const { playSound } = useAudioManager();
  
  const handleClick = () => {
    playSound('click'); // or 'hover', 'navigation', etc.
    // ... rest of logic
  };
};
```

### Navigation with Sound
```tsx
import { useNavigationSound } from '@/hooks/useNavigationSound';

const Component = () => {
  const { navigateWithSound } = useNavigationSound();
  
  const handleNav = () => {
    navigateWithSound('/path', 'navigation');
  };
};
```

### Responsive Pattern
```tsx
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

return isMobile ? <MobileView /> : <DesktopView />;
```

### CSS Module Pattern
```css
/* Component.module.css */
.container {
  /* Layout first */
  display: flex;
  
  /* Dimensions */
  width: 100%;
  
  /* Visual */
  background: var(--color);
  
  /* Transitions last */
  transition: all 0.3s ease;
}
```

## 🔧 Backend Quick Patterns

### tRPC Router
```typescript
import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from '../trpc';

export const featureRouter = router({
  // Public query
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.feature.findMany();
    }),
  
  // Protected mutation with validation
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.feature.create({
        data: { ...input, userId: ctx.session.user.id },
      });
    }),
});
```

### Error Handling
```typescript
import { TRPCError } from '@trpc/server';

// NOT_FOUND (404)
throw new TRPCError({
  code: 'NOT_FOUND',
  message: 'Resource not found',
});

// UNAUTHORIZED (401)
throw new TRPCError({
  code: 'UNAUTHORIZED',
  message: 'Authentication required',
});

// FORBIDDEN (403)
throw new TRPCError({
  code: 'FORBIDDEN',
  message: 'Insufficient permissions',
});
```

### Query Optimization
```typescript
// ✅ Select only needed fields
const items = await ctx.db.feature.findMany({
  select: {
    id: true,
    title: true,
  },
  take: 10,
  orderBy: { createdAt: 'desc' },
});
```

## 🗂️ File Naming Conventions

### Components
```
src/components/ComponentName/
├── ComponentName.tsx          (PascalCase)
├── ComponentName.module.css   (matches .tsx)
└── ComponentName.stories.tsx  (for Storybook)
```

### Backend Routers
```
src/server/routers/
├── blog.ts        (lowercase)
├── chat.ts
└── profile.ts
```

### Planning Docs
```
.github/plans/
├── chat-websocket-plan.md         (kebab-case)
└── dashboard-refactor-plan.md
```

### Completion Docs
```
.github/documentation/
├── chat-websocket-complete.md     (kebab-case)
└── dashboard-refactor-complete.md
```

## 🛠️ Essential Commands

```bash
# Development
npm run dev              # Next.js dev (DON'T RUN unless user asks)
npm run storybook        # Component development

# Build & Deploy
npm run build            # Production build + sitemap
npm run lint             # ESLint check
npm run compile          # TypeScript check

# Database
npx prisma generate      # Generate Prisma Client
npx prisma migrate dev   # Create/apply migrations
npx prisma studio        # Database GUI
```

## 🎯 Common Prompt Patterns

### Feature Development
```
"Using the Frontend Agent, create a PhotoCard component with:
- Audio feedback on hover and click
- Responsive design (768px breakpoint)
- CSS Module styling
- Storybook story with multiple states
Follow the planning document at .github/plans/photo-card-plan.md"
```

### Bug Fix
```
"Using the Backend Agent, fix the authentication check in 
src/server/routers/blog.ts - ensure only post owners can delete"
```

### Refactoring
```
"Using both agents, refactor the dashboard animation logic to use 
Framer Motion instead of manual DOM manipulation. Maintain existing 
timing and behavior."
```

### Documentation Only
```
"Create documentation for the recently completed chat feature in 
.github/documentation/chat-complete.md. Include API endpoints, 
component usage, and testing results."
```

## 🔍 Troubleshooting

### Agent not following rules?
- Explicitly mention which agent file to use
- Reference specific sections: "Following the Dependency Management section in Frontend Agent..."

### Feature needs both frontend and backend?
- Start with planning: "Create a full-stack plan in .github/plans/"
- Then delegate: "Using Frontend Agent, implement UI" and "Using Backend Agent, implement API"

### Need to review existing patterns?
- "Show me existing audio integration patterns in the codebase"
- "What's the current authentication flow?"

## 📊 Quick Security Checklist

```markdown
- [ ] No hardcoded secrets/API keys
- [ ] All inputs validated with Zod
- [ ] Authentication on protected routes
- [ ] Authorization checks for resources
- [ ] No console.log with sensitive data
- [ ] Dependencies approved by user
- [ ] Error messages don't expose internals
```

## 💡 Pro Tips

1. **Always create plans first** - Saves time debugging later
2. **Reference agent files explicitly** - Better results
3. **Use templates** - Consistency across docs
4. **Test at 768px** - Mobile breakpoint is critical
5. **Audio everywhere** - Xbox aesthetic requires sound feedback
6. **Document as you go** - Easier than retroactive docs

---

*Keep this file handy when working with AI agents on this project!*
