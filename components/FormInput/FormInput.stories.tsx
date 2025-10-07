import FormInput from './index';
import { defineMessages, resolveLocaleValue } from '../../.storybook/locale-utils';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/FormInput',
  component: FormInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FormInput>;

type Story = StoryObj<typeof meta>;

// Locale definitions
const usernameLabels = defineMessages({
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

const emailLabels = defineMessages({
  'en-US': 'Email Address',
  'fr-FR': 'Adresse e-mail',
  'es-ES': 'Dirección de correo electrónico',
  'de-DE': 'E-Mail-Adresse',
  'pt-BR': 'Endereço de e-mail',
  'ru-RU': 'Адрес электронной почты',
  'zh-CN': '电子邮件地址',
  'ja-JP': 'メールアドレス',
  'ko-KR': '이메일 주소',
  'th-TH': 'ที่อยู่อีเมล',
});

const searchLabels = defineMessages({
  'en-US': 'Search',
  'fr-FR': 'Rechercher',
  'es-ES': 'Buscar',
  'de-DE': 'Suchen',
  'pt-BR': 'Pesquisar',
  'ru-RU': 'Поиск',
  'zh-CN': '搜索',
  'ja-JP': '検索',
  'ko-KR': '검색',
  'th-TH': 'ค้นหา',
});

const usernamePlaceholders = defineMessages({
  'en-US': 'Enter your username',
  'fr-FR': "Entrez votre nom d'utilisateur",
  'es-ES': 'Ingrese su nombre de usuario',
  'de-DE': 'Geben Sie Ihren Benutzernamen ein',
  'pt-BR': 'Digite seu nome de usuário',
  'ru-RU': 'Введите ваше имя пользователя',
  'zh-CN': '输入您的用户名',
  'ja-JP': 'ユーザー名を入力してください',
  'ko-KR': '사용자 이름을 입력하세요',
  'th-TH': 'ป้อนชื่อผู้ใช้ของคุณ',
});

const searchPlaceholders = defineMessages({
  'en-US': 'Search for items...',
  'fr-FR': 'Rechercher des objets...',
  'es-ES': 'Buscar artículos...',
  'de-DE': 'Nach Gegenständen suchen...',
  'pt-BR': 'Pesquisar itens...',
  'ru-RU': 'Искать предметы...',
  'zh-CN': '搜索物品...',
  'ja-JP': 'アイテムを検索...',
  'ko-KR': '아이템 검색...',
  'th-TH': 'ค้นหาไอเท็ม...',
});

// Wrapper components to handle state
const DefaultWrapper = ({ locale }: { locale: string }) => {
  const [value, setValue] = useState('');
  const label = resolveLocaleValue(locale, usernameLabels);
  return <FormInput label={label} value={value} onChange={setValue} />;
};

const WithValueWrapper = ({ locale }: { locale: string }) => {
  const [value, setValue] = useState('john.doe');
  const label = resolveLocaleValue(locale, usernameLabels);
  return <FormInput label={label} value={value} onChange={setValue} />;
};

const WithPlaceholderWrapper = ({ locale }: { locale: string }) => {
  const [value, setValue] = useState('');
  const label = resolveLocaleValue(locale, usernameLabels);
  const placeholder = resolveLocaleValue(locale, usernamePlaceholders);
  return <FormInput label={label} value={value} onChange={setValue} placeholder={placeholder} />;
};

const WithAutofocusWrapper = ({ locale }: { locale: string }) => {
  const [value, setValue] = useState('');
  const label = resolveLocaleValue(locale, searchLabels);
  const placeholder = resolveLocaleValue(locale, searchPlaceholders);
  return <FormInput label={label} value={value} onChange={setValue} placeholder={placeholder} autofocus />;
};

const EmailInputWrapper = ({ locale }: { locale: string }) => {
  const [value, setValue] = useState('');
  const label = resolveLocaleValue(locale, emailLabels);
  return <FormInput label={label} value={value} onChange={setValue} type="email" />;
};

export const Default: Story = {
  args: {} as never,
  render: (args, { globals }) => <DefaultWrapper locale={globals.locale as string} />,
};

export const WithValue: Story = {
  args: {} as never,
  render: (args, { globals }) => <WithValueWrapper locale={globals.locale as string} />,
};

export const WithPlaceholder: Story = {
  args: {} as never,
  render: (args, { globals }) => <WithPlaceholderWrapper locale={globals.locale as string} />,
};

export const WithAutofocus: Story = {
  args: {} as never,
  render: (args, { globals }) => <WithAutofocusWrapper locale={globals.locale as string} />,
};

export const EmailInput: Story = {
  args: {} as never,
  render: (args, { globals }) => <EmailInputWrapper locale={globals.locale as string} />,
};

export default meta;
