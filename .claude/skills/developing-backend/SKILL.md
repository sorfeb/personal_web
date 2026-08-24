---
name: developing-backend
description: |
  Backend development with tRPC v11, Prisma v6, and Neon PostgreSQL.
  Use when creating API routes, database operations, validation, or server logic.
  Triggers: "tRPC", "router", "API", "endpoint", "database", "Prisma", "query", "mutation", "backend".
---

# Backend Development

Type-safe API development with tRPC, Prisma and PostgreSQL.

## Read These First

This skill does not restate the context shape, the procedure helpers or the router list. Those
change; the files do not lie.

| Before you… | Read |
|---|---|
| Write a procedure | `src/server/trpc.ts` — context shape, `publicProcedure`, `protectedProcedure`, middleware |
| Add or find a router | `src/server/routers/_app.ts` — the registry |
| Touch auth | `src/lib/auth.ts` — the session source that `createTRPCContext` calls |
| Query anything | `prisma/schema.prisma` — models, relations, indexes |

**Do not assume the context shape.** Open `createTRPCContext` and read what it actually returns
before writing `ctx.<anything>`. A guessed field name typechecks nowhere and wastes a round trip.

## Critical Rules

1. **Validate every input with Zod.** No procedure takes unvalidated input.
2. **Throw `TRPCError` with the right code**, never a bare `Error` and never a raw Prisma error.
3. **`select` only the fields you need.** Never `findMany()` with no projection on a wide model.
4. **Check ownership, not just authentication.** `protectedProcedure` proves *who* the caller is;
   it does not prove the row belongs to them. Fetch the owning id and compare before update/delete.
5. **Take the user id from the context, never from the input.** An id in the input payload is
   attacker-controlled.
6. **No `console.log`.** Surface failures as `TRPCError`.

## Error Codes

tRPC's own vocabulary, stable across the project:

| Code | HTTP | Use when |
|---|---|---|
| `NOT_FOUND` | 404 | Resource does not exist |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Authenticated but not allowed this resource |
| `BAD_REQUEST` | 400 | Invalid input beyond what Zod caught |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected failure |

Client-facing messages stay generic. Internal detail belongs in the server-side throw, not the
response body.

## Shape of a Procedure

Copy the conventions from a neighbouring router in `src/server/routers/` rather than from this
snippet: they carry the current context fields and the project's naming.

```typescript
export const featureRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.feature.findUnique({
        where: { id: input.id },
        select: { id: true, title: true },
      });
      if (!item) throw new TRPCError({ code: 'NOT_FOUND', message: 'Feature not found' });
      return item;
    }),
});
```

## Ownership Check

The pattern that matters most, because getting it wrong is a horizontal privilege escalation:

```typescript
const existing = await ctx.db.feature.findUnique({
  where: { id: input.id },
  select: { userId: true },
});
if (!existing) throw new TRPCError({ code: 'NOT_FOUND' });
if (existing.userId !== /* caller id from ctx */) throw new TRPCError({ code: 'FORBIDDEN' });
```

Read `trpc.ts` for where the caller's id currently lives on the context.

## Queries

- Project with `select`, including inside `include` on relations. `include: { user: true }` pulls
  every column of a joined row.
- Paginate lists with a cursor (`take: limit + 1`, pop the extra, return it as `nextCursor`).
  Bound `limit` in the Zod schema so a caller cannot request the whole table.
- Batch independent counts and reads through `Promise.all`; use `$transaction` when writes must
  succeed or fail together.
- Add an `@@index` in `prisma/schema.prisma` for any field combination you filter or sort on.

Schema changes need `.env.local` loaded explicitly; the Prisma CLI does not read it on its own.

## Pre-Completion Checklist

```
- [ ] Read trpc.ts before touching the context
- [ ] Every input validated with Zod, string lengths and array sizes bounded
- [ ] protectedProcedure on anything requiring a session
- [ ] Ownership verified before update/delete; user id from context, not input
- [ ] TRPCError with the right code; no raw Prisma errors reaching the client
- [ ] select used; relations projected, not spread
- [ ] New router registered in _app.ts
- [ ] npm run compile and npm run lint pass
```
