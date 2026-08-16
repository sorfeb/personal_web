import { useCallback, useEffect, useRef } from 'react';
import { useGamepadContext } from '@/context/GamepadContext';
import type { GamepadIntentHandlers } from '@/types/gamepad';

interface UseGamepadScopeProps {
  /** Stable identifier — used for debugging and stack bookkeeping. */
  id: string;
  /** Intents this scope understands. May be re-created every render. */
  handlers: GamepadIntentHandlers;
  /** Skip registration entirely (e.g. the mobile layout). */
  enabled?: boolean;
  /**
   * Hand focus back to whatever held it when this scope was pushed. Modals want
   * this; a long-lived page scope does not.
   */
  restoreFocusOnPop?: boolean;
}

/**
 * Register a scope on the input router's stack for as long as this component is
 * mounted. Only the topmost scope receives intents.
 *
 * Handlers are read through a ref, so a component that re-creates its callbacks
 * on every render does not churn the stack — which would otherwise reorder it
 * and hand control to the wrong scope.
 *
 * @example
 * ```tsx
 * useGamepadScope({
 *   id: 'dashboard',
 *   enabled: !isMobile,
 *   handlers: { left: navigateLeft, right: navigateRight },
 * });
 * ```
 */
export const useGamepadScope = ({
  id,
  handlers,
  enabled = true,
  restoreFocusOnPop = false,
}: UseGamepadScopeProps) => {
  const { registerScope } = useGamepadContext();

  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const getHandlers = useCallback(() => handlersRef.current, []);

  useEffect(() => {
    if (!enabled) return;
    return registerScope({ id, getHandlers, restoreFocusOnPop });
  }, [enabled, id, restoreFocusOnPop, registerScope, getHandlers]);
};
