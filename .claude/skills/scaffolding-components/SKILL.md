---
name: scaffolding-components
description: |
  Scaffold new React components with proper file structure, CSS modules, audio integration, and Storybook stories.
  Use when creating new components, scaffolding UI, or when user says "create component", "new component",
  "scaffold", "generate component", or "add component".
---

# Component Scaffolding

## Before Scaffolding Anything

Check whether you need a new component at all.

- **Is it a button, toggle, tooltip or clock?** `src/components/ui/` already has it. Read that
  directory first. Most hand-rolled elements in this codebase should have been a primitive, and
  each one silently drops the audio feedback, focus-visible styling and ARIA the primitive carries.
- **Is it a variation of something that exists?** Grep `src/components/` for the concept before
  adding a sibling that will drift.

For styling the component once it exists, load the `styling-ui` skill.

## Workflow

```
- [ ] Step 1: Confirm no ui/ primitive or existing component covers this
- [ ] Step 2: Create component directory
- [ ] Step 3: Create main component file (.tsx)
- [ ] Step 4: Create CSS module (.module.css)
- [ ] Step 5: Create barrel export (index.ts)
- [ ] Step 6: Create Storybook story (.stories.tsx) - if user-facing
- [ ] Step 7: Verify audio feedback and focus styling
- [ ] Step 8: Add responsive + reduced-motion blocks
```

## Directory Structure

```
src/components/ComponentName/
├── ComponentName.tsx          # Main component
├── ComponentName.module.css   # Scoped styles
├── ComponentName.stories.tsx  # Storybook (optional)
└── index.ts                   # Barrel export
```

Naming: `PascalCase.tsx`, `PascalCase.module.css`, `PascalCase.stories.tsx`, lowercase `index.ts`.

## Templates

See [TEMPLATES.md](TEMPLATES.md). Treat the `var()` names in it as illustrative and read
`src/app/design-tokens.css` for the real ones.

## Audio Feedback

Every interactive element gets a sound. The names are the keys of `AUDIO_FILES` in
`src/hooks/useAudioManager.ts` — **read that object**, do not guess. Names that sound plausible and
do not exist include `'open'`, `'close'`, `'select'` and `'success'`.

Conventional mapping, for the ones that are stable:

| Interaction | Sound |
|---|---|
| Activation | `click` |
| Pointer enter | `hover` |
| Route change | `navigation` (via `navigateWithSound`, which plays it for you) |
| Dismiss / back out | `back` |

`ui/Button` already wires hover and click, and takes `hoverSound` / `clickSound` overrides. You
only call `playSound` yourself on elements that are not primitives.

## Interaction Model

Use the native element that expresses the intent: `next/link` for routes, `<button>` for actions.
Do not build a `<div role="button" tabIndex={0}>`, and do not blanket-apply `tabIndex={0}` across a
composite widget — that turns one tab stop into N and makes keyboard navigation worse than none.

A component that owns directional navigation registers with `useGamepadScope` rather than adding
its own `window` keydown listener. Sibling components that own halves of the same navigation
contribute to **one** scope id, not two.

## Pre-Completion Checklist

```
- [ ] No existing ui/ primitive covered this
- [ ] Interactive elements are <button> or next/link, not divs with onClick
- [ ] Audio feedback present; sound names verified against AUDIO_FILES
- [ ] Focus style covers :focus-visible and gamepad input mode
- [ ] CSS uses design tokens; no literals, no var(--token, #fallback)
- [ ] Responsive at 768px using (width <= 768px) range syntax
- [ ] prefers-reduced-motion block if anything animates
- [ ] npm run lint:css warning count did not increase
- [ ] npm run compile and npm run lint pass
```
