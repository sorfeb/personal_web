'use client';

import React, { useMemo, useRef, useState } from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import Tabs, { type TabItem, type TabsHandle } from '../../components/ui/Tabs';
import ChatRoom from '../../components/Chat/ChatRoom/ChatRoom';
import { trpc } from '../../utils/trpc';
import { DEFAULT_ROOM_SLUG } from '../../constants/chat';
import { PAGE_SCOPE_ID } from '../../constants/pageNavigation';
import { useGamepadScope } from '../../hooks/useGamepadScope';
import { useIsMobile } from '../../utils/responsiveUtils';

/**
 * Chat page: a room switcher over the transcript.
 *
 * The switcher is `ui/Tabs`, not a bespoke list. Tabs already carries the whole
 * WAI-ARIA tabs pattern — roving tabindex so the bar is one tab stop, a
 * focusable panel so D-pad `down` lands somewhere, badges, and audio.
 *
 * Horizontal rather than a sidebar: the Xbox 360 Guide header is a horizontal
 * tab bar, and `Tabs` is built for that shape. A vertical room list is the Mac
 * idiom, which is ryOS's premise rather than this one.
 *
 * The gamepad contribution lives here rather than inside `ChatRoom` because
 * `PAGE_SCOPE_ID` reads its config from whichever contributor registers first,
 * and React commits child effects before parent ones — so it has to come from
 * the component that *renders* PageLayout. LB/RB switch rooms, leaving the
 * D-pad to PageLayout's spatial navigation so the two never fight for a press.
 */
export default function ChatroomPage() {
  const [activeSlug, setActiveSlug] = useState<string>(DEFAULT_ROOM_SLUG);
  const tabsRef = useRef<TabsHandle>(null);
  const isMobile = useIsMobile(768);

  const { data: rooms } = trpc.rooms.list.useQuery();

  useGamepadScope({
    id: PAGE_SCOPE_ID,
    enabled: !isMobile,
    handlers: {
      pageLeft: () => tabsRef.current?.selectRelative(-1),
      pageRight: () => tabsRef.current?.selectRelative(1),
    },
  });

  const items: readonly TabItem[] = useMemo(
    () =>
      (rooms ?? []).map((room) => ({
        value: room.slug,
        label: room.name,
        badge: room._count.messages,
        // The bare number reads as nonsense in a screen reader without this.
        badgeLabel: `${room._count.messages} messages`,
      })),
    [rooms]
  );

  /*
   * A switcher over a single room is chrome with nothing to switch between, so
   * it stays hidden until a second room exists. Rooms are owner-only to create
   * (`rooms.create` is an ownerProcedure), so this is the normal state until
   * one is added deliberately.
   */
  const showSwitcher = items.length > 1;

  return (
    <PageLayout title="Chat" size="wide">
      <PageLayout.Header />
      <PageLayout.Body>
        {showSwitcher ? (
          <Tabs
            ref={tabsRef}
            items={items}
            value={activeSlug}
            onChange={setActiveSlug}
            label="Chat rooms"
            variant="segmented"
          >
            {items.map((item) => (
              // Tabs.Panel renders null unless active, so only the open room's
              // transcript mounts and only it polls.
              <Tabs.Panel key={item.value} value={item.value}>
                <ChatRoom roomSlug={item.value} roomName={item.label} />
              </Tabs.Panel>
            ))}
          </Tabs>
        ) : (
          <ChatRoom roomSlug={activeSlug} />
        )}
      </PageLayout.Body>
    </PageLayout>
  );
}
