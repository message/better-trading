import FormCheckbox from './index';
import { defineMessages, resolveLocaleValue } from '../../.storybook/locale-utils';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/FormCheckbox',
  component: FormCheckbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FormCheckbox>;

type Story = StoryObj<typeof meta>;

// Locale definitions
const rememberMeLabels = defineMessages({
  'en-US': 'Remember me',
  'fr-FR': 'Se souvenir de moi',
  'es-ES': 'Recuérdame',
  'de-DE': 'Erinnere dich an mich',
  'pt-BR': 'Lembrar de mim',
  'ru-RU': 'Запомнить меня',
  'zh-CN': '记住我',
  'ja-JP': '私を覚えて',
  'ko-KR': '날 기억해',
  'th-TH': 'จำฉันไว้',
});

const termsLabels = defineMessages({
  'en-US': 'I agree to the terms and conditions',
  'fr-FR': "J'accepte les termes et conditions",
  'es-ES': 'Acepto los términos y condiciones',
  'de-DE': 'Ich stimme den Geschäftsbedingungen zu',
  'pt-BR': 'Eu concordo com os termos e condições',
  'ru-RU': 'Я согласен с условиями и положениями',
  'zh-CN': '我同意条款和条件',
  'ja-JP': '利用規約に同意します',
  'ko-KR': '이용 약관에 동의합니다',
  'th-TH': 'ฉันยอมรับข้อกำหนดและเงื่อนไข',
});

const notificationsLabels = defineMessages({
  'en-US': 'Enable notifications',
  'fr-FR': 'Activer les notifications',
  'es-ES': 'Habilitar notificaciones',
  'de-DE': 'Benachrichtigungen aktivieren',
  'pt-BR': 'Ativar notificações',
  'ru-RU': 'Включить уведомления',
  'zh-CN': '启用通知',
  'ja-JP': '通知を有効にする',
  'ko-KR': '알림 활성화',
  'th-TH': 'เปิดใช้งานการแจ้งเตือน',
});

const darkModeLabels = defineMessages({
  'en-US': 'Dark mode',
  'fr-FR': 'Mode sombre',
  'es-ES': 'Modo oscuro',
  'de-DE': 'Dunkler Modus',
  'pt-BR': 'Modo escuro',
  'ru-RU': 'Темный режим',
  'zh-CN': '深色模式',
  'ja-JP': 'ダークモード',
  'ko-KR': '다크 모드',
  'th-TH': 'โหมดมืด',
});

const autoSaveLabels = defineMessages({
  'en-US': 'Auto-save changes',
  'fr-FR': 'Enregistrement automatique des modifications',
  'es-ES': 'Guardar cambios automáticamente',
  'de-DE': 'Änderungen automatisch speichern',
  'pt-BR': 'Salvar alterações automaticamente',
  'ru-RU': 'Автоматически сохранять изменения',
  'zh-CN': '自动保存更改',
  'ja-JP': '変更を自動保存',
  'ko-KR': '변경 사항 자동 저장',
  'th-TH': 'บันทึกการเปลี่ยนแปลงอัตโนมัติ',
});

// Wrapper components to handle state
const UncheckedWrapper = ({ locale }: { locale: string }) => {
  const [value, setValue] = useState(false);
  const label = resolveLocaleValue(locale, rememberMeLabels);
  return <FormCheckbox value={value} label={label} onChange={setValue} />;
};

const CheckedWrapper = ({ locale }: { locale: string }) => {
  const [value, setValue] = useState(true);
  const label = resolveLocaleValue(locale, rememberMeLabels);
  return <FormCheckbox value={value} label={label} onChange={setValue} />;
};

const TermsAgreementWrapper = ({ locale }: { locale: string }) => {
  const [value, setValue] = useState(false);
  const label = resolveLocaleValue(locale, termsLabels);
  return <FormCheckbox value={value} label={label} onChange={setValue} />;
};

const NotificationsEnabledWrapper = ({ locale }: { locale: string }) => {
  const [value, setValue] = useState(true);
  const label = resolveLocaleValue(locale, notificationsLabels);
  return <FormCheckbox value={value} label={label} onChange={setValue} />;
};

const DarkModeWrapper = ({ locale }: { locale: string }) => {
  const [value, setValue] = useState(false);
  const label = resolveLocaleValue(locale, darkModeLabels);
  return <FormCheckbox value={value} label={label} onChange={setValue} />;
};

const AutoSaveWrapper = ({ locale }: { locale: string }) => {
  const [value, setValue] = useState(true);
  const label = resolveLocaleValue(locale, autoSaveLabels);
  return <FormCheckbox value={value} label={label} onChange={setValue} />;
};

export const Unchecked: Story = {
  args: {} as never,
  render: (args, { globals }) => <UncheckedWrapper locale={globals.locale as string} />,
};

export const Checked: Story = {
  args: {} as never,
  render: (args, { globals }) => <CheckedWrapper locale={globals.locale as string} />,
};

export const TermsAgreement: Story = {
  args: {} as never,
  render: (args, { globals }) => <TermsAgreementWrapper locale={globals.locale as string} />,
};

export const NotificationsEnabled: Story = {
  args: {} as never,
  render: (args, { globals }) => <NotificationsEnabledWrapper locale={globals.locale as string} />,
};

export const DarkMode: Story = {
  args: {} as never,
  render: (args, { globals }) => <DarkModeWrapper locale={globals.locale as string} />,
};

export const AutoSave: Story = {
  args: {} as never,
  render: (args, { globals }) => <AutoSaveWrapper locale={globals.locale as string} />,
};

export default meta;
