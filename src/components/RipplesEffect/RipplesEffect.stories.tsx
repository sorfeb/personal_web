import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import RipplesEffect from './RipplesEffect';

/**
 * RipplesEffect component adds interactive water ripple effects to child elements
 * using jQuery Ripples plugin with automatic rain drops.
 */
const meta: Meta<typeof RipplesEffect> = {
  title: 'Effects/RipplesEffect',
  component: RipplesEffect,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A wrapper component that adds interactive water ripple effects to any content using jQuery Ripples plugin. Includes automatic rain drop animation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'The content to wrap with ripple effects',
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic ripple effect with sample content
 */
export const Default: Story = {
  args: {
    children: (
      <div style={{ 
        height: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        Click anywhere to create ripples!
      </div>
    ),
  },
};

/**
 * Ripple effect with image background
 */
export const WithImageBackground: Story = {
  args: {
    children: (
      <div style={{ 
        height: '100vh', 
        backgroundImage: 'url(/assets/wallpapers/xbox360.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
      }}>
        Interactive Background with Ripples
      </div>
    ),
  },
};

/**
 * Ripple effect with content overlay
 */
export const WithContentOverlay: Story = {
  args: {
    children: (
      <div style={{ 
        height: '100vh', 
        background: 'linear-gradient(45deg, #1e3c72 0%, #2a5298 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: '20px'
      }}>
        <h1>Welcome to the Interactive Experience</h1>
        <p>Move your mouse or click to interact with the water effect</p>
        <button style={{
          padding: '10px 20px',
          marginTop: '20px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          color: 'white',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Try Me!
        </button>
      </div>
    ),
  },
};
