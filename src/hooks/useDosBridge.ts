import { useCallback, useEffect, useRef, useState } from 'react';
import { useGamepadContext } from '@/context/GamepadContext';
import { useVolume } from '@/context/VolumeContext';
import { GAMEPAD_AXIS, GAMEPAD_BUTTON, GAMEPAD_TIMING } from '@/constants/gamepadMap';
import type { GamepadSnapshot } from '@/types/gamepad';
import type { DosGame } from '@/data/gamesList';

/**
 * Named keys understood by public/embed/dos.html, which owns the mapping to
 * js-dos numeric key codes. The bridge speaks names so the wire protocol stays
 * readable in devtools.
 */
type DosKey = 'up' | 'down' | 'left' | 'right' | 'ctrl' | 'space' | 'alt' | 'enter' | 'esc';

export type DosStatus = 'booting' | 'running' | 'exited';

/** How long B must be held before the set powers off — long enough that a
 * panicked dodge-tap in Doom never quits the game. */
const QUIT_HOLD_MS = 800;

const PRESSED = 0.5; // digital buttons report analog values; past this is "down"

interface UseDosBridgeProps {
  game: DosGame;
  /** Fires once when the player holds B to power off. */
  onQuitRequest: () => void;
  enabled?: boolean;
}

/**
 * Everything that flows between the site and the DOS emulator iframe:
 *
 * - postMessage uplink (volume changes, synthesized keys)
 * - downlink events (`dos:ci-ready`, `dos:exit`) folded into a status
 * - gamepad → DOS key synthesis, reading raw pad frames and emitting
 *   key-down/key-up **edges only** (the intent layer's auto-repeat is right
 *   for menus and wrong for games, so this taps the frame stream instead)
 * - hold-B-to-quit detection
 *
 * Lives in src/hooks/ so its effects are exempt from the no-useEffect policy;
 * state lives in refs and React state changes only on discrete edges.
 */
export const useDosBridge = ({ game, onQuitRequest, enabled = true }: UseDosBridgeProps) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [status, setStatus] = useState<DosStatus>('booting');

  const { volume } = useVolume();
  const { subscribeToFrames } = useGamepadContext();

  // The boot volume rides the URL so the emulator never plays at the wrong
  // level; later changes go over postMessage. The URL must stay stable across
  // volume changes or the iframe would reboot, hence the ref.
  const bootVolumeRef = useRef(volume);
  const embedSrc = `/embed/dos.html?bundle=${encodeURIComponent(game.bundleUrl)}&volume=${bootVolumeRef.current}`;

  const post = useCallback((message: Record<string, unknown>) => {
    iframeRef.current?.contentWindow?.postMessage(message, window.location.origin);
  }, []);

  const onQuitRef = useRef(onQuitRequest);
  onQuitRef.current = onQuitRequest;

  // Downlink: emulator lifecycle events from the embed page.
  useEffect(() => {
    if (!enabled) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== iframeRef.current?.contentWindow) return;
      const type = (event.data as { type?: string } | null)?.type;

      if (type === 'dos:ci-ready') {
        setStatus('running');
        // DOS keyboard input flows through the iframe's own listeners.
        iframeRef.current?.focus();
      } else if (type === 'dos:exit') {
        setStatus('exited');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [enabled]);

  // Uplink: keep emulator volume in step with the site's volume control.
  useEffect(() => {
    if (!enabled) return;
    post({ type: 'dos:set-volume', volume });
  }, [volume, enabled, post]);

  // Gamepad → DOS keys. Runs per frame but touches React never: previous
  // pressed-states live in a ref and only edges cross the postMessage wire.
  useEffect(() => {
    if (!enabled) return;

    const pressed: Partial<Record<DosKey, boolean>> = {};
    let quitHeldSince: number | null = null;
    let quitFired = false;

    const send = (key: DosKey, down: boolean) => {
      if (Boolean(pressed[key]) === down) return;
      pressed[key] = down;
      post({ type: 'dos:key', key, pressed: down });
    };

    const unsubscribe = subscribeToFrames((snapshot: GamepadSnapshot) => {
      if (!snapshot.connected) return;
      const { buttons, axes } = snapshot;
      const button = (index: number) => (buttons[index] ?? 0) > PRESSED;

      send('up', button(GAMEPAD_BUTTON.DPAD_UP) || (axes[GAMEPAD_AXIS.LEFT_Y] ?? 0) < -GAMEPAD_TIMING.DEADZONE);
      send('down', button(GAMEPAD_BUTTON.DPAD_DOWN) || (axes[GAMEPAD_AXIS.LEFT_Y] ?? 0) > GAMEPAD_TIMING.DEADZONE);
      send('left', button(GAMEPAD_BUTTON.DPAD_LEFT) || (axes[GAMEPAD_AXIS.LEFT_X] ?? 0) < -GAMEPAD_TIMING.DEADZONE);
      send('right', button(GAMEPAD_BUTTON.DPAD_RIGHT) || (axes[GAMEPAD_AXIS.LEFT_X] ?? 0) > GAMEPAD_TIMING.DEADZONE);
      send('ctrl', button(GAMEPAD_BUTTON.A)); // fire
      send('space', button(GAMEPAD_BUTTON.X)); // use / open doors
      send('alt', button(GAMEPAD_BUTTON.Y)); // strafe / pogo
      send('enter', button(GAMEPAD_BUTTON.START));
      send('esc', button(GAMEPAD_BUTTON.BACK)); // in-game menu

      // Hold B to power off. A tap does nothing here — the input router's
      // scope stack swallows the 'back' intent, so B is safe to rest on.
      if (button(GAMEPAD_BUTTON.B)) {
        quitHeldSince ??= performance.now();
        if (!quitFired && performance.now() - quitHeldSince >= QUIT_HOLD_MS) {
          quitFired = true;
          onQuitRef.current();
        }
      } else {
        quitHeldSince = null;
        quitFired = false;
      }
    });

    return () => {
      // Release anything still held so the game doesn't run into a wall forever.
      (Object.keys(pressed) as DosKey[]).forEach((key) => {
        if (pressed[key]) post({ type: 'dos:key', key, pressed: false });
      });
      unsubscribe();
    };
  }, [enabled, post, subscribeToFrames]);

  return { iframeRef, embedSrc, status };
};
