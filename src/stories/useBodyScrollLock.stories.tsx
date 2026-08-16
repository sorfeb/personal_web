import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

/**
 * Demo component showing useBodyScrollLock hook usage
 */
const BodyScrollLockDemo = ({ withEscapeHandler }: { withEscapeHandler: boolean }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use the hook - locks scroll when modal is open
  useBodyScrollLock(
    isModalOpen,
    withEscapeHandler ? () => setIsModalOpen(false) : undefined
  );

  return (
    <div style={{ padding: '20px' }}>
      {/* Long scrollable content */}
      <div style={{ marginBottom: '20px' }}>
        <h1>Body Scroll Lock Hook Demo</h1>
        <p>This page has lots of scrollable content to demonstrate the scroll lock.</p>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#0078d4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          Open Modal
        </button>
      </div>

      {/* Filler content to make page scrollable */}
      {Array.from({ length: 50 }).map((_, i) => (
        <p key={i} style={{ marginBottom: '20px', lineHeight: '1.6' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
          incididunt ut labore et dolore magna aliqua. Scroll down to see more content.
        </p>
      ))}

      {/* Modal */}
      {isModalOpen && (
        // Story-only backdrop demonstrating the hook; not shipped UI.
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '8px',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
          >
            <h2 style={{ marginTop: 0 }}>Modal Content</h2>
            <p>
              The background scroll is now locked! Try scrolling with:
            </p>
            <ul>
              <li>Mouse wheel</li>
              <li>Touch gestures (on mobile)</li>
              <li>Arrow keys</li>
              <li>Page Up/Down keys</li>
              <li>Home/End keys</li>
              <li>Spacebar</li>
            </ul>
            <p>
              {withEscapeHandler 
                ? 'Press ESC or click outside to close the modal.'
                : 'Click outside to close the modal.'}
            </p>

            {/* Scrollable content inside modal */}
            <div style={{ marginTop: '20px' }}>
              <h3>Scrollable Modal Content</h3>
              {Array.from({ length: 20 }).map((_, i) => (
                <p key={i} style={{ marginBottom: '10px' }}>
                  This content inside the modal is still scrollable. Paragraph {i + 1}.
                </p>
              ))}
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: '#0078d4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Close Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const meta: Meta<typeof BodyScrollLockDemo> = {
  title: 'Hooks/useBodyScrollLock',
  component: BodyScrollLockDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# useBodyScrollLock Hook

A reusable React hook that prevents body scrolling when modals or overlays are open.

## Features

- 🔒 **Multi-method scroll prevention**: Handles wheel, touch, and keyboard events
- ⌨️ **Keyboard support**: Prevents arrow keys, Page Up/Down, Home/End, Space
- 🎯 **ESC key handling**: Optional callback for closing on Escape
- 📱 **Mobile-friendly**: Smart touch event handling with scrollable content detection
- 🔄 **Scroll restoration**: Automatically restores scroll position on cleanup
- 🧹 **Clean cleanup**: Properly removes all event listeners and restores styles

## Usage

\`\`\`tsx
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

const Modal = ({ isOpen, onClose }) => {
  // Lock scroll when modal is open, close on ESC
  useBodyScrollLock(isOpen, onClose);
  
  return isOpen ? <div>Modal content</div> : null;
};
\`\`\`

## Implementation

The hook handles:
1. CSS-based scroll locking (\`overflow: hidden\`, \`position: fixed\`)
2. Wheel event prevention (desktop scrolling)
3. Touch event prevention (mobile scrolling) with smart scrollable content detection
4. Keyboard event prevention (arrow keys, Page Up/Down, etc.)
5. Scroll position preservation and restoration
6. Clean event listener cleanup

## Best Practices

- ✅ Use for full-screen modals and overlays
- ✅ Pass cleanup function as second parameter for ESC handling
- ✅ Ensure \`isLocked\` boolean accurately reflects modal state
- ❌ Don't use for inline popovers or tooltips
- ❌ Don't nest multiple scroll locks (use single parent modal)
        `,
      },
    },
  },
  argTypes: {
    withEscapeHandler: {
      control: 'boolean',
      description: 'Whether to include ESC key handler',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BodyScrollLockDemo>;

/**
 * Default story showing the hook with ESC key handling
 */
export const WithEscapeHandler: Story = {
  args: {
    withEscapeHandler: true,
  },
};

/**
 * Story showing the hook without ESC key handling
 */
export const WithoutEscapeHandler: Story = {
  args: {
    withEscapeHandler: false,
  },
};
