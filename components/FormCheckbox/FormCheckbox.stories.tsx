import FormCheckbox from './index';
import { defineMessages, resolveLocaleValue } from '../../.storybook/locale-utils';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * FormCheckbox provides a custom checkbox with label.
 */
const meta = {
  component: FormCheckbox,
  title: 'Components/FormCheckbox',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    label: {
      control: false,
      description: '(Derived from locale in render)',
    },
    value: {
      control: 'boolean',
      description: 'Checkbox checked state',
    },
    onChange: {
      control: false,
      description: 'Change handler',
    },
  },
} satisfies Meta<typeof FormCheckbox>;

type Story = StoryObj<typeof meta>;

const rememberMeMessages = defineMessages({
  'en-US': 'Remember me',
  'fr-FR': 'Se souvenir de moi',
  'es-ES': 'Recuérdame',
  'de-DE': 'Angemeldet bleiben',
  'pt-BR': 'Lembre-se de mim',
  'ru-RU': 'Запомнить меня',
  'zh-CN': '记住我',
  'ja-JP': 'ログイン状態を保持',
  'ko-KR': '로그인 상태 유지',
  'th-TH': 'จดจำฉัน',
});

const enableNotificationsMessages = defineMessages({
  'en-US': 'Enable notifications',
  'fr-FR': 'Activer les notifications',
  'es-ES': 'Habilitar notificaciones',
  'de-DE': 'Benachrichtigungen aktivieren',
  'pt-BR': 'Ativar notificações',
  'ru-RU': 'Включить уведомления',
  'zh-CN': '启用通知',
  'ja-JP': '通知を有効にする',
  'ko-KR': '알림 활성화',
  'th-TH': 'เปิดการแจ้งเตือน',
});

const agreeToTermsMessages = defineMessages({
  'en-US': 'I agree to the terms and conditions',
  'fr-FR': "J'accepte les termes et conditions",
  'es-ES': 'Acepto los términos y condiciones',
  'de-DE': 'Ich stimme den Allgemeinen Geschäftsbedingungen zu',
  'pt-BR': 'Eu concordo com os termos e condições',
  'ru-RU': 'Я согласен с условиями использования',
  'zh-CN': '我同意条款和条件',
  'ja-JP': '利用規約に同意します',
  'ko-KR': '이용 약관에 동의합니다',
  'th-TH': 'ฉันยอมรับข้อกำหนดและเงื่อนไข',
});

const UncheckedStory = (_args: unknown, { globals }: { globals: { locale: string } }) => {
  const [value, setValue] = useState(false);
  const label = resolveLocaleValue(globals.locale as string, rememberMeMessages);
  return <FormCheckbox label={label} value={value} onChange={setValue} />;
};

const CheckedStory = (_args: unknown, { globals }: { globals: { locale: string } }) => {
  const [value, setValue] = useState(true);
  const label = resolveLocaleValue(globals.locale as string, rememberMeMessages);
  return <FormCheckbox label={label} value={value} onChange={setValue} />;
};

const NotificationsCheckboxStory = (_args: unknown, { globals }: { globals: { locale: string } }) => {
  const [value, setValue] = useState(false);
  const label = resolveLocaleValue(globals.locale as string, enableNotificationsMessages);
  return <FormCheckbox label={label} value={value} onChange={setValue} />;
};

const TermsCheckboxStory = (_args: unknown, { globals }: { globals: { locale: string } }) => {
  const [value, setValue] = useState(false);
  const label = resolveLocaleValue(globals.locale as string, agreeToTermsMessages);
  return <FormCheckbox label={label} value={value} onChange={setValue} />;
};

export const Unchecked: Story = {
  render: UncheckedStory,
};

export const Checked: Story = {
  render: CheckedStory,
};

export const NotificationsCheckbox: Story = {
  render: NotificationsCheckboxStory,
};

export const TermsCheckbox: Story = {
  render: TermsCheckboxStory,
};

export default meta;
