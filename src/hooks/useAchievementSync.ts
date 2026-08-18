'use client';

import { authClient } from '../lib/auth-client';
import { trpc } from '../utils/trpc';
import { useTimeout } from './useTimeout';
import type { AchievementId } from '../constants/achievements';

interface UseAchievementSyncOptions {
  /** Everything unlocked locally (localStorage) */
  unlockedIds: AchievementId[];
  /** Ids already persisted server-side for this account */
  syncedIds: AchievementId[];
  /**
   * Called with the server's full unlocked set after a successful merge.
   * The provider unlocks any ids it hasn't seen locally (cross-device
   * unlocks, server-granted ones like party-up) and records them as synced.
   */
  onMerged: (serverUnlockedIds: string[]) => void;
}

/**
 * Keeps local achievement progress and the signed-in account converged
 * through one debounced, idempotent `achievements.merge` call. Covers both
 * the post-OAuth-redirect guest merge (page reloads → provider mounts →
 * unsynced ids exist) and the ongoing signed-in write-through (a new unlock
 * makes the pending diff non-empty again). Guests are untouched: no session,
 * no mutation.
 */
export function useAchievementSync({
  unlockedIds,
  syncedIds,
  onMerged,
}: UseAchievementSyncOptions): void {
  const { data: session } = authClient.useSession();
  const utils = trpc.useUtils();
  const mergeMutation = trpc.achievements.merge.useMutation({
    onSuccess: (result) => {
      onMerged(result.unlockedIds);
      utils.user.getProfile.invalidate();
    },
  });

  const pendingIds = unlockedIds.filter((id) => !syncedIds.includes(id));

  // party-up is granted server-side inside merge, so a fresh sign-in with no
  // local unlocks still warrants one sync. Errors stop the loop until the
  // pending set changes (next unlock or reload) rather than retrying forever.
  const shouldSync =
    Boolean(session?.user) &&
    !mergeMutation.isPending &&
    !mergeMutation.isError &&
    (pendingIds.length > 0 || !syncedIds.includes('party-up'));

  useTimeout(() => {
    mergeMutation.mutate({ ids: unlockedIds });
  }, shouldSync ? 1000 : null);
}
