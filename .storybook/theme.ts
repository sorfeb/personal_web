import { create } from '@storybook/theming';

export default create({
  base: 'dark',
  
  // Branding
  brandTitle: 'Soros Personal Web',
  brandUrl: 'https://github.com/sorfeb/personal_web',
  brandImage: '/favicon.svg', // Using your existing favicon
  brandTarget: '_self',

  // Colors - Based on your Xbox theme
  colorPrimary: '#6CB82B', // Xbox green from your gradients
  colorSecondary: '#7CD93A', // Lighter Xbox green

  // UI
  appBg: '#1E1E1E', // Dark background from your PageLayout
  appContentBg: '#2A2A2A', // Slightly lighter for content
  appPreviewBg: '#1E1E1E', // Match your main background
  appBorderColor: 'rgba(255, 255, 255, 0.1)', // Subtle white border like your components
  appBorderRadius: 10, // Matching your border radius

  // Text colors
  textColor: '#FFFFFF', // White text like your components
  textInverseColor: '#1E1E1E', // Dark text for light backgrounds
  textMutedColor: 'rgba(255, 255, 255, 0.7)', // Muted white

  // Toolbar default and active colors
  barTextColor: '#FFFFFF',
  barSelectedColor: '#6CB82B', // Xbox green for selected items
  barHoverColor: '#7CD93A', // Lighter green for hover
  barBg: 'linear-gradient(145deg, rgba(108, 184, 43, 0.6), rgba(78, 156, 27, 0.6))', // Your Xbox gradient

  // Form colors
  inputBg: 'rgba(255, 255, 255, 0.1)', // Subtle input background
  inputBorder: 'rgba(255, 255, 255, 0.2)', // Input border
  inputTextColor: '#FFFFFF',
  inputBorderRadius: 8,

  // Buttons
  buttonBg: 'linear-gradient(145deg, rgba(108, 184, 43, 0.6), rgba(78, 156, 27, 0.6))',
  buttonBorder: 'rgba(255, 255, 255, 0.1)',

  // Boolean controls
  booleanBg: 'rgba(255, 255, 255, 0.1)',
  booleanSelectedBg: '#6CB82B',

  // Grid colors
  gridCellSize: 12,
});
