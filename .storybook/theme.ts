import { create } from 'storybook/theming';

export default create({
  base: 'dark',
  
  // Branding only
  brandTitle: 'Soros Personal Web',
  brandUrl: 'https://www.sorosfebria.co',
  brandImage: '/favicon.svg',
  brandTarget: '_self',

  // Essential colors only
  colorPrimary: '#6CB82B',
  colorSecondary: '#7CD93A',
});
