import { useCallback, useEffect, useRef, useState } from 'react';
import type { GamepadIntent, GamepadSnapshot } from '@/types/gamepad';
import {
  BUTTON_INTENTS,
  GAMEPAD_AXIS,
  GAMEPAD_TIMING,
} from '@/constants/gamepadMap';
import { REPEATABLE_INTENTS } from '@/types/gamepad';

interface UseGamepadProps {
  /** Master switch. Desktop-layout only, matching the existing `!isMobile` gate. */
  enabled?: boolean;
  /** Called once per intent edge, and again on each auto-repeat tick. */
  onIntent: (intent: GamepadIntent) => void;
  /** Called on any controller activity — used to flip the page into gamepad mode. */
  onActivity?: () => void;
  /**
   * Called with raw state once per polled frame. Consumers **must not** call
   * `setState` from here; it exists so the debug overlay can write to the DOM
   * directly at 60Hz without dragging React through every frame.
   */
  onFrame?: (snapshot: GamepadSnapshot) => void;
}

const isPressed = (button: GamepadButton): boolean =>
  button.pressed || button.value > 0.5;

/**
 * Polls the Gamepad API and emits normalised intents.
 *
 * Two platform facts shape this hook:
 *
 * 1. **There are no button events.** `navigator.getGamepads()` reports state,
 *    so edges have to be derived by diffing frames ourselves.
 * 2. **Chrome returns frozen snapshots.** The objects `getGamepads()` hands back
 *    do not update in place, so caching one silently freezes input. It is
 *    re-called every single frame, on purpose.
 *
 * All per-frame state lives in refs. `setState` fires only on connect and
 * disconnect — never once per frame — so a resting controller costs no renders.
 * `requestAnimationFrame` also self-suspends on hidden tabs, which a
 * `setInterval` poll would not.
 */
export const useGamepad = ({
  enabled = true,
  onIntent,
  onActivity,
  onFrame,
}: UseGamepadProps) => {
  const [connected, setConnected] = useState(false);

  const frameRef = useRef<number | null>(null);
  /** Intent → timestamp at which it may fire again. Also acts as the held-set. */
  const repeatAtRef = useRef<Map<GamepadIntent, number>>(new Map());

  // Handlers are read through refs so that a caller re-creating its callbacks
  // does not tear down and restart the polling loop.
  const onIntentRef = useRef(onIntent);
  const onActivityRef = useRef(onActivity);
  const onFrameRef = useRef(onFrame);
  onIntentRef.current = onIntent;
  onActivityRef.current = onActivity;
  onFrameRef.current = onFrame;

  /**
   * Pick the pad to listen to. Wireless receivers expose four slots whether or
   * not they are populated, so `getGamepads()` commonly returns
   * `[pad, null, null, null]` — and after a hot-unplug the live pad can sit at
   * a non-zero index. Standard-mapping pads win; anything else is a fallback.
   */
  const readActivePad = useCallback((): Gamepad | null => {
    if (typeof navigator === 'undefined' || !navigator.getGamepads) return null;
    const pads = Array.from(navigator.getGamepads()).filter(
      (pad): pad is Gamepad => pad !== null && pad.connected,
    );
    if (pads.length === 0) return null;
    return pads.find((pad) => pad.mapping === 'standard') ?? pads[0];
  }, []);

  /** Collect every intent the pad is asserting this frame. */
  const readIntents = useCallback((pad: Gamepad): Set<GamepadIntent> => {
    const active = new Set<GamepadIntent>();

    pad.buttons.forEach((button, index) => {
      if (!isPressed(button)) return;
      const intent = BUTTON_INTENTS[index];
      if (intent) active.add(intent);
    });

    // Left stick, discrete. Only the dominant axis contributes: a menu step is
    // a yes/no decision, and letting a diagonal push fire both axes at once
    // makes the stick feel like it is guessing.
    const x = pad.axes[GAMEPAD_AXIS.LEFT_X] ?? 0;
    const y = pad.axes[GAMEPAD_AXIS.LEFT_Y] ?? 0;
    const { DEADZONE } = GAMEPAD_TIMING;

    if (Math.abs(x) >= DEADZONE || Math.abs(y) >= DEADZONE) {
      if (Math.abs(x) > Math.abs(y)) {
        active.add(x < 0 ? 'left' : 'right');
      } else {
        // Standard mapping puts stick-up at -1.
        active.add(y < 0 ? 'up' : 'down');
      }
    }

    return active;
  }, []);

  const poll = useCallback(
    (now: number) => {
      frameRef.current = requestAnimationFrame(poll);

      const pad = readActivePad();
      if (!pad) {
        repeatAtRef.current.clear();
        return;
      }

      onFrameRef.current?.({
        connected: true,
        id: pad.id,
        index: pad.index,
        mapping: pad.mapping,
        buttons: pad.buttons.map((button) => button.value),
        axes: Array.from(pad.axes),
      });

      const active = readIntents(pad);
      const repeatAt = repeatAtRef.current;

      // Release anything no longer asserted, so the next press is a fresh edge.
      repeatAt.forEach((_, intent) => {
        if (!active.has(intent)) repeatAt.delete(intent);
      });

      if (active.size > 0) onActivityRef.current?.();

      active.forEach((intent) => {
        const nextAllowedAt = repeatAt.get(intent);

        if (nextAllowedAt === undefined) {
          // Rising edge — always fires immediately.
          repeatAt.set(intent, now + GAMEPAD_TIMING.REPEAT_DELAY_MS);
          onIntentRef.current(intent);
          return;
        }

        // Held. Only directional intents repeat; a held A must not re-activate
        // the focused control several times per second.
        if (!REPEATABLE_INTENTS.includes(intent)) return;
        if (now < nextAllowedAt) return;

        repeatAt.set(intent, now + GAMEPAD_TIMING.REPEAT_INTERVAL_MS);
        onIntentRef.current(intent);
      });
    },
    [readActivePad, readIntents],
  );

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // A pad is invisible to `getGamepads()` until the user presses something —
    // browsers gate it behind that interaction — so `gamepadconnected` is the
    // real signal. It can also have fired before this hook mounted, hence the
    // initial read.
    const syncConnected = () => setConnected(readActivePad() !== null);

    const handleConnected = () => setConnected(true);
    const handleDisconnected = () => {
      repeatAtRef.current.clear();
      syncConnected();
    };

    syncConnected();
    window.addEventListener('gamepadconnected', handleConnected);
    window.addEventListener('gamepaddisconnected', handleDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleConnected);
      window.removeEventListener('gamepaddisconnected', handleDisconnected);
    };
  }, [enabled, readActivePad]);

  useEffect(() => {
    if (!enabled || !connected || typeof window === 'undefined') return;

    // Captured here rather than read in the cleanup: the Map is created once by
    // `useRef` and never replaced, so this is the same object either way — but
    // reading `.current` from a cleanup is the pattern that hides real bugs, and
    // the lint is right to flag it.
    const heldIntents = repeatAtRef.current;
    frameRef.current = requestAnimationFrame(poll);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      heldIntents.clear();
    };
  }, [enabled, connected, poll]);

  return { connected };
};
