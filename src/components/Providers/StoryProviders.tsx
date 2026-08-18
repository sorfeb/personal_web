'use client';

import React, { useState, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '../../utils/trpc';
import { BackgroundProvider } from '../../context/BackgroundContext';
import { CRTFilterProvider } from '../../context/CRTFilterContext';
import { VolumeProvider } from '../../context/VolumeContext';
import { GamepadProvider } from '../../context/GamepadContext';
import { WMPPlayerProvider } from '../../context/WMPPlayerContext';
import { ToastProvider } from '../../context/ToastContext';
import { AchievementProvider } from '../../context/AchievementContext';

/**
 * Storybook-only provider stack mirroring the app's layout.tsx pyramid, so
 * stories can render components that consume audio, toasts and achievements.
 * tRPC calls fail harmlessly inside Storybook (no API routes) — queries fall
 * back to their guest/loading states.
 */
export const StoryProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: Infinity } },
      })
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({ links: [httpBatchLink({ url: '/api/trpc' })] })
  );

  return (
    <BackgroundProvider>
      <CRTFilterProvider>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <VolumeProvider>
              <GamepadProvider>
                <WMPPlayerProvider>
                  <ToastProvider>
                    <AchievementProvider>{children}</AchievementProvider>
                  </ToastProvider>
                </WMPPlayerProvider>
              </GamepadProvider>
            </VolumeProvider>
          </QueryClientProvider>
        </trpc.Provider>
      </CRTFilterProvider>
    </BackgroundProvider>
  );
};

export default StoryProviders;
