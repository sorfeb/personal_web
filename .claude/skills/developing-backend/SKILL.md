---
name: developing-backend
description: |
  Backend development with tRPC v11, Prisma v6, and Neon PostgreSQL.
  Use when creating API routes, database operations, validation, or server logic.
  Triggers: "tRPC", "router", "API", "endpoint", "database", "Prisma", "query", "mutation", "backend".
---

# Backend Development

Specialized guidance for type-safe API development with tRPC, Prisma ORM, and PostgreSQL.

## Critical Rules

1. **Validate All Inputs**: Use Zod schemas on every procedure
2. **Proper Error Codes**: Use TRPCError with correct HTTP semantics
3. **Select Only Needed Fields**: Never fetch entire records unnecessarily
4. **Auth/Authz Checks**: Protected procedures + resource ownership verification
5. **No Console Logs**: Use TRPCError, not console.log

## Router Location

```
src/server/routers/_app.ts  # Router registry
src/server/routers/*.ts     # Feature routers (lowercase)
src/server/trpc.ts          # Core setup, middleware
```

## Standard Router Pattern

```typescript
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const featureRouter = createTRPCRouter({
  // Public query
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.feature.findMany({
        select: { id: true, title: true },
        orderBy: { createdAt: 'desc' },
      });
    }),

  // Query with input
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.feature.findUnique({
        where: { id: input.id },
      });

      if (!item) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Feature not found',
        });
      }

      return item;
    }),

  // Protected mutation
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(255),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.feature.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),
});
```

## Error Codes

| Code | HTTP | Use When |
|------|------|----------|
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Authenticated but not allowed |
| `BAD_REQUEST` | 400 | Invalid input (beyond Zod) |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected failures |

## Reference Files

- **Validation patterns**: See [VALIDATION.md](VALIDATION.md)
- **Query optimization**: See [QUERIES.md](QUERIES.md)
- **Auth patterns**: See [AUTH.md](AUTH.md)

## Pre-Completion Checklist

```
- [ ] All inputs validated with Zod
- [ ] Authentication checks on protected procedures
- [ ] Authorization checks for resource ownership
- [ ] TRPCError with proper codes
- [ ] Database queries optimized (select only needed)
- [ ] No console.log statements
- [ ] TypeScript compiles (`npm run compile`)
```