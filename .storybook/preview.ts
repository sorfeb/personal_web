import type { Preview } from '@storybook/nextjs';
import { themes } from '@storybook/theming';
import theme from './theme';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      autodocs: true,
      theme: theme, // Apply theme to docs
    },
    backgrounds: {
      default: 'xbox-dark',
      values: [
        {
          name: 'xbox-dark',
          value: '#0A0A0A',
        },
        {
          name: 'xbox-gray',
          value: '#1E1E1E',
        },
      ],
    },
  },
  tags: ['autodocs'],
};

export default preview;