# Achievement / Gamerscore System — Completion Record

**Linear**: [SOR-139](https://linear.app/s11o/issue/SOR-139) (parent) · SOR-140..143 (phases)
**Branch**: `sorosfebriano/sor-140-phase-1-achievement-catalog-client-engine-guest-mode`
**Date**: 2026-08-18

## What shipped

Visitors earn Xbox-style gamerscore for exploring the site. Guests accumulate progress in
localStorage (`sorosfebria-achievements-v1`); signing in with GitHub merges it into their
account. Unlocks pop via the existing achievement toast (sound included), and the Guide
(ProfileModal) gained an **Achievements** blade listing all 16 achievements (235G total)
with locked/unlocked states, masked secrets, and unlock dates.

### Architecture

- **Catalog** (`src/constants/achievements.ts`): single code-defined source of truth shared
  by client and server — ids, titles, scores (5/10/20/50G), secret flags, tracked routes/
  blades/sections, and declarative `PROGRESS_RULES` for multi-step unlocks. Gamerscore is
  always **derived** from the catalog (`computeGamerscore`), never stored independently.
- **Client engine** (`src/context/AchievementContext.tsx`, inside `ToastProvider`):
  idempotent `unlock(id)` → persist + toast; `recordProgress(key, value)` for sets (routes
  visited, blades cycled, gamercard sections) with threshold unlocks. Route visits are
  tracked centrally via `usePathname` (`src/hooks/useRouteVisitTracking.ts`) so `next/link`
  navigations count. Consumed via `useAchievements()` in event handlers.
- **Server** (`prisma` `UserAchievement` + `src/server/routers/achievements.ts`):
  `merge` (protected) validates ids against the catalog (zod enum), upserts with
  `skipDuplicates` against the `[userId, achievementId]` unique constraint, recomputes
  `User.gamerscore` server-side, and grants `party-up` itself. `getMine` returns persisted
  unlocks. `messages.create` grants `leave-your-mark` server-authoritatively (best-effort).
- **Sync** (`src/hooks/useAchievementSync.ts`): one debounced idempotent merge covers both
  the post-OAuth guest merge and ongoing signed-in write-through, keyed on the
  `unlocked − syncedIds` diff. localStorage is never cleared and stays the render source.
- **Fixes along the way**: `user.getProfile` now reads from the DB via `UserService`
  (stale-session gamerscore bug); `auth-client` gained `inferAdditionalFields` typing;
  stories share one `StoryProviders` decorator (several were missing required providers);
  the dead SettingsPage "Display" row became a real CRT filter toggle.

### Catalog (16 achievements, 235G)

first-boot 5G · blade-runner 10G · channel-surfer 10G · completionist 50G · plug-and-play
20G · party-up 20G · leave-your-mark 20G · business-time 10G · full-dossier 10G ·
now-playing 10G · deep-cuts 5G · scanline-purist 5G · fresh-coat 5G · new-you 10G ·
dev-mode 20G (secret) · headhunter 10G (secret)

Note: the planned visualizer achievement was retargeted to the playlist drawer
(`deep-cuts`) because the visualizer has no UI call site yet.

## Verification

- `npm run typecheck` — clean, all phases
- `npm run lint` — no new warnings (pre-existing baseline untouched)
- `npm run lint:useeffect` — OK (ambient triggers live in `src/hooks/`, exempt by design)
- `npm run lint:css` — 0 errors, warning count unchanged (new CSS is tokens-only)
- `npx prisma db push` — `UserAchievement` applied to Neon (additive)
- Storybook: `AchievementsPage` story added; ProfileCard/GamerCard/ProfileModal stories
  fixed to render under the full provider pyramid

### Manual QA checklist (user runs dev server)

- [ ] Fresh incognito: `first-boot` toast on landing; `channel-surfer` after 5 routes
- [ ] Cycle all 4 dashboard blades → `blade-runner`
- [ ] `/toast-demo` QA row: unlock test + reset
- [ ] Sign in with GitHub → `party-up` toast, DB rows created, ProfileCard score correct
- [ ] Sign out/in again → score unchanged (merge idempotent)
- [ ] Guide → Achievements blade shows summary + masked secrets

## Known limitations

- Client-reported unlocks are spoofable by design (accepted tradeoff; score is cosmetic,
  server caps at catalog total and validates ids).
- Multi-tab localStorage sync and a Konami-code secret were deferred (noted in SOR-143).
- `getMine` is not yet used for cross-device rendering; localStorage is the render source.
- Achievements page currently uses pointer/tab interaction; spatial-nav scope integration
  (SOR-134 branch) can pick it up once that merges.
