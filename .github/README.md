# GitHub Configuration & Agent Instructions

This directory contains all AI agent instructions, feature planning templates, and documentation for the personal_web project.

## 📁 Directory Structure

```
.github/
├── copilot-instructions.md      # Main agent instructions (general guidance)
├── agents/                       # Specialized agent prompts
│   ├── copilot-frontend.md      # Frontend-specific instructions
│   └── copilot-trpc.md          # Backend/tRPC-specific instructions
├── plans/                        # Feature planning (before implementation)
│   ├── TEMPLATE.md              # Planning template
│   └── README.md                # Planning workflow guide
└── documentation/                # Feature docs (after completion)
    ├── TEMPLATE.md              # Documentation template
    └── README.md                # Documentation guide
```

## 🤖 AI Agent System

### Agent Roles

#### **Main Agent** (`copilot-instructions.md`)
- General project guidance and architecture overview
- Critical rules (dev server, security, logging)
- Cross-cutting concerns
- Task workflow and delegation
- **Delegates to specialized agents for domain-specific work**

#### **Frontend Agent** (`agents/copilot-frontend.md`)
Specialized in:
- React components and hooks
- CSS Modules and styling
- Audio integration (`useAudioManager`)
- Animations and responsive design
- Storybook development
- Client-side logic

#### **Backend Agent** (`agents/copilot-trpc.md`)
Specialized in:
- tRPC router development
- Prisma database operations
- Zod input validation
- Authentication & authorization
- Error handling (TRPCError)
- Query optimization

### When to Use Which Agent

| Task Type | Use Agent | Location |
|-----------|-----------|----------|
| UI components, styling, animations | Frontend Agent | `agents/copilot-frontend.md` |
| API routes, database, validation | Backend Agent | `agents/copilot-trpc.md` |
| Architecture, planning, general guidance | Main Agent | `copilot-instructions.md` |
| Full-stack features | Both agents | Coordinate between both |

## 🔒 Critical Security Rules

### Dependency Management
**NEVER add dependencies without explicit user approval.**

Before any `npm install`:
1. Check if existing packages solve the problem
2. Explore vanilla solutions
3. If truly needed, request approval with:
   - Package name & version
   - Justification and alternatives
   - Security audit (npm, maintenance, bundle size)
   - Supply chain risk assessment
4. **Wait for "yes" before installing**

### Console Logging Policy
**Minimize console output:**
- ❌ No `console.log()` or `console.debug()` in production
- ⚠️ Only `console.error()` for critical issues
- ✅ Use proper TypeScript error handling instead

## 📋 Feature Development Workflow

### 1. Planning Phase

**Create planning document in `.github/plans/`:**

```bash
# Copy template
cp .github/plans/TEMPLATE.md .github/plans/feature-name-plan.md

# Fill out:
# - Objective and user story
# - Technical approach
# - Implementation steps
# - Security considerations
# - Performance considerations
# - Testing strategy
```

**Plan Format:**
- Clear objectives
- File paths and architecture decisions
- Security and performance notes
- Dependency approval (if needed)
- Step-by-step implementation guide

### 2. Implementation Phase

**Follow specialized agent guidelines:**
- Frontend: `agents/copilot-frontend.md`
- Backend: `agents/copilot-trpc.md`

**Development checklist:**
- [ ] TypeScript compiles (`npm run compile`)
- [ ] Audio integration (frontend)
- [ ] Input validation (backend)
- [ ] Error handling
- [ ] Responsive design (frontend)
- [ ] No console.log statements
- [ ] No unauthorized dependencies

### 3. Documentation Phase

**Create completion doc in `.github/documentation/`:**

```bash
# Copy template
cp .github/documentation/TEMPLATE.md .github/documentation/feature-name-complete.md

# Document:
# - What was built
# - Files changed
# - API endpoints (if backend)
# - Usage examples
# - Testing results
# - Known limitations
```

**Documentation Format:**
- Summary of implementation
- File changes and architecture
- API documentation with examples
- Component usage patterns
- Testing completed
- Future enhancements

## 🎯 Pre-Completion Checklist

Before marking any work complete:

### Code Quality
- [ ] TypeScript compiles without errors (`npm run compile`)
- [ ] ESLint passes (`npm run lint`)
- [ ] No console.log statements remain
- [ ] No unauthorized dependencies added
- [ ] Feature verified in browser/dev environment

### Frontend-Specific
- [ ] Audio feedback on interactive elements
- [ ] Responsive design verified (≤768px and >768px in browser)
- [ ] Storybook story created (major components)
- [ ] CSS follows module pattern
- [ ] No console errors in browser

### Backend-Specific
- [ ] Input validation with Zod schemas
- [ ] Proper TRPCError codes used
- [ ] Authentication/authorization checks
- [ ] Database queries optimized
- [ ] API endpoints verified (browser devtools/Postman)

### Documentation
- [ ] Planning document in `.github/plans/`
- [ ] Completion doc in `.github/documentation/`
- [ ] Inline comments for complex logic
- [ ] JSDoc for exported functions

## 📚 Template Usage

### Planning Template
**Location**: `.github/plans/TEMPLATE.md`

**Use for**: Planning new features before implementation

**Key sections**:
- Objective and user story
- Technical approach and architecture
- Implementation steps (detailed roadmap)
- Testing strategy
- Security considerations
- Performance considerations
- Success criteria

### Documentation Template
**Location**: `.github/documentation/TEMPLATE.md`

**Use for**: Documenting completed features

**Key sections**:
- Summary and what was built
- Files changed (created/modified)
- API endpoints with usage examples
- Component usage examples
- Testing completed
- Known limitations
- Future enhancements

## 🔄 Task Workflow Types

### New Feature Development
1. Create plan in `.github/plans/[feature]-plan.md`
2. Implement following specialized agent guidelines
3. Test thoroughly (compilation, functionality, responsiveness)
4. Document in `.github/documentation/[feature]-complete.md`
5. Verify pre-completion checklist

### Bug Fixes
1. Investigate root cause
2. Implement fix following conventions
3. Test fix doesn't break other features
4. Update existing documentation if architecture changed

### Refactoring
1. Plan what's being refactored and why
2. Make changes incrementally
3. Ensure no behavior changes
4. Update relevant documentation

## 🏗️ Project Architecture Reference

### Xbox Dashboard System
- Card-based navigation with manual DOM animations
- Desktop: Complex slide/scale animations (250px gap, 0.78 factor)
- Mobile: Responsive grid layout (≤768px breakpoint)
- Four sections: home, misc, gallery, credits

### Audio Management
- Global pooling system via `useAudioManager`
- Pre-creates 3 `HTMLAudioElement` per sound type
- Volume integration via `VolumeContext`
- 13 sound types for different interactions

### Tech Stack
- **Frontend**: Next.js 15, React 18, CSS Modules, Framer Motion
- **Backend**: tRPC v11, Prisma v6, Zod v4
- **Database**: PostgreSQL (Neon serverless)
- **Auth**: Stack Auth (@stackframe/stack)
- **Testing**: Storybook for component development

## 📖 Additional Resources

- **Main README**: `../README.md` (project overview and setup)
- **Package Info**: `../package.json` (dependencies and scripts)
- **Prisma Schema**: `../prisma/schema.prisma` (database models)

## 🤝 Contributing Guidelines

When working with AI agents:
1. Always specify which agent should handle the task
2. Provide context from relevant instruction files
3. Ensure agents create proper documentation
4. Review agent suggestions for security concerns
5. Verify no unauthorized dependencies are added

---

**Remember**: Good planning and documentation make development faster and safer. Always create plans before implementation and documentation after completion.

*Last Updated*: 2025-10-22
