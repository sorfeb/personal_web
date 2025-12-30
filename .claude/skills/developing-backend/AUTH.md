# Authentication & Authorization

## Protected Procedure

```typescript
export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: { session: ctx.session },
  });
});
```

## Resource Ownership Check

```typescript
update: protectedProcedure
  .input(z.object({
    id: z.string().uuid(),
    title: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    // Check ownership
    const existing = await ctx.db.feature.findUnique({
      where: { id: input.id },
      select: { userId: true },
    });

    if (!existing) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Feature not found',
      });
    }

    if (existing.userId !== ctx.session.user.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not authorized to update this resource',
      });
    }

    return await ctx.db.feature.update({
      where: { id: input.id },
      data: { title: input.title },
    });
  });
```

## Soft Delete with Auth

```typescript
const softDelete = protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .mutation(async ({ ctx, input }) => {
    // Check ownership first
    const existing = await ctx.db.feature.findUnique({
      where: { id: input.id },
      select: { userId: true },
    });

    if (!existing || existing.userId !== ctx.session.user.id) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    return await ctx.db.feature.update({
      where: { id: input.id },
      data: {
        deletedAt: new Date(),
        isDeleted: true,
      },
    });
  });
```

## Stack Auth Integration

Authentication via `@stackframe/stack`:

```typescript
// ctx.session.user available in protected procedures
const userId = ctx.session.user.id;
const userEmail = ctx.session.user.email;
```