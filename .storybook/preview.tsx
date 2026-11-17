import type { Preview } from '@storybook/react-vite';
import React from 'react';
import '../styles/app.scss';
import { docsTheme } from './theme'; // added
import FlashMessages from '../components/FlashMessages';
import { FlashMessagesProvider, useFlashMessagesContext } from '../contexts/FlashMessagesContext';

// The preview object configures global Storybook parameters & globals.
const preview: Preview = {
  initialGlobals: {
    locale: 'en-US',

    backgrounds: {
      value: 'bt-dark',
    },
  },
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
      options: {
        'bt-dark': { name: 'bt-dark', value: '#0A0A0A' },
        transparent: { name: 'transparent', value: 'transparent' },
        white: { name: 'white', value: '#FFFFFF' },
      },
    },
    docs: {
      // added
      theme: docsTheme,
    },
  },
};

// Renders flashes added by components (via useFlashMessagesContext) like the shell does in the extension
const StoryFlashMessages = () => {
  const { flashMessages, dismissFlash } = useFlashMessagesContext();
  return <FlashMessages flashMessages={flashMessages} onDismiss={flash => dismissFlash(flash.id)} />;
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
      <FlashMessagesProvider>
        <div className="sb-font-wrapper" style={{ padding: '1rem' }}>
          <Story />
        </div>
        <StoryFlashMessages />
      </FlashMessagesProvider>
    );
  },
];

export default preview;
