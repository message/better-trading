import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import AlertMessage from './index.tsx';

/**
 * AlertMessage displays a short status or warning block with an icon.
 *
 * NOTE: The `message` prop is rendered via `dangerouslySetInnerHTML`, so only pass
 * trusted / sanitized HTML. In normal application code you should sanitize user-provided
 * content before passing it here.
 */
const meta = {
  component: AlertMessage,
  title: 'Components/AlertMessage',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    type: {
      control: { type: 'radio' },
      options: ['success', 'warning', 'alert'],
      description: 'Visual style / intent of the alert.',
    },
    message: {
      control: false,
      description: '(Derived from locale in render).',
    },
  },
  // Provide placeholder message to satisfy required prop typing; real value set in render.
  args: { type: 'success', message: '' },
} satisfies Meta<typeof AlertMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

// Locale resolution helper
const resolve = (locale: string | undefined, map: Record<string, string>, fallback = 'en-US') => {
  if (!locale) return map[fallback];
  const lang = locale.split('-')[0];
  return map[locale] || map[lang] || map[fallback];
};

// SUCCESS messages
const successMessages: Record<string, string> = {
  'en-US': 'Everything went smoothly!',
  'fr-FR': 'Tout s\'est bien passé !',
  'es-ES': '¡Todo salió bien!',
  'de-DE': 'Alles hat reibungslos funktioniert!',
  'pt-BR': 'Tudo correu bem!',
  'ru-RU': 'Все прошло гладко!',
  'ja-JP': 'すべて順調に完了しました！',
  'ko-KR': '모든 것이 순조롭게 진행되었어요!',
  'th-TH': 'ทุกอย่างราบรื่นดี!',
};
export const Success: Story = {
  args: { type: 'success', message: '' },
  render: (args, { globals }) => {
    const message = resolve(globals.locale as string, successMessages);
    return <AlertMessage {...args} message={message} data-locale={globals.locale} />;
  },
};

// WARNING messages
const warningMessages: Record<string, string> = {
  'en-US': 'Be careful – double check your input.',
  'fr-FR': 'Faites attention – vérifiez votre saisie.',
  'es-ES': 'Ten cuidado: revisa tu entrada.',
  'de-DE': 'Vorsicht – prüfen Sie Ihre Eingabe.',
  'pt-BR': 'Cuidado – confira sua entrada.',
  'ru-RU': 'Будьте внимательны — проверьте ввод.',
};
export const Warning: Story = {
  args: { type: 'warning', message: '' },
  render: (args, { globals }) => {
    const message = resolve(globals.locale as string, warningMessages);
    return <AlertMessage {...args} message={message} data-locale={globals.locale} />;
  },
};

// ALERT messages
const alertMessages: Record<string, string> = {
  'en-US': 'Something went wrong. Please retry.',
  'fr-FR': 'Un problème est survenu. Réessayez.',
  'es-ES': 'Algo salió mal. Inténtalo de nuevo.',
  'de-DE': 'Etwas ist schiefgelaufen. Bitte erneut versuchen.',
  'pt-BR': 'Algo deu errado. Tente novamente.',
  'ru-RU': 'Что-то пошло не так. Повторите попытку.',
  'ja-JP': '問題が発生しました。再試行してください。',
};
export const Alert: Story = {
  args: { type: 'alert', message: '' },
  render: (args, { globals }) => {
    const message = resolve(globals.locale as string, alertMessages);
    return <AlertMessage {...args} message={message} data-locale={globals.locale} />;
  },
};

// HTML messages
const htmlMessages: Record<string, string> = {
  'en-US': '<strong>Heads up:</strong> You can include <em>formatted</em> text and <a href=\'#\' onclick=\'return false;\'>links</a>.',
  'fr-FR': '<strong>Attention :</strong> Vous pouvez inclure du texte <em>formaté</em> et des <a href=\'#\' onclick=\'return false;\'>liens</a>.',
  'es-ES': '<strong>Atención:</strong> Puedes incluir texto <em>formateado</em> y <a href=\'#\' onclick=\'return false;\'>enlaces</a>.',
  'de-DE': '<strong>Achtung:</strong> Sie können <em>formatierten</em> Text und <a href=\'#\' onclick=\'return false;\'>Links</a> einfügen.',
  'pt-BR': '<strong>Atenção:</strong> Você pode incluir texto <em>formatado</em> e <a href=\'#\' onclick=\'return false;\'>links</a>.',
};
export const WithHTML: Story = {
  name: 'With HTML Content',
  args: { type: 'warning', message: '' },
  parameters: {
    docs: { description: { story: 'Localized HTML content based on selected locale.' } },
  },
  render: (args, { globals }) => {
    const message = resolve(globals.locale as string, htmlMessages);
    return <AlertMessage {...args} message={message} data-locale={globals.locale} />;
  },
};

