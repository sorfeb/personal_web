'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { useMountEffect } from '../hooks';
import { useAmbientAchievementTriggers } from '../hooks/useAmbientAchievementTriggers';
import { useRouteVisitTracking } from '../hooks/useRouteVisitTracking';
import { useAchievementSync } from '../hooks/useAchievementSync';
import { useToast } from '../hooks/useToast';
import { createAchievementToast } from '../utils/toastUtils';
import {
  ACHIEVEMENT_MAP,
  PROGRESS_RULES,
  TRACKED_BLADES,
  TRACKED_GAMERCARD_SECTIONS,
  TRACKED_ROUTES,
  computeGamerscore,
  isAchievementId,
  type AchievementId,
  type ProgressKey,
} from '../constants/achievements';

/**
 * AchievementContext
 *
 * The unlock engine behind the gamerscore system. Guests accumulate progress
 * here (persisted to localStorage); signing in merges it into their account.
 * Gamerscore is always derived from the catalog — never stored — so the
 * numbers cannot drift from the achievement definitions.
 */

interface AchievementStorage {
  version: 1;
  /** Unlocked achievement id → ISO timestamp of the unlock */
  unlocked: Partial<Record<AchievementId, string>>;
  /** Persisted sets backing multi-step achievements */
  progress: Partial<Record<ProgressKey, string[]>>;
  /** Ids already persisted server-side for the signed-in account */
  syncedIds: AchievementId[];
}

interface AchievementContextType {
  /** Idempotent: first call persists + toasts, repeats are no-ops */
  unlock: (id: AchievementId) => void;
  /** Add a value to a multi-step set; threshold unlocks fire automatically */
  recordProgress: (key: ProgressKey, value: string) => void;
  isUnlocked: (id: AchievementId) => boolean;
  unlockedIds: AchievementId[];
  /** Derived from the catalog scores of unlocked ids */
  localGamerscore: number;
  /** Wipe all local progress (dev/QA affordance) */
  reset: () => void;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

const STORAGE_KEY = 'sorosfebria-achievements-v1';

const EMPTY_STORAGE: AchievementStorage = {
  version: 1,
  unlocked: {},
  progress: {},
  syncedIds: [],
};

/** Values allowed per progress set, so junk input never inflates a threshold */
const VALID_PROGRESS_VALUES: Record<ProgressKey, readonly string[]> = {
  routesVisited: TRACKED_ROUTES,
  bladesCycled: TRACKED_BLADES,
  gamercardSections: TRACKED_GAMERCARD_SECTIONS,
};

function loadStorage(): AchievementStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AchievementStorage;
      if (parsed && parsed.version === 1) {
        return {
          version: 1,
          unlocked: parsed.unlocked ?? {},
          progress: parsed.progress ?? {},
          syncedIds: parsed.syncedIds ?? [],
        };
      }
    }
  } catch (error) {
    console.error('Failed to load achievement progress:', error);
  }
  return EMPTY_STORAGE;
}

function saveStorage(storage: AchievementStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('Failed to save achievement progress:', error);
  }
}

interface AchievementProviderProps {
  children: ReactNode;
}

export const AchievementProvider: React.FC<AchievementProviderProps> = ({ children }) => {
  const { showToast } = useToast();
  const [store, setStore] = useState<AchievementStorage>(EMPTY_STORAGE);

  // Refs let unlock/recordProgress read-modify-write synchronously (and
  // compose: recordProgress → unlock within one call) without stale closures.
  const storeRef = useRef<AchievementStorage>(EMPTY_STORAGE);
  const hydratedRef = useRef(false);

  /** Lazily hydrate from localStorage so any call order after mount is safe */
  const ensureLoaded = useCallback((): AchievementStorage => {
    if (!hydratedRef.current && typeof window !== 'undefined') {
      hydratedRef.current = true;
      const loaded = loadStorage();
      storeRef.current = loaded;
      setStore(loaded);
    }
    return storeRef.current;
  }, []);

  useMountEffect(() => {
    ensureLoaded();
  });

  const commit = useCallback((next: AchievementStorage) => {
    storeRef.current = next;
    setStore(next);
    saveStorage(next);
  }, []);

  const unlock = useCallback(
    (id: AchievementId) => {
      const current = ensureLoaded();
      if (current.unlocked[id]) return;

      const def = ACHIEVEMENT_MAP[id];
      commit({
        ...current,
        unlocked: { ...current.unlocked, [id]: new Date().toISOString() },
      });
      showToast(
        createAchievementToast('Achievement unlocked', `${def.score}G – ${def.title}`, def.icon)
      );
    },
    [ensureLoaded, commit, showToast]
  );

  const recordProgress = useCallback(
    (key: ProgressKey, value: string) => {
      if (!VALID_PROGRESS_VALUES[key].includes(value)) return;

      const current = ensureLoaded();
      const set = current.progress[key] ?? [];
      if (!set.includes(value)) {
        commit({
          ...current,
          progress: { ...current.progress, [key]: [...set, value] },
        });
      }

      const count = (storeRef.current.progress[key] ?? []).length;
      for (const rule of PROGRESS_RULES[key]) {
        if (count >= rule.threshold) unlock(rule.unlocks);
      }
    },
    [ensureLoaded, commit, unlock]
  );

  const reset = useCallback(() => {
    hydratedRef.current = true;
    commit(EMPTY_STORAGE);
  }, [commit]);

  useAmbientAchievementTriggers(unlock);

  useRouteVisitTracking((pathname) => {
    if ((TRACKED_ROUTES as readonly string[]).includes(pathname)) {
      unlock('first-boot');
      recordProgress('routesVisited', pathname);
    }
  });

  const unlockedIds = useMemo(
    () => Object.keys(store.unlocked) as AchievementId[],
    [store.unlocked]
  );

  useAchievementSync({
    unlockedIds,
    syncedIds: store.syncedIds,
    onMerged: (serverUnlockedIds) => {
      const validIds = serverUnlockedIds.filter(isAchievementId);
      // Server-granted or cross-device unlocks surface locally (with toasts)
      validIds.forEach((id) => unlock(id));
      const current = ensureLoaded();
      commit({
        ...current,
        syncedIds: [...new Set([...current.syncedIds, ...validIds])],
      });
    },
  });
  const localGamerscore = useMemo(() => computeGamerscore(unlockedIds), [unlockedIds]);

  const value: AchievementContextType = useMemo(
    () => ({
      unlock,
      recordProgress,
      isUnlocked: (id: AchievementId) => Boolean(store.unlocked[id]),
      unlockedIds,
      localGamerscore,
      reset,
    }),
    [store, unlockedIds, localGamerscore, unlock, recordProgress, reset]
  );

  return <AchievementContext.Provider value={value}>{children}</AchievementContext.Provider>;
};

export const useAchievementContext = (): AchievementContextType => {
  const context = useContext(AchievementContext);

  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }

  return context;
};
