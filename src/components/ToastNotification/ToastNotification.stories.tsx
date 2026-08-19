import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ToastNotification from './ToastNotification';
import ToastContainer from './ToastContainer';
import { ToastProvider } from '../../context/ToastContext';
import { VolumeProvider } from '../../context/VolumeContext';
import { useToast } from '../../hooks/useToast';
import { createAchievementToast, createSystemToast } from '../../utils/toastUtils';

const meta = {
  title: 'Components/ToastNotification',
  component: ToastNotification,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Xbox 360-style toast notification with badge crossfade animations. Displays in the lower third of the screen for system notifications and achievement unlocks.',
      },
    },
  },
  decorators: [
    (Story) => (
      <VolumeProvider>
        <ToastProvider>
          {/* Bottom-anchored column mirroring ToastContainer's stack layout */}
          <div
            style={{
              width: '100vw',
              height: '100vh',
              background: '#1a1d22',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '16px',
              paddingBottom: '4rem',
            }}
          >
            <Story />
          </div>
          {/* Renders toasts triggered via useToast() in the Interactive story */}
          <ToastContainer />
        </ToastProvider>
      </VolumeProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ToastNotification>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Achievement toast with badge crossfade animation
 */
export const AchievementUnlocked: Story = {
  args: {
    id: 'achievement-1',
    type: 'achievement',
    badge: {
      primaryIcon: '/assets/icons/dashboard/xbox-logo.svg',
      secondaryIcon: '/assets/icons/dashboard/trophy.svg',
      ringColor: 'success',
    },
    title: 'Achievement unlocked',
    subtitle: '15G – Village of Adanti',
    duration: 5000,
    showProgressBar: true,
  },
};

/**
 * System notification - Success
 */
export const SystemSuccess: Story = {
  args: {
    id: 'system-success',
    type: 'system',
    badge: {
      primaryIcon: '/assets/icons/dashboard/check-circle.svg',
      ringColor: 'success',
    },
    title: 'Profile updated successfully',
    subtitle: 'Your changes have been saved',
    duration: 4000,
    showProgressBar: false,
  },
};

/**
 * System notification - Error
 */
export const SystemError: Story = {
  args: {
    id: 'system-error',
    type: 'system',
    badge: {
      primaryIcon: '/assets/icons/dashboard/error-circle.svg',
      ringColor: 'error',
    },
    title: 'Connection failed',
    subtitle: 'Please check your internet connection',
    duration: 4000,
  },
};

/**
 * System notification - Info
 */
export const SystemInfo: Story = {
  args: {
    id: 'system-info',
    type: 'system',
    badge: {
      primaryIcon: '/assets/icons/dashboard/info-circle.svg',
      ringColor: 'info',
    },
    title: 'Update available',
    subtitle: 'A new version is ready to install',
    duration: 4000,
  },
};

/**
 * System notification - Warning
 */
export const SystemWarning: Story = {
  args: {
    id: 'system-warning',
    type: 'system',
    badge: {
      primaryIcon: '/assets/icons/dashboard/warning-triangle.svg',
      ringColor: 'warning',
    },
    title: 'Storage almost full',
    subtitle: '90% of available space used',
    duration: 4000,
  },
};

/**
 * Long text stress test
 */
export const LongText: Story = {
  args: {
    id: 'long-text',
    type: 'achievement',
    badge: {
      primaryIcon: '/assets/icons/dashboard/xbox-logo.svg',
      secondaryIcon: '/assets/icons/dashboard/trophy.svg',
      ringColor: 'success',
    },
    title: 'This is a very long achievement title that should be truncated',
    subtitle: 'This is an extremely long subtitle that describes the achievement in excessive detail and should also be truncated appropriately',
    duration: 5000,
  },
};

/**
 * No subtitle variant
 */
export const NoSubtitle: Story = {
  args: {
    id: 'no-subtitle',
    type: 'system',
    badge: {
      primaryIcon: '/assets/icons/dashboard/check-circle.svg',
      ringColor: 'success',
    },
    title: 'Action completed',
    duration: 3000,
  },
};

/**
 * With progress bar
 */
export const WithProgressBar: Story = {
  args: {
    id: 'with-progress',
    type: 'system',
    badge: {
      primaryIcon: '/assets/icons/dashboard/info-circle.svg',
      ringColor: 'info',
    },
    title: 'Processing request',
    subtitle: 'This will take a few seconds',
    duration: 6000,
    showProgressBar: true,
  },
};

/**
 * Interactive example using context hook
 */
function InteractiveToastDemo() {
  const { showToast } = useToast();

  const handleShowAchievement = () => {
    showToast(
      createAchievementToast(
        'Achievement unlocked',
        '15G – Explorer Badge',
        '/assets/icons/dashboard/trophy.svg'
      )
    );
  };

  const handleShowSuccess = () => {
    showToast(
      createSystemToast('Operation successful', 'success')
    );
  };

  const handleShowError = () => {
    showToast(
      createSystemToast('Something went wrong', 'error')
    );
  };

  const handleShowInfo = () => {
    showToast(
      createSystemToast('New message received', 'info')
    );
  };

  const handleShowWarning = () => {
    showToast(
      createSystemToast('Low battery warning', 'warning')
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '32px',
      alignItems: 'flex-start',
    }}>
      <h2 style={{ color: 'white', marginBottom: '16px' }}>Interactive Toast Demo</h2>
      <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '24px' }}>
        Click buttons below to trigger different toast notifications
      </p>
      
      <button
        onClick={handleShowAchievement}
        style={{
          padding: '12px 24px',
          background: '#22c55e',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Show Achievement
      </button>
      
      <button
        onClick={handleShowSuccess}
        style={{
          padding: '12px 24px',
          background: '#22c55e',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Show Success
      </button>
      
      <button
        onClick={handleShowError}
        style={{
          padding: '12px 24px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Show Error
      </button>
      
      <button
        onClick={handleShowInfo}
        style={{
          padding: '12px 24px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Show Info
      </button>
      
      <button
        onClick={handleShowWarning}
        style={{
          padding: '12px 24px',
          background: '#f59e0b',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Show Warning
      </button>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveToastDemo />,
  args: {
    id: 'interactive',
    type: 'system',
    badge: {
      primaryIcon: '/assets/icons/dashboard/info-circle.svg',
      ringColor: 'info',
    },
    title: 'Interactive Demo',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing how to use the toast system with the `useToast()` hook and utility functions.',
      },
    },
  },
};
