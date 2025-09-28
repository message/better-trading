// Custom Storybook docs theme to match Better Trading dark background
// This affects only Docs pages when assigned via parameters.docs.theme
import { create } from 'storybook/theming';

export const docsTheme = create({
  base: 'dark',
  brandTitle: 'Better Trading',
  brandUrl: 'https://github.com/poe-world/better-trading',
  // Core surfaces
  appBg: '#0A0A0A',
  appContentBg: '#0A0A0A',
  barBg: '#121212',
  // Text & colors
  textColor: '#FFFFFF',
  textInverseColor: '#0A0A0A',
  colorPrimary: '#E9CF9F',
  colorSecondary: '#C49E4A',
  // Code / syntax blocks (fallbacks)
  inputBg: '#1A1A1A',
  inputBorder: '#333333',
  // Grid / border accents
  appBorderColor: '#222222',
  appBorderRadius: 4,
});

console.log('Docs theme:', docsTheme);

export default docsTheme;
