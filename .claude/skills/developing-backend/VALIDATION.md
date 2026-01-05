# Zod Validation Patterns

## Common Schemas

```typescript
// UUIDs
z.string().uuid()

// Enums
z.enum(['draft', 'published', 'archived'])

// Dates
z.date().min(new Date(), 'Must be in future')

// Arrays with constraints
z.array(z.string()).min(1).max(10)

// Optional with default
z.string().optional().default('default-value')

// Email
z.string().email()

// URL
z.string().url()

// Numeric string
z.string().regex(/^\d+$/)
```

## Reusable Schema Pattern

```typescript
// Define once
const createFeatureSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title too long'),
  content: z.string()
    .min(10, 'Content too short')
    .max(10000, 'Content too long'),
  tags: z.array(z.string()).optional(),
  publishedAt: z.date().optional(),
});

// Use in procedure
.input(createFeatureSchema)
```

## Conditional Validation

```typescript
z.object({
  type: z.enum(['email', 'sms']),
  email: z.string().email().optional(),
  phone: z.string().optional(),
}).refine((data) => {
  if (data.type === 'email') return !!data.email;
  if (data.type === 'sms') return !!data.phone;
  return true;
}, 'Email or phone required based on type')
```

## Pagination Schema

```typescript
const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  cursor: z.string().optional(),
});
```

## Transform & Preprocess

```typescript
// Transform after validation
z.string().transform((val) => val.toLowerCase())

// Preprocess before validation
z.preprocess(
  (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
  z.number()
)
```