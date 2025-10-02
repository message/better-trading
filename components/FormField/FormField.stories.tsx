import FormField from './index';
import { defineMessages, resolveLocaleValue } from '../../.storybook/locale-utils';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * FormField provides a label wrapper for form inputs with optional helper text.
 */
const meta = {
  component: FormField,
  title: 'Components/FormField',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    label: {
      control: false,
      description: '(Derived from locale in render)',
    },
    helper: {
      control: false,
      description: '(Derived from locale in render)',
    },
    children: {
      control: false,
      description: 'Input element or other form control',
    },
  },
} satisfies Meta<typeof FormField>;

type Story = StoryObj<typeof meta>;

const labelMessages = defineMessages({
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

const helperMessages = defineMessages({
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

export const Default: Story = {
  render: (_args, { globals }) => {
    const label = resolveLocaleValue(globals.locale as string, labelMessages);
    return (
      <FormField label={label}>
        <input type="text" style={{ padding: '5px' }} />
      </FormField>
    );
  },
};

export const WithHelper: Story = {
  render: (_args, { globals }) => {
    const label = resolveLocaleValue(globals.locale as string, labelMessages);
    const helper = resolveLocaleValue(globals.locale as string, helperMessages);
    return (
      <FormField label={label} helper={helper}>
        <input type="text" style={{ padding: '5px' }} />
      </FormField>
    );
  },
};

export default meta;
