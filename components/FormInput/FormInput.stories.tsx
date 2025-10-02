import FormInput from './index';
import { defineMessages, resolveLocaleValue } from '../../.storybook/locale-utils';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * FormInput provides a text input with label wrapper and optional autofocus.
 */
const meta = {
  component: FormInput,
  title: 'Components/FormInput',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    label: {
      control: false,
      description: '(Derived from locale in render)',
    },
    value: {
      control: 'text',
      description: 'Input value',
    },
    autofocus: {
      control: 'boolean',
      description: 'Auto-focus the input on mount',
    },
    onChange: {
      control: false,
      description: 'Change handler',
    },
  },
} satisfies Meta<typeof FormInput>;

type Story = StoryObj<typeof meta>;

const emailLabelMessages = defineMessages({
  'en-US': 'Email Address',
  'fr-FR': 'Adresse e-mail',
  'es-ES': 'Correo electrónico',
  'de-DE': 'E-Mail-Adresse',
  'pt-BR': 'Endereço de e-mail',
  'ru-RU': 'Адрес электронной почты',
  'zh-CN': '电子邮件地址',
  'ja-JP': 'メールアドレス',
  'ko-KR': '이메일 주소',
  'th-TH': 'ที่อยู่อีเมล',
});

const usernameLabelMessages = defineMessages({
  'en-US': 'Username',
  'fr-FR': "Nom d'utilisateur",
  'es-ES': 'Nombre de usuario',
  'de-DE': 'Benutzername',
  'pt-BR': 'Nome de usuário',
  'ru-RU': 'Имя пользователя',
  'zh-CN': '用户名',
  'ja-JP': 'ユーザー名',
  'ko-KR': '사용자 이름',
  'th-TH': 'ชื่อผู้ใช้',
});

const emailPlaceholderMessages = defineMessages({
  'en-US': 'user@example.com',
  'fr-FR': 'utilisateur@exemple.com',
  'es-ES': 'usuario@ejemplo.com',
  'de-DE': 'benutzer@beispiel.com',
  'pt-BR': 'usuario@exemplo.com',
  'ru-RU': 'пользователь@пример.com',
  'zh-CN': 'user@example.com',
  'ja-JP': 'user@example.com',
  'ko-KR': 'user@example.com',
  'th-TH': 'user@example.com',
});

const usernamePlaceholderMessages = defineMessages({
  'en-US': 'john_doe',
  'fr-FR': 'jean_dupont',
  'es-ES': 'juan_perez',
  'de-DE': 'max_mustermann',
  'pt-BR': 'joao_silva',
  'ru-RU': 'ivan_ivanov',
  'zh-CN': 'zhang_san',
  'ja-JP': 'tanaka_taro',
  'ko-KR': 'hong_gildong',
  'th-TH': 'somchai_smith',
});

const DefaultStory = (_args: unknown, { globals }: { globals: { locale: string } }) => {
  const [value, setValue] = useState('');
  const label = resolveLocaleValue(globals.locale as string, emailLabelMessages);
  const placeholder = resolveLocaleValue(globals.locale as string, emailPlaceholderMessages);
  return <FormInput label={label} value={value} onChange={setValue} placeholder={placeholder} />;
};

const WithValueStory = (_args: unknown, { globals }: { globals: { locale: string } }) => {
  const [value, setValue] = useState('john@example.com');
  const label = resolveLocaleValue(globals.locale as string, emailLabelMessages);
  return <FormInput label={label} value={value} onChange={setValue} />;
};

const WithAutofocusStory = (_args: unknown, { globals }: { globals: { locale: string } }) => {
  const [value, setValue] = useState('');
  const label = resolveLocaleValue(globals.locale as string, usernameLabelMessages);
  const placeholder = resolveLocaleValue(globals.locale as string, usernamePlaceholderMessages);
  return <FormInput label={label} value={value} onChange={setValue} autofocus placeholder={placeholder} />;
};

export const Default: Story = {
  render: DefaultStory,
};

export const WithValue: Story = {
  render: WithValueStory,
};

export const WithAutofocus: Story = {
  render: WithAutofocusStory,
};

export default meta;
