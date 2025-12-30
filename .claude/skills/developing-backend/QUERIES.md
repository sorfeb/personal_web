# Database Query Optimization

## Select Only Needed Fields

```typescript
// GOOD
const items = await ctx.db.feature.findMany({
  select: {
    id: true,
    title: true,
    createdAt: true,
  },
});

// BAD - fetches all fields
const items = await ctx.db.feature.findMany();
```

## Pagination Pattern

```typescript
const getPaginated = publicProcedure
  .input(z.object({
    limit: z.number().min(1).max(100).default(10),
    cursor: z.string().optional(),
  }))
  .query(async ({ ctx, input }) => {
    const items = await ctx.db.feature.findMany({
      take: input.limit + 1,
      cursor: input.cursor ? { id: input.cursor } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    let nextCursor: string | undefined;
    if (items.length > input.limit) {
      const nextItem = items.pop();
      nextCursor = nextItem!.id;
    }

    return { items, nextCursor };
  });
```

## Efficient Relations

```typescript
// GOOD - select specific relation fields
const item = await ctx.db.feature.findUnique({
  where: { id: input.id },
  include: {
    user: {
      select: { id: true, name: true },
    },
  },
});

// BAD - includes entire user object
include: { user: true }
```

## Aggregations

```typescript
const [total, published, draft] = await Promise.all([
  ctx.db.feature.count(),
  ctx.db.feature.count({ where: { status: 'published' } }),
  ctx.db.feature.count({ where: { status: 'draft' } }),
]);
```

## Transactions

```typescript
const result = await ctx.db.$transaction([
  ctx.db.feature.create({ data: featureData }),
  ctx.db.log.create({ data: logData }),
]);
```

## Index Usage

Define in Prisma schema for frequently queried fields:

```prisma
model Feature {
  // ...
  @@index([userId])
  @@index([userId, createdAt])
}
```