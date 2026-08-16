'use client';

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
// Imported from their own modules rather than the `@/hooks` barrel: the barrel
// re-exports `useGamepadScope`, which imports this file, and a cycle through it
// would leave these bindings undefined at module-init time.
import { useGamepad } from '@/hooks/useGamepad';
import { useEventListener } from '@/hooks/useEventListener';
import { useMountEffect } from '@/hooks/useMountEffect';
import { useIsMobile } from '@/utils/responsiveUtils';
import type {
  GamepadIntent,
  GamepadIntentHandlers,
  GamepadSnapshot,
  InputMode,
} from '@/types/gamepad';

/**
 * One component's contribution to a scope. Handlers are read through a getter
 * so a consumer re-creating its callbacks never has to re-register — which
 * would otherwise reorder the stack and hand control to the wrong scope.
 */
interface ScopeContribution {
  getHandlers: () => GamepadIntentHandlers;
}

/**
 * A scope as the provider stores it.
 *
 * A scope is a *region of the UI*, not a component, and a region is usually
 * composed of several. The dashboard's blade list and its card stack are
 * siblings that each own half of the same navigation — the blades know
 * `up`/`down`, the cards know `left`/`right` — so both contribute to one
 * `dashboard` scope rather than each pushing a scope and fighting over which is
 * on top. Contributions merge; the most recent one wins a conflict.
 */
interface RegisteredScope {
  id: string;
  contributions: ScopeContribution[];
  restoreFocusOnPop: boolean;
  previousFocus: HTMLElement | null;
}

export interface GamepadScopeRegistration {
  id: string;
  getHandlers: () => GamepadIntentHandlers;
  restoreFocusOnPop?: boolean;
}

interface GamepadContextValue {
  /** True once a pad has announced itself. Browsers hide pads until first press. */
  connected: boolean;
  /** Which device last produced input. Mirrored onto `<html data-input>`. */
  inputMode: InputMode;
  /**
   * Contribute handlers to a scope, creating it if this is the first
   * contribution. The returned function withdraws the contribution, and removes
   * the scope once its last contributor leaves.
   */
  registerScope: (scope: GamepadScopeRegistration) => () => void;
  /** Raw per-frame state, for the debug overlay. Never routed through state. */
  subscribeToFrames: (listener: (snapshot: GamepadSnapshot) => void) => () => void;
  /** Every dispatched intent, with the scope that received it. Debug only. */
  subscribeToIntents: (
    listener: (intent: GamepadIntent, scopeId: string | null) => void,
  ) => () => void;
}

const GamepadContext = createContext<GamepadContextValue | undefined>(undefined);

/** Hoisted so the options object keeps a stable identity across renders —
 * `useEventListener` re-subscribes whenever it changes. */
const PASSIVE: AddEventListenerOptions = { passive: true };

/**
 * Single input router for the whole site.
 *
 * Scopes form a stack and only the **topmost** receives intents — there is no
 * fall-through between scopes. A modal that understands `up`/`down` but not
 * `left` swallows `left` rather than letting the dashboard behind it steer.
 * That is the property `useKeyboardNavigation`'s
 * `document.querySelector('[role="dialog"]')` guard was approximating; Phase 3
 * migrates keyboard input onto this same stack and deletes the sniff.
 *
 * Phase 2 is additive by construction: remove this provider from `layout.tsx`
 * and the entire feature is gone.
 */
export const GamepadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inputMode, setInputMode] = useState<InputMode>('pointer');

  // Gamepad support is desktop-layout only, matching the existing
  // `enabled: !isMobile` gate on keyboard navigation. The provider still mounts
  // on mobile so consumers can call `useGamepadScope` unconditionally — it just
  // never starts a poll loop, and registered scopes sit inert.
  const isMobile = useIsMobile(768);
  const enabled = !isMobile;

  const scopesRef = useRef<RegisteredScope[]>([]);
  const frameListenersRef = useRef<Set<(snapshot: GamepadSnapshot) => void>>(new Set());
  const intentListenersRef = useRef<
    Set<(intent: GamepadIntent, scopeId: string | null) => void>
  >(new Set());
  const inputModeRef = useRef<InputMode>('pointer');

  /**
   * Input mode is an attribute, not a heuristic: styling keys off
   * `<html data-input>` because `:focus-visible` does not reliably fire on
   * programmatic `.focus()`. The attribute is written imperatively from event
   * callbacks, and `setState` runs only on an actual flip — never per frame.
   */
  const applyInputMode = useCallback((mode: InputMode) => {
    if (inputModeRef.current === mode) return;
    inputModeRef.current = mode;
    document.documentElement.dataset.input = mode;
    setInputMode(mode);
  }, []);

  useMountEffect(() => {
    document.documentElement.dataset.input = 'pointer';
  });

  // Pointer mode always returns instantly — never delay giving the cursor back.
  useEventListener(
    typeof window === 'undefined' ? null : window,
    'mousemove',
    () => applyInputMode('pointer'),
    PASSIVE,
  );

  const registerScope = useCallback((scope: GamepadScopeRegistration) => {
    const contribution: ScopeContribution = { getHandlers: scope.getHandlers };

    let entry = scopesRef.current.find((candidate) => candidate.id === scope.id);

    if (!entry) {
      entry = {
        id: scope.id,
        contributions: [],
        restoreFocusOnPop: scope.restoreFocusOnPop ?? false,
        previousFocus:
          typeof document === 'undefined'
            ? null
            : (document.activeElement as HTMLElement | null),
      };
      scopesRef.current.push(entry);
    }

    entry.contributions.push(contribution);
    const owner = entry;

    return () => {
      owner.contributions = owner.contributions.filter(
        (candidate) => candidate !== contribution,
      );
      if (owner.contributions.length > 0) return;

      scopesRef.current = scopesRef.current.filter((candidate) => candidate !== owner);

      // Focus restoration is per-scope: a modal hands focus back to whatever
      // opened it, while a long-lived page scope leaves focus where it is.
      if (!owner.restoreFocusOnPop) return;
      const target = owner.previousFocus;
      if (target?.isConnected) target.focus({ preventScroll: true });
    };
  }, []);

  const subscribeToFrames = useCallback((listener: (snapshot: GamepadSnapshot) => void) => {
    frameListenersRef.current.add(listener);
    return () => {
      frameListenersRef.current.delete(listener);
    };
  }, []);

  const subscribeToIntents = useCallback(
    (listener: (intent: GamepadIntent, scopeId: string | null) => void) => {
      intentListenersRef.current.add(listener);
      return () => {
        intentListenersRef.current.delete(listener);
      };
    },
    [],
  );

  const dispatchIntent = useCallback((intent: GamepadIntent) => {
    const top = scopesRef.current[scopesRef.current.length - 1];

    // Search contributions newest-first so the most recently mounted component
    // wins when two contribute the same intent.
    let handler: (() => void) | undefined;
    for (let i = (top?.contributions.length ?? 0) - 1; i >= 0; i--) {
      handler = top?.contributions[i].getHandlers()[intent];
      if (handler) break;
    }

    intentListenersRef.current.forEach((listener) => listener(intent, top?.id ?? null));

    if (handler) {
      handler();
      return;
    }

    // The one provider-level default. `confirm` activating whatever holds focus
    // is universal, and DOM focus is already the single source of truth for
    // selection — so A works everywhere without every scope re-declaring it.
    if (intent !== 'confirm') return;
    const active = document.activeElement as HTMLElement | null;
    if (active && active !== document.body) active.click();
  }, []);

  const handleActivity = useCallback(() => {
    applyInputMode('gamepad');
  }, [applyInputMode]);

  const handleFrame = useCallback((snapshot: GamepadSnapshot) => {
    frameListenersRef.current.forEach((listener) => listener(snapshot));
  }, []);

  const { connected } = useGamepad({
    enabled,
    onIntent: dispatchIntent,
    onActivity: handleActivity,
    onFrame: handleFrame,
  });

  return (
    <GamepadContext.Provider
      value={{
        connected,
        inputMode,
        registerScope,
        subscribeToFrames,
        subscribeToIntents,
      }}
    >
      {children}
    </GamepadContext.Provider>
  );
};

export const useGamepadContext = (): GamepadContextValue => {
  const context = useContext(GamepadContext);
  if (!context) {
    throw new Error('useGamepadContext must be used within a GamepadProvider');
  }
  return context;
};
