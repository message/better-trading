import type { Preview } from '@storybook/react-vite';
import React from 'react';
import '../styles/app.scss';
import { docsTheme } from './theme'; // added

// The preview object configures global Storybook parameters & globals.
const preview: Preview = {
  initialGlobals: { locale: 'en-US' },
  globalTypes: {
    locale: {
      name: 'Locale',
      description: 'Active language locale (sets <html lang=...>)',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en-US', right: '🇺🇸', title: 'English' },
          { value: 'ru-RU', right: '🇷🇺', title: 'Russian' },
          { value: 'ko-KR', right: '🇰🇷', title: 'Korean' },
          { value: 'ja-JP', right: '🇯🇵', title: 'Japanese' },
          { value: 'pt-BR', right: '🇧🇷', title: 'Portuguese' },
          { value: 'th-TH', right: '🇹🇭', title: 'Thai' },
          { value: 'de-DE', right: '🇩🇪', title: 'German' },
          { value: 'fr-FR', right: '🇫🇷', title: 'French' },
          { value: 'es-ES', right: '🇪🇸', title: 'Spanish' },
        ],
        showName: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    backgrounds: {
      default: 'bt-dark',
      values: [
        { name: 'bt-dark', value: '#0A0A0A' },
        { name: 'transparent', value: 'transparent' },
        { name: 'white', value: '#FFFFFF' },
      ],
    },
    docs: { // added
      theme: docsTheme,
    },
  },
};

export const decorators = [
  (Story: any, context: { globals?: Record<string, any> }) => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('bt-body');
      document.body.style.backgroundColor = '#0A0A0A';
      document.body.style.color = '#FFFFFF';
      document.body.style.minHeight = '100vh';
      const locale = context.globals?.locale || 'en-US';
      if (document.documentElement.lang !== locale) {
        document.documentElement.lang = locale;
      }
    }
    return (
      <div className="sb-font-wrapper" style={{ padding: '1rem' }}>
        <Story />
      </div>
    );
  },
];

export default preview;
