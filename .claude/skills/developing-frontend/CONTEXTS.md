# Context Providers

## Available Contexts

| Context | Location | Purpose |
|---------|----------|---------|
| VolumeContext | `src/context/VolumeContext.tsx` | Global audio volume |
| BackgroundContext | `src/context/BackgroundContext.tsx` | Background theme |
| CRTFilterContext | `src/context/CRTFilterContext.tsx` | Retro visual effects |
| ShepherdTourContext | `src/context/ShepherdTourContext.tsx` | Guided tours |
| ToastContext | `src/context/ToastContext.tsx` | Toast notifications |
| PageLayout.context | `src/context/PageLayout.context.tsx` | Layout state |

## Usage Pattern

```tsx
'use client';

import { useVolume } from '@/context/VolumeContext';

const Component = () => {
  const { volume, setVolume } = useVolume();
  // ...
};
```

## Context Pattern Template

```tsx
'use client';

import React, { createContext, useContext, useState } from 'react';

interface FeatureContextProps {
  value: string;
  setValue: (value: string) => void;
}

const FeatureContext = createContext<FeatureContextProps | undefined>(undefined);

export const FeatureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [value, setValue] = useState('default');

  return (
    <FeatureContext.Provider value={{ value, setValue }}>
      {children}
    </FeatureContext.Provider>
  );
};

export const useFeature = (): FeatureContextProps => {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error('useFeature must be used within FeatureProvider');
  }
  return context;
};
```

## Storybook Context Mocking

```tsx
import { VolumeProvider } from '@/context/VolumeContext';
import { QueryClientProvider } from '@tanstack/react-query';

const meta: Meta<typeof Component> = {
  decorators: [
    (Story) => (
      <VolumeProvider>
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      </VolumeProvider>
    ),
  ],
};
```